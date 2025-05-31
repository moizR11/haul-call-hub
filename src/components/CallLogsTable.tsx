
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone } from "lucide-react";
import { CallLog } from "./MainContent";
import { useToast } from "@/hooks/use-toast";

interface CallLogsTableProps {
  logs: CallLog[];
  onRecall: (phoneNumber: string, carrierName: string) => void;
}

export function CallLogsTable({ logs, onRecall }: CallLogsTableProps) {
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLogs(logs.map(log => log.id));
    } else {
      setSelectedLogs([]);
    }
  };

  const handleSelectLog = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedLogs([...selectedLogs, logId]);
    } else {
      setSelectedLogs(selectedLogs.filter(id => id !== logId));
    }
  };

  const handleBulkRecall = () => {
    const logsToCall = logs.filter(log => selectedLogs.includes(log.id));
    
    if (logsToCall.length === 0) {
      toast({
        title: "Error",
        description: "No call logs selected",
        variant: "destructive",
      });
      return;
    }

    logsToCall.forEach(log => {
      onRecall(log.phoneNumber, log.carrierName);
    });

    toast({
      title: "Bulk Recalls Initiated",
      description: `Recalling ${logsToCall.length} numbers`,
    });

    setSelectedLogs([]);
  };

  if (logs.length === 0) {
    return (
      <Card className="p-8 text-center bg-white">
        <p className="text-gray-500">No call logs available. Start making calls to see them here.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Call History ({logs.length} records)
          </h3>
          {selectedLogs.length > 0 && (
            <Button onClick={handleBulkRecall} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Recall Selected ({selectedLogs.length})
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <Checkbox
                  checked={selectedLogs.length === logs.length && logs.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Carrier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Call Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Called
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedLogs.includes(log.id)}
                    onCheckedChange={(checked) => 
                      handleSelectLog(log.id, checked as boolean)
                    }
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                  {log.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" className="font-mono">
                    {log.carrierName}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary">
                    {log.callCount} call{log.callCount !== 1 ? 's' : ''}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.lastCalled.toLocaleDateString()} {log.lastCalled.toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    size="sm"
                    onClick={() => onRecall(log.phoneNumber, log.carrierName)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Recall
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
