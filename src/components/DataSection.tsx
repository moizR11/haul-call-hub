
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
      
      onUploadSuccess();
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
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-3 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Label className="text-sm font-medium text-gray-700 mb-1 block">
            Upload CSV
          </Label>
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-blue-600 border-blue-600 hover:bg-blue-50 h-8 px-3 text-xs"
            size="sm"
          >
            <Upload className="w-3 h-3 mr-1" />
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
        <div className="flex-1">
          <p className="text-xs text-gray-500">
            Upload carrier data CSV file to populate the database
          </p>
        </div>
      </div>
    </Card>
  );
}
