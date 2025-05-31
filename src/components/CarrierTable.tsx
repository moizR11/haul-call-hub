import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Mail, ArrowUp, ArrowDown } from "lucide-react";
import { CarrierData } from "./MainContent";
import { useToast } from "@/hooks/use-toast";

interface CarrierTableProps {
  data: CarrierData[];
  onCall: (phoneNumber: string, mcNumber: string) => void;
  onBulkCall?: (selectedCarriers: CarrierData[]) => void;
}

export function CarrierTable({ data, onCall, onBulkCall }: CarrierTableProps) {
  const [sortField, setSortField] = useState<keyof CarrierData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSort = (field: keyof CarrierData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    // Handle numeric fields
    if (['Drivers', 'Power Units', 'MC Age', 'Straight Trucks', 'Truck Tractors', 'Trailers'].includes(sortField)) {
      const aNum = parseInt(aVal) || 0;
      const bNum = parseInt(bVal) || 0;
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    }
    
    // Handle string fields
    return sortDirection === 'asc' 
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const handleCall = (phoneNumber: string, mcNumber: string) => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast({
        title: "Error",
        description: "No phone number available for this carrier",
        variant: "destructive",
      });
      return;
    }

    onCall(phoneNumber, mcNumber);
    toast({
      title: "Call Initiated",
      description: `Calling ${phoneNumber}`,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCarriers(sortedData.map(carrier => carrier["MC Number"]));
    } else {
      setSelectedCarriers([]);
    }
  };

  const handleSelectCarrier = (mcNumber: string, checked: boolean) => {
    if (checked) {
      setSelectedCarriers([...selectedCarriers, mcNumber]);
    } else {
      setSelectedCarriers(selectedCarriers.filter(id => id !== mcNumber));
    }
  };

  const handleBulkCall = () => {
    const carriersToCall = sortedData.filter(carrier => 
      selectedCarriers.includes(carrier["MC Number"])
    );
    
    if (carriersToCall.length === 0) {
      toast({
        title: "Error",
        description: "No carriers selected",
        variant: "destructive",
      });
      return;
    }

    carriersToCall.forEach(carrier => {
      if (carrier.Phone && carrier.Phone.trim() !== '') {
        onCall(carrier.Phone, carrier["MC Number"]);
      }
    });

    toast({
      title: "Bulk Calls Initiated",
      description: `Calling ${carriersToCall.length} carriers`,
    });

    setSelectedCarriers([]);
  };

  const SortIcon = ({ field }: { field: keyof CarrierData }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  if (data.length === 0) {
    return (
      <Card className="p-8 text-center bg-white">
        <p className="text-gray-500">No carrier data available. Upload a CSV file to get started.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Carrier Database ({sortedData.length} records)
          </h3>
          {selectedCarriers.length > 0 && (
            <Button onClick={handleBulkCall} className="bg-green-600 hover:bg-green-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Call Selected ({selectedCarriers.length})
            </Button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <Checkbox
                  checked={selectedCarriers.length === sortedData.length && sortedData.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              {[
                { key: 'MC Number', label: 'MC Number' },
                { key: 'Mailing Address', label: 'Address' },
                { key: 'State', label: 'State' },
                { key: 'Phone', label: 'Phone' },
                { key: 'Drivers', label: 'Drivers' },
                { key: 'Power Units', label: 'Power Units' },
                { key: 'MC Age', label: 'MC Age' },
                { key: 'Email', label: 'Email' },
                { key: 'Carrier Operation', label: 'Operation' },
                { key: 'Straight Trucks', label: 'Straight Trucks' },
                { key: 'Truck Tractors', label: 'Tractors' },
                { key: 'Trailers', label: 'Trailers' },
              ].map(({ key, label }) => (
                <th 
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(key as keyof CarrierData)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon field={key as keyof CarrierData} />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((carrier, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedCarriers.includes(carrier["MC Number"])}
                    onCheckedChange={(checked) => 
                      handleSelectCarrier(carrier["MC Number"], checked as boolean)
                    }
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" className="font-mono">
                    {carrier['MC Number']}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {carrier['Mailing Address']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary">
                    {carrier['State']}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  {carrier['Phone']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {carrier['Drivers']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {carrier['Power Units']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {carrier['MC Age']}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {carrier['Email']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={carrier['Carrier Operation'] === 'Interstate' ? 'default' : 'secondary'}
                  >
                    {carrier['Carrier Operation']}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {carrier['Straight Trucks']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {carrier['Truck Tractors']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {carrier['Trailers']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleCall(carrier['Phone'], carrier['MC Number'])}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    {carrier['Email'] && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`mailto:${carrier['Email']}`)}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
