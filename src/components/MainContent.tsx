import { useState, useEffect } from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { CarrierTable } from "./CarrierTable";
import { FilterPanel } from "./FilterPanel";
import { CallLogsTable } from "./CallLogsTable";
import { ScrapingSection } from "./ScrapingSection";
import { DataSection } from "./DataSection";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export interface CarrierData {
  "MC Number": string;
  "Mailing Address": string;
  "State": string;
  "Phone": string;
  "Drivers": string;
  "Power Units": string;
  "MC Age": string;
  "Email": string;
  "Carrier Operation": string;
  "Straight Trucks": string;
  "Truck Tractors": string;
  "Trailers": string;
}

export interface CallLog {
  id: string;
  phoneNumber: string;
  carrierName: string; // This is MC Number
  callCount: number;
  lastCalled: Date;
}

// For bulk call API
export interface BulkCallRequestItem {
  phone_number: string;
  mc_number: string;
  state: string;
}

interface MainContentProps {
  activeSection: string;
}

const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Network response was not ok" }));
    throw new Error(errorData.message || `Error fetching ${url}`);
  }
  return response.json();
};


export function MainContent({ activeSection }: MainContentProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [filteredData, setFilteredData] = useState<CarrierData[]>([]);

  const { data: carriersResponse, isLoading: isLoadingCarriers, error: carriersError } = useQuery<{ data: CarrierData[] }>({
    queryKey: ['carriers'],
    queryFn: () => fetchData(`${API_BASE_URL}/carriers`),
  });

  const { data: callLogsResponse, isLoading: isLoadingCallLogs, error: callLogsError } = useQuery<{ data: any[] }>({
    queryKey: ['callLogs'],
    queryFn: () => fetchData(`${API_BASE_URL}/call_logs`),
  });

  const carrierData = carriersResponse?.data || [];
  
  const callLogs: CallLog[] = (callLogsResponse?.data || [])
    .map(log => {
      let lastCalledDate = new Date(log.lastCalled);
      if (isNaN(lastCalledDate.getTime())) {
        console.warn(`Invalid date for call log ID ${log.id}: ${log.lastCalled}. Using epoch.`);
        lastCalledDate = new Date(0); 
      }
      return {
        ...log,
        lastCalled: lastCalledDate,
      };
    })
    .sort((a, b) => b.lastCalled.getTime() - a.lastCalled.getTime());


  useEffect(() => {
    if (carrierData) {
      setFilteredData(carrierData);
    }
  }, [carrierData]);
  
  useEffect(() => {
    if (carriersError) {
      toast({ title: "Error fetching carriers", description: carriersError.message, variant: "destructive" });
    }
    if (callLogsError) {
      toast({ title: "Error fetching call logs", description: callLogsError.message, variant: "destructive" });
    }
  }, [carriersError, callLogsError, toast]);

  const logCallMutation = useMutation({
    mutationFn: async ({ phoneNumber, mcNumber }: { phoneNumber: string, mcNumber: string }) => {
      const response = await fetch(`${API_BASE_URL}/log_call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber, mc_number: mcNumber }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to log call" }));
        throw new Error(errorData.message || "Failed to log call");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callLogs'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error Logging Call", description: error.message, variant: "destructive" });
    },
  });

  const makeCallMutation = useMutation({
    mutationFn: async ({ phoneNumber, mcNumber, state }: { phoneNumber: string, mcNumber: string, state: string }) => {
      const response = await fetch(`${API_BASE_URL}/make_call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber, mc_number: mcNumber, state: state }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to initiate call");
      }
      return { ...result, phoneNumber, mcNumber }; 
    },
    onSuccess: (data) => {
      toast({ 
        title: `Call to ${data.phoneNumber} Initiated`, 
        description: (
          <div>
            <p>{data.message}</p>
            {data.hook && <p className="mt-1 text-xs"><strong>Hook:</strong> {data.hook}</p>}
            {data.voicemail && <p className="text-xs"><strong>Voicemail:</strong> {data.voicemail}</p>}
          </div>
        ),
        duration: 7000,
      });
      logCallMutation.mutate({ phoneNumber: data.phoneNumber, mcNumber: data.mcNumber });
    },
    onError: (error: Error) => {
      toast({ title: "Error Making Call", description: error.message, variant: "destructive" });
    },
  });

  const bulkMakeCallMutation = useMutation({
    mutationFn: async (callRequests: BulkCallRequestItem[]) => {
      const response = await fetch(`${API_BASE_URL}/bulk_make_call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(callRequests),
      });
      const result = await response.json();
      // Check for non-200 status, but allow if backend signals partial success with a 200
      if (!response.ok && result.status !== "partial_success") { 
        throw new Error(result.message || "Bulk call request failed at network level");
      }
      return result;
    },
    onSuccess: (data) => {
      const successCount = data.results.filter((r: any) => r.status === 'success').length;
      const errorCount = data.results.filter((r: any) => r.status === 'error').length;

      toast({
        title: "Bulk Call Processed",
        description: `${successCount} calls initiated successfully. ${errorCount} calls failed. Check console for details.`,
        duration: 7000,
      });
      console.log("Frontend: Bulk call results from backend:", data.results);
      queryClient.invalidateQueries({ queryKey: ['callLogs'] });
    },
    onError: (error: Error) => {
      toast({ title: "Bulk Call Request Error", description: error.message, variant: "destructive" });
    }
  });

  const handleCall = (phoneNumber: string, mcNumber: string) => {
    const carrier = carrierData.find(c => c["MC Number"] === mcNumber);
    const state = carrier ? carrier.State : ''; 
    makeCallMutation.mutate({ phoneNumber, mcNumber, state });
  };

  // This function receives an array of objects { phoneNumber: string, mcNumber: string, state: string }
  const handleBulkCall = (selectedItems: Array<{ phoneNumber: string, mcNumber: string, state: string }>) => {
    const callRequests: BulkCallRequestItem[] = selectedItems.map(item => ({
        phone_number: item.phoneNumber,
        mc_number: item.mcNumber,
        state: item.state,
    }));

    // console.log("Frontend: Preparing to send bulk call requests to MainContent handler:", JSON.stringify(callRequests, null, 2)); 
    // This console log was for debugging the input to this function.
    // The one that matters for API call is inside the mutation's body if needed.

    if (callRequests.length > 0) {
        bulkMakeCallMutation.mutate(callRequests);
    } else {
        toast({
            title: "No Valid Items",
            description: "No valid items to process for bulk call after filtering.",
            variant: "default"
        });
    }
  };
  
  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['carriers'] });
  };

  const renderContent = () => {
    if (isLoadingCarriers && activeSection === 'data') return <div className="p-6 text-center">Loading carrier data...</div>;
    if (isLoadingCallLogs && activeSection === 'call-logs') return <div className="p-6 text-center">Loading call logs...</div>;

    switch (activeSection) {
      case 'scraping':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Scraping</h2>
              <p className="text-gray-600">
                Enter a range of MC Numbers to scrape carrier data. Scraped data will be added to the Carrier Database.
              </p>
            </div>
            <div className="flex-1">
              <ScrapingSection />
            </div>
          </div>
        );
      
      case 'data':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrier Data Management</h2>
              <p className="text-gray-600 mb-4">
                Upload CSV files or scrape to populate the carrier database. Filter and call carriers.
              </p>
            </div>
            <div className="flex-shrink-0 mb-4">
              <DataSection onUploadSuccess={handleUploadSuccess} />
            </div>
            <div className="flex-shrink-0 mb-4">
              <FilterPanel 
                data={carrierData} 
                onFilter={setFilteredData} 
              />
            </div>
            <div className="flex-1 min-h-0">
              <CarrierTable 
                data={filteredData} 
                allCarriers={carrierData}
                onCall={handleCall}
                onBulkCall={handleBulkCall}
                isBulkCalling={bulkMakeCallMutation.isPending}
                isSingleCalling={makeCallMutation.isPending}
              />
            </div>
          </div>
        );
      
      case 'call-logs':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Management</h2>
              <p className="text-gray-600">
                Track and manage all outbound calls to carriers with recall functionality.
              </p>
            </div>
            <div className="flex-1 min-h-0">
              <CallLogsTable
                logs={callLogs} 
                allCarriers={carrierData} // Pass all carriers to find state for bulk recalls
                onRecall={handleCall} // onRecall for single items triggers the makeCall -> logCall chain
                onBulkRecall={handleBulkCall} // Prop for bulk recall actions
                isBulkRecalling={bulkMakeCallMutation.isPending}
                isSingleRecalling={makeCallMutation.isPending}
              />
            </div>
          </div>
        );
      
      default:
        return <div className="p-6 text-center">Select a section from the menu.</div>;
    }
  };

  return (
    <SidebarInset>
      <div className="border-b border-gray-200 bg-white px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-md" />
          <h1 className="text-xl font-bold text-gray-900">Automated Caller.</h1>
        </div>
      </div>

      <div className="flex-1 p-6 min-h-0">
        {renderContent()}
      </div>
    </SidebarInset>
  );
}