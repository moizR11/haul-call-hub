
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock } from "lucide-react";
import { CallLog } from "./MainContent";
import { useToast } from "@/hooks/use-toast";

interface CallLogsProps {
  logs: CallLog[];
  onRecall: (phoneNumber: string, carrierName: string) => void;
}

export function CallLogs({ logs, onRecall }: CallLogsProps) {
  const { toast } = useToast();

  const handleRecall = (phoneNumber: string, carrierName: string) => {
    onRecall(phoneNumber, carrierName);
    toast({
      title: "Recall Initiated",
      description: `Calling ${phoneNumber} again`,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString();
  };

  if (logs.length === 0) {
    return (
      <Card className="p-8 text-center bg-white">
        <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Call Logs Yet</h3>
        <p className="text-gray-500">
          Start making calls from the Carrier Data tab to see your call history here.
        </p>
      </Card>
    );
  }

  const sortedLogs = [...logs].sort((a, b) => b.lastCalled.getTime() - a.lastCalled.getTime());

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Call History ({logs.length} unique numbers)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
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
            {sortedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  {log.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" className="font-mono">
                    {log.carrierName}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={log.callCount > 3 ? "destructive" : log.callCount > 1 ? "secondary" : "default"}
                  >
                    {log.callCount} {log.callCount === 1 ? 'call' : 'calls'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {formatTime(log.lastCalled)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    size="sm"
                    onClick={() => handleRecall(log.phoneNumber, log.carrierName)}
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
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total calls made: {logs.reduce((sum, log) => sum + log.callCount, 0)}</span>
          <span>Unique numbers called: {logs.length}</span>
        </div>
      </div>
    </Card>
  );
}
