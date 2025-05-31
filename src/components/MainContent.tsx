
import { useState } from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { CarrierTable } from "./CarrierTable";
import { FilterPanel } from "./FilterPanel";
import { CallLogsTable } from "./CallLogsTable";
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

// Expanded dummy carrier data
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
  },
  {
    "MC Number": "MC-1614488",
    "Mailing Address": "777 INTERSTATE BLVD, ATLANTA, GA 30309",
    "State": "Georgia",
    "Phone": "14045551234",
    "Drivers": "8",
    "Power Units": "6",
    "MC Age": "10",
    "Email": "FREIGHT@EXAMPLE.COM",
    "Carrier Operation": "Interstate",
    "Straight Trucks": "3",
    "Truck Tractors": "3",
    "Trailers": "6"
  },
  {
    "MC Number": "MC-1614489",
    "Mailing Address": "456 COMMERCE ST, PHOENIX, AZ 85001",
    "State": "Arizona",
    "Phone": "16025551234",
    "Drivers": "4",
    "Power Units": "3",
    "MC Age": "6",
    "Email": "DESERT@EXAMPLE.COM",
    "Carrier Operation": "Interstate",
    "Straight Trucks": "1",
    "Truck Tractors": "2",
    "Trailers": "3"
  },
  {
    "MC Number": "MC-1614490",
    "Mailing Address": "321 TRUCK LANE, NASHVILLE, TN 37201",
    "State": "Tennessee",
    "Phone": "16155551234",
    "Drivers": "6",
    "Power Units": "5",
    "MC Age": "8",
    "Email": "MUSIC@EXAMPLE.COM",
    "Carrier Operation": "Interstate",
    "Straight Trucks": "2",
    "Truck Tractors": "3",
    "Trailers": "5"
  },
  {
    "MC Number": "MC-1614491",
    "Mailing Address": "890 CARGO WAY, DENVER, CO 80202",
    "State": "Colorado",
    "Phone": "17205551234",
    "Drivers": "3",
    "Power Units": "3",
    "MC Age": "4",
    "Email": "MOUNTAIN@EXAMPLE.COM",
    "Carrier Operation": "Interstate",
    "Straight Trucks": "1",
    "Truck Tractors": "2",
    "Trailers": "3"
  },
  {
    "MC Number": "MC-1614492",
    "Mailing Address": "123 FREIGHT AVE, CHICAGO, IL 60601",
    "State": "Illinois",
    "Phone": "13125551234",
    "Drivers": "12",
    "Power Units": "10",
    "MC Age": "15",
    "Email": "WINDY@EXAMPLE.COM",
    "Carrier Operation": "Interstate",
    "Straight Trucks": "4",
    "Truck Tractors": "6",
    "Trailers": "10"
  },
  {
    "MC Number": "MC-1614493",
    "Mailing Address": "567 HAUL ROAD, SEATTLE, WA 98101",
    "State": "Washington",
    "Phone": "12065551234",
    "Drivers": "7",
    "Power Units": "5",
    "MC Age": "9",
    "Email": "PACIFIC@EXAMPLE.COM",
    "Carrier Operation": "Interstate",
    "Straight Trucks": "2",
    "Truck Tractors": "3",
    "Trailers": "5"
  }
];

// Expanded dummy call logs
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
  },
  {
    id: "4",
    phoneNumber: "19165551234",
    carrierName: "MC-1614487",
    callCount: 1,
    lastCalled: new Date("2024-01-13T16:45:00")
  },
  {
    id: "5",
    phoneNumber: "14045551234",
    carrierName: "MC-1614488",
    callCount: 4,
    lastCalled: new Date("2024-01-17T11:20:00")
  },
  {
    id: "6",
    phoneNumber: "16025551234",
    carrierName: "MC-1614489",
    callCount: 2,
    lastCalled: new Date("2024-01-12T13:30:00")
  },
  {
    id: "7",
    phoneNumber: "16155551234",
    carrierName: "MC-1614490",
    callCount: 1,
    lastCalled: new Date("2024-01-18T08:15:00")
  },
  {
    id: "8",
    phoneNumber: "17205551234",
    carrierName: "MC-1614491",
    callCount: 3,
    lastCalled: new Date("2024-01-11T15:45:00")
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
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Scraping</h2>
              <p className="text-gray-600">
                Enter a range of MC Numbers to scrape carrier data from the FMCSA database.
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
                Upload CSV files containing carrier information or view and filter existing data.
              </p>
            </div>
            <div className="flex-shrink-0 mb-4">
              <DataSection onDataUpload={handleDataUpload} />
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
                onCall={handleCall}
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
                onRecall={handleCall}
              />
            </div>
          </div>
        );
      
      default:
        return <div>Select a section from the menu</div>;
    }
  };

  return (
    <SidebarInset>
      <div className="border-b border-gray-200 bg-white px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-md" />
          <h1 className="text-xl font-bold text-gray-900">Carrier Management Dashboard</h1>
        </div>
      </div>

      <div className="flex-1 p-6 min-h-0">
        {renderContent()}
      </div>
    </SidebarInset>
  );
}
