
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CarrierTable } from "./CarrierTable";
import { FilterPanel } from "./FilterPanel";
import { CallLogs } from "./CallLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataSection } from "./DataSection";

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
  carrierName: string;
  callCount: number;
  lastCalled: Date;
}

export function MainContent() {
  const [carrierData, setCarrierData] = useState<CarrierData[]>([]);
  const [filteredData, setFilteredData] = useState<CarrierData[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);

  const handleDataUpload = (data: CarrierData[]) => {
    setCarrierData(data);
    setFilteredData(data);
  };

  const handleCall = (phoneNumber: string, mcNumber: string) => {
    const existingLog = callLogs.find(log => log.phoneNumber === phoneNumber);
    
    if (existingLog) {
      setCallLogs(prev => prev.map(log => 
        log.phoneNumber === phoneNumber 
          ? { ...log, callCount: log.callCount + 1, lastCalled: new Date() }
          : log
      ));
    } else {
      const newLog: CallLog = {
        id: Date.now().toString(),
        phoneNumber,
        carrierName: mcNumber,
        callCount: 1,
        lastCalled: new Date(),
      };
      setCallLogs(prev => [...prev, newLog]);
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-md" />
          <h2 className="text-2xl font-bold text-gray-900">Carrier Management Dashboard</h2>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Tabs defaultValue="carriers" className="h-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="carriers">Carrier Data</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="calls">Call Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="carriers" className="space-y-6">
            <FilterPanel 
              data={carrierData} 
              onFilter={setFilteredData} 
            />
            <CarrierTable 
              data={filteredData} 
              onCall={handleCall}
            />
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="max-w-2xl mx-auto">
              <DataSection onDataUpload={handleDataUpload} />
            </div>
          </TabsContent>
          
          <TabsContent value="calls">
            <CallLogs 
              logs={callLogs} 
              onRecall={handleCall}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
