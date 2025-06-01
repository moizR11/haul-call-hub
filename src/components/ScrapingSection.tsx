import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export function ScrapingSection() {
  const [startMC, setStartMC] = useState("");
  const [endMC, setEndMC] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scrapeMutation = useMutation({
    mutationFn: async ({ start, end }: { start: string, end: string }) => {
      const response = await fetch(`${API_BASE_URL}/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_mc: start, end_mc: end }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Scraping request failed");
      }
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Scraping Initiated",
        description: data.message || `Scraping MC numbers from ${startMC} to ${endMC}. This may take some time.`,
      });
      // Optionally, you could refetch carriers after a delay or provide a manual refresh button
      // For now, we just inform the user. If scraping is quick and updates `carriers_data_store` immediately:
      // queryClient.invalidateQueries({ queryKey: ['carriers'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Scraping Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleScrapeData = () => {
    if (!startMC || !endMC) {
      toast({
        title: "Error",
        description: "Please enter both starting and ending MC numbers",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(startMC) > parseInt(endMC)) {
      toast({
        title: "Error",
        description: "Starting MC number must be less than or equal to ending MC number",
        variant: "destructive",
      });
      return;
    }
    scrapeMutation.mutate({ start: startMC, end: endMC });
  };

  return (
    <Card className="p-4 space-y-4 bg-white shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="start-mc" className="text-sm font-medium text-gray-700">
          Starting MC Number
        </Label>
        <Input
          id="start-mc"
          type="number"
          placeholder="e.g., 1614484"
          value={startMC}
          onChange={(e) => setStartMC(e.target.value)}
          className="w-full"
          disabled={scrapeMutation.isPending}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="end-mc" className="text-sm font-medium text-gray-700">
          Ending MC Number
        </Label>
        <Input
          id="end-mc"
          type="number"
          placeholder="e.g., 1614500"
          value={endMC}
          onChange={(e) => setEndMC(e.target.value)}
          className="w-full"
          disabled={scrapeMutation.isPending}
        />
      </div>
      
      <Button 
        onClick={handleScrapeData}
        disabled={scrapeMutation.isPending}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {scrapeMutation.isPending ? "Scraping..." : "Scrape Data"}
      </Button>
    </Card>
  );
}