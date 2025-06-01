import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Mail, ArrowUp, ArrowDown } from "lucide-react";
import { CarrierData } from "./MainContent"; 
import { CallLog } from "./MainContent";
import { useToast } from "@/hooks/use-toast";

interface CarrierTableProps {
  data: CarrierData[]; 
  allCarriers: CarrierData[]; 
  callLogs: CallLog[];
  onCall: (phoneNumber: string, mcNumber: string) => void;
  onBulkCall: (itemsToCall: Array<{ phoneNumber: string, mcNumber: string, state: string }>) => void; 
  isBulkCalling?: boolean; 
  isSingleCalling?: boolean; 
}

export function CarrierTable({ 
  data: filteredDisplayData, 
  allCarriers,
  callLogs,
  onCall, 
  onBulkCall,
  isBulkCalling,
  isSingleCalling 
}: CarrierTableProps) {
  const [sortField, setSortField] = useState<keyof CarrierData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCarriersMC, setSelectedCarriersMC] = useState<string[]>([]);
  const { toast } = useToast();

  // Create a Set of MC Numbers that have been called for quick lookup
  const calledMCNumbers = new Set(callLogs.map(log => log.carrierName));

  const handleSort = (field: keyof CarrierData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDisplayData = [...filteredDisplayData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField] || ""; 
    const bVal = b[sortField] || "";
    if (['Drivers', 'Power Units', 'MC Age', 'Straight Trucks', 'Truck Tractors', 'Trailers'].includes(sortField)) {
        const aNum = parseInt(String(aVal), 10);
        const bNum = parseInt(String(bVal), 10);
        if (!isNaN(aNum) && !isNaN(bNum)) return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    }
    return sortDirection === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const handleIndividualCall = (e: React.MouseEvent, phoneNumber: string, mcNumber: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!phoneNumber || String(phoneNumber).trim() === '' || String(phoneNumber) === '0') {
      toast({
        title: "Validation Error", description: "No valid phone number for this carrier.", variant: "destructive",
      });
      return;
    }
    onCall(String(phoneNumber), mcNumber); 
  };

  const handleSelectAll = (checked: boolean | string) => {
    if (checked === true) {
      setSelectedCarriersMC(sortedDisplayData.map(carrier => carrier["MC Number"]));
    } else {
      setSelectedCarriersMC([]);
    }
  };

  const handleSelectCarrier = (mcNumber: string, checked: boolean | string) => {
    if (checked === true) {
      setSelectedCarriersMC(prev => [...prev, mcNumber]);
    } else {
      setSelectedCarriersMC(prev => prev.filter(id => id !== mcNumber));
    }
  };

  const handleBulkCallAction = () => {
    const selectedCarrierObjects = sortedDisplayData.filter(carrier =>
      selectedCarriersMC.includes(carrier["MC Number"])
    );

    const itemsToCall: Array<{ phoneNumber: string, mcNumber: string, state: string }> = selectedCarrierObjects
      .map(carrier => ({
        phoneNumber: String(carrier.Phone),
        mcNumber: carrier["MC Number"],
        state: carrier.State || '', 
      }))
      .filter(details => details.phoneNumber && details.phoneNumber.trim() !== '' && details.phoneNumber !== '0');
    
    if (itemsToCall.length === 0) {
      toast({
        title: "Selection Error",
        description: "No carriers with valid phone numbers selected for bulk call.",
        variant: "destructive",
      });
      return;
    }
    onBulkCall(itemsToCall); 
    setSelectedCarriersMC([]); 
  };

  const SortIcon = ({ field }: { field: keyof CarrierData }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  // Check if a carrier has already been called
  const hasBeenCalled = (mcNumber: string) => {
    return calledMCNumbers.has(mcNumber);
  };

  if (filteredDisplayData.length === 0 && allCarriers.length > 0) {
     return (
      <Card className="p-8 text-center bg-white">
        <p className="text-gray-500">No carriers match the current filter criteria.</p>
      </Card>
    );
  }

  if (allCarriers.length === 0) {
    return (
      <Card className="p-8 text-center bg-white">
        <p className="text-gray-500">No carrier data available. Upload a CSV file or scrape data to get started.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Carrier Database ({sortedDisplayData.length} of {allCarriers.length} records)
          </h3>
          {selectedCarriersMC.length > 0 && (
            <Button 
                onClick={handleBulkCallAction} 
                className="bg-green-600 hover:bg-green-700 text-white h-7 px-2 text-xs"
                disabled={isBulkCalling}
                size="sm"
            >
              <Phone className="w-3 h-3 mr-1" />
              {isBulkCalling ? 'Calling...' : `Call Selected (${selectedCarriersMC.length})`}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-max text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left bg-gray-50">
                <Checkbox
                  checked={selectedCarriersMC.length === sortedDisplayData.length && sortedDisplayData.length > 0}
                  onCheckedChange={handleSelectAll}
                  disabled={sortedDisplayData.length === 0}
                />
              </th>
              {[
                { key: 'MC Number', label: 'MC Number' }, { key: 'Mailing Address', label: 'Address' },
                { key: 'State', label: 'State' }, { key: 'Phone', label: 'Phone' },
                { key: 'Drivers', label: 'Drivers' }, { key: 'Power Units', label: 'P. Units' },
                { key: 'MC Age', label: 'MC Age' }, { key: 'Email', label: 'Email' },
                { key: 'Carrier Operation', label: 'Operation' }, { key: 'Straight Trucks', label: 'S. Trucks' },
                { key: 'Truck Tractors', label: 'Tractors' }, { key: 'Trailers', label: 'Trailers' },
              ].map(({ key, label }) => (
                <th key={key} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(key as keyof CarrierData)}>
                  <div className="flex items-center">{label}<SortIcon field={key as keyof CarrierData} /></div>
                </th>
              ))}
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDisplayData.map((carrier) => {
              const isAlreadyCalled = hasBeenCalled(carrier["MC Number"]);
              const isCallButtonDisabled = !carrier['Phone'] || 
                String(carrier['Phone']).trim() === '' || 
                String(carrier['Phone']) === '0' || 
                isSingleCalling || 
                isAlreadyCalled;

              return (
                <tr key={carrier["MC Number"]} className="hover:bg-gray-50 group">
                  <td className="px-3 py-2 whitespace-nowrap bg-white group-hover:bg-gray-50">
                    <Checkbox
                      checked={selectedCarriersMC.includes(carrier["MC Number"])}
                      onCheckedChange={(checked) => handleSelectCarrier(carrier["MC Number"], checked as boolean)}
                    />
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap"><Badge variant="outline" className="font-mono text-xs">{carrier['MC Number']}</Badge></td>
                  <td className="px-2 py-2 text-xs text-gray-700 max-w-xs truncate" title={carrier['Mailing Address']}>{carrier['Mailing Address']}</td>
                  <td className="px-2 py-2 whitespace-nowrap"><Badge variant="secondary" className="text-xs">{carrier['State']}</Badge></td>
                  <td className="px-2 py-2 whitespace-nowrap font-mono text-xs">{String(carrier['Phone'])}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 text-center">{carrier['Drivers']}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 text-center">{carrier['Power Units']}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 text-center">{carrier['MC Age']}</td>
                  <td className="px-2 py-2 text-xs text-gray-700 max-w-[120px] truncate" title={carrier['Email']}>{carrier['Email']}</td>
                  <td className="px-2 py-2 whitespace-nowrap"><Badge className="text-xs" variant={carrier['Carrier Operation'] === 'Interstate' ? 'default' : 'secondary'}>{carrier['Carrier Operation']}</Badge></td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 text-center">{carrier['Straight Trucks']}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 text-center">{carrier['Truck Tractors']}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 text-center">{carrier['Trailers']}</td>
                  <td className="px-3 py-2 whitespace-nowrap bg-white group-hover:bg-gray-50">
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        onClick={(e) => handleIndividualCall(e, String(carrier['Phone']), carrier['MC Number'])}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 h-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isCallButtonDisabled}
                        title={isAlreadyCalled ? "Carrier has already been called" : ""}
                      >
                        <Phone className="w-3 h-3 mr-1" /> 
                        {isSingleCalling ? 'Calling...' : isAlreadyCalled ? 'Called' : 'Call'}
                      </Button>
                      {carrier['Email'] && String(carrier['Email']).trim() !== '' && (
                        <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${carrier['Email']}`)} className="text-xs px-2 py-1 h-6">
                          <Mail className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
