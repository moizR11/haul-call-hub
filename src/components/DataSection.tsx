import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://127.0.0.1:5000//api";

interface DataSectionProps {
  onUploadSuccess: () => void;
}

export function DataSection({ onUploadSuccess }: DataSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      // Reset file input
      if(fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload_csv`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload CSV");
      }
      
      onUploadSuccess(); // Trigger refetch in parent
      toast({
        title: "Success",
        description: result.message || `Uploaded ${file.name} successfully.`,
      });

    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload CSV file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-white shadow-sm">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Upload Carrier CSV File
        </Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Click to upload carrier data CSV
          </p>
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            {isUploading ? "Uploading..." : "Choose File"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </Card>
  );
}