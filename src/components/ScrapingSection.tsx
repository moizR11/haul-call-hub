
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function ScrapingSection() {
  const [startMC, setStartMC] = useState("");
  const [endMC, setEndMC] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScrapeData = async () => {
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
        description: "Starting MC number must be less than ending MC number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Scraping Initiated",
        description: `Scraping MC numbers from ${startMC} to ${endMC}`,
      });
    }, 2000);
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
        />
      </div>
      
      <Button 
        onClick={handleScrapeData}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? "Scraping..." : "Scrape Data"}
      </Button>
    </Card>
  );
}
