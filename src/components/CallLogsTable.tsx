
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Clock } from "lucide-react";
import { CallLog, CarrierData } from "./MainContent"; 
import { useToast } from "@/hooks/use-toast";

interface CallLogsTableProps {
  logs: CallLog[];
  allCarriers: CarrierData[]; 
  onRecall: (phoneNumber: string, carrierName: string) => void;
  onBulkRecall: (itemsToRecall: Array<{ phoneNumber: string, mcNumber: string, state: string }>) => void;
  isBulkRecalling?: boolean;
  isSingleRecalling?: boolean;
}

export function CallLogsTable({ 
    logs, 
    allCarriers, 
    onRecall, 
    onBulkRecall,
    isBulkRecalling,
    isSingleRecalling 
}: CallLogsTableProps) {
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean | string) => {
    if (checked === true) {
      setSelectedLogIds(logs.map(log => log.id));
    } else {
      setSelectedLogIds([]);
    }
  };

  const handleSelectLog = (logId: string, checked: boolean | string) => {
    if (checked === true) {
      setSelectedLogIds(prev => [...prev, logId]);
    } else {
      setSelectedLogIds(prev => prev.filter(id => id !== logId));
    }
  };

  const handleIndividualRecall = (e: React.MouseEvent, phoneNumber: string, carrierName: string) => {
    e.preventDefault();
    e.stopPropagation();
    onRecall(phoneNumber, carrierName); 
  };

  const handleBulkRecallAction = () => {
    const logsToRecall = logs.filter(log => selectedLogIds.includes(log.id));
    
    if (logsToRecall.length === 0) {
      toast({
        title: "Selection Error",
        description: "No call logs selected for bulk recall.",
        variant: "destructive",
      });
      return;
    }

    const itemsToRecall: Array<{ phoneNumber: string, mcNumber: string, state: string }> = logsToRecall.map(log => {
        const carrier = allCarriers.find(c => c["MC Number"] === log.carrierName);
        return {
            phoneNumber: log.phoneNumber,
            mcNumber: log.carrierName,
            state: carrier ? carrier.State : '',
        };
    }).filter(req => req.phoneNumber && req.phoneNumber.trim() !== '' && req.phoneNumber !== '0');

    if (itemsToRecall.length === 0) {
        toast({
            title: "No Valid Recalls",
            description: "None of the selected logs had valid phone numbers or associated carrier data.",
            variant: "default",
        });
        return;
    }

    onBulkRecall(itemsToRecall);
    setSelectedLogIds([]);
  };

  const formatTime = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString(); 
  };

  if (logs.length === 0) {
    return (
      <Card className="p-8 text-center bg-white">
        <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Call Logs Yet</h3>
        <p className="text-gray-500">Calls made will appear here.</p>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Call History ({logs.length} unique numbers)
          </h3>
          {selectedLogIds.length > 0 && (
            <Button 
                onClick={handleBulkRecallAction} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isBulkRecalling}
            >
              <Phone className="w-4 h-4 mr-2" />
              {isBulkRecalling ? 'Recalling...' : `Recall Selected (${selectedLogIds.length})`}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left bg-gray-50">
                  <Checkbox
                    checked={selectedLogIds.length === logs.length && logs.length > 0}
                    onCheckedChange={handleSelectAll}
                    disabled={logs.length === 0}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier (MC#)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calls</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Called</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4 whitespace-nowrap bg-white group-hover:bg-gray-50">
                    <Checkbox
                      checked={selectedLogIds.includes(log.id)}
                      onCheckedChange={(checked) => handleSelectLog(log.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-gray-900">{log.phoneNumber}</td>
                  <td className="px-4 py-4 whitespace-nowrap"><Badge variant="outline" className="font-mono text-xs">{log.carrierName}</Badge></td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge className="text-xs" variant={log.callCount > 3 ? "destructive" : log.callCount > 1 ? "secondary" : "default"}>
                      {log.callCount} {log.callCount === 1 ? 'call' : 'calls'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-700">
                     <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-gray-400" />{formatTime(log.lastCalled)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap bg-white group-hover:bg-gray-50">
                    <Button 
                      size="sm" 
                      onClick={(e) => handleIndividualRecall(e, log.phoneNumber, log.carrierName)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
                      disabled={isSingleRecalling}
                    >
                      <Phone className="w-3 h-3 mr-1" /> {isSingleRecalling ? 'Recalling...' : 'Recall'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
       <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total calls recorded: {logs.reduce((sum, logItem) => sum + logItem.callCount, 0)}</span>
          <span>Unique numbers logged: {logs.length}</span>
        </div>
      </div>
    </Card>
  );
}
