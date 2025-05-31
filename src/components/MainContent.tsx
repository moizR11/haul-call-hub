
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CarrierTable } from "./CarrierTable";
import { FilterPanel } from "./FilterPanel";
import { CallLogs } from "./CallLogs";
import { ScrapingSection } from "./ScrapingSection";
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

// Dummy carrier data
const dummyCarrierData: CarrierData[] = [
  {
    "MC Number": "MC-1614484",
    "Mailing Address": "6664 RIDGWAY DRIVE, PITTSBURGH, PA 15237",
    "State": "Pennsylvania",
    "Phone": "14122544675",
    "Drivers": "1",
    "Power Units": "1",
    "MC Age": "5",
    "Email": "TRUCKDRIVER0520@GMAIL.COM",
    "Carrier Operation": "Interstate",
    "Straight Trucks": "0",
    "Truck Tractors": "1",
    "Trailers": "1"
  },
  {
    "MC Number": "MC-1614485",
    "Mailing Address": "1234 MAIN STREET, DALLAS, TX 75201",
    "State": "Texas",
    "Phone": "14695551234",
    "Drivers": "3",
    "Power Units": "2",
    "MC Age": "3",
    "Email": "CARRIER@EXAMPLE.COM",
    "Carrier Operation": "Interstate",
    "Straight Trucks": "1",
    "Truck Tractors": "1",
    "Trailers": "2"
  },
  {
    "MC Number": "MC-1614486",
    "Mailing Address": "5678 OAK AVENUE, MIAMI, FL 33101",
    "State": "Florida",
    "Phone": "13055551234",
    "Drivers": "5",
    "Power Units": "4",
    "MC Age": "7",
    "Email": "TRANSPORT@EXAMPLE.COM",
    "Carrier Operation": "Interstate",
    "Straight Trucks": "2",
    "Truck Tractors": "2",
    "Trailers": "4"
  },
  {
    "MC Number": "MC-1614487",
    "Mailing Address": "9999 HIGHWAY 101, SACRAMENTO, CA 95814",
    "State": "California",
    "Phone": "19165551234",
    "Drivers": "2",
    "Power Units": "2",
    "MC Age": "2",
    "Email": "LOGISTICS@EXAMPLE.COM",
    "Carrier Operation": "Interstate",
    "Straight Trucks": "0",
    "Truck Tractors": "2",
    "Trailers": "2"
  }
];

// Dummy call logs
const dummyCallLogs: CallLog[] = [
  {
    id: "1",
    phoneNumber: "14122544675",
    carrierName: "MC-1614484",
    callCount: 2,
    lastCalled: new Date("2024-01-15T10:30:00")
  },
  {
    id: "2",
    phoneNumber: "14695551234",
    carrierName: "MC-1614485",
    callCount: 1,
    lastCalled: new Date("2024-01-14T14:20:00")
  },
  {
    id: "3",
    phoneNumber: "13055551234",
    carrierName: "MC-1614486",
    callCount: 3,
    lastCalled: new Date("2024-01-16T09:15:00")
  }
];

interface MainContentProps {
  activeSection: string;
}

export function MainContent({ activeSection }: MainContentProps) {
  const [carrierData, setCarrierData] = useState<CarrierData[]>(dummyCarrierData);
  const [filteredData, setFilteredData] = useState<CarrierData[]>(dummyCarrierData);
  const [callLogs, setCallLogs] = useState<CallLog[]>(dummyCallLogs);

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

  const renderContent = () => {
    switch (activeSection) {
      case 'scraping':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Scraping</h2>
              <p className="text-gray-600 mb-6">
                Enter a range of MC Numbers to scrape carrier data from the FMCSA database.
              </p>
            </div>
            <ScrapingSection />
          </div>
        );
      
      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Carrier Data Management</h2>
              <p className="text-gray-600 mb-6">
                Upload CSV files containing carrier information or view and filter existing data.
              </p>
            </div>
            <DataSection onDataUpload={handleDataUpload} />
            <FilterPanel 
              data={carrierData} 
              onFilter={setFilteredData} 
            />
            <CarrierTable 
              data={filteredData} 
              onCall={handleCall}
            />
          </div>
        );
      
      case 'call-logs':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Call Management</h2>
              <p className="text-gray-600 mb-6">
                Track and manage all outbound calls to carriers with recall functionality.
              </p>
            </div>
            <CallLogs 
              logs={callLogs} 
              onRecall={handleCall}
            />
          </div>
        );
      
      default:
        return <div>Select a section from the menu</div>;
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-md" />
          <h1 className="text-2xl font-bold text-gray-900">Carrier Management Dashboard</h1>
        </div>
      </div>

      <div className="flex-1 p-6">
        {renderContent()}
      </div>
    </main>
  );
}
