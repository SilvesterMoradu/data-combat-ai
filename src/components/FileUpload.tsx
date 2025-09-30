import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

interface FileUploadProps {
  projectId: string;
  userId: string;
  onFileUploadSuccess?: () => void; // Callback to refresh file list
}

const FileUpload: React.FC<FileUploadProps> = ({ projectId, userId, onFileUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const filePath = `${userId}/${projectId}/${selectedFile.name}`;

    try {
      // 1. Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: selectedFile.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      // 2. Insert file metadata into the 'files' table
      const { error: dbError } = await supabase.from("files").insert({
        project_id: projectId,
        user_id: userId,
        file_name: selectedFile.name,
        storage_path: filePath,
        mime_type: selectedFile.type,
        size: selectedFile.size,
      });

      if (dbError) {
        // If DB insert fails, try to remove the uploaded file from storage
        await supabase.storage.from("project-files").remove([filePath]);
        throw dbError;
      }

      showSuccess("File uploaded successfully!");
      setSelectedFile(null); // Clear selected file
      if (onFileUploadSuccess) {
        onFileUploadSuccess(); // Trigger refresh of file list
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      showError(`Failed to upload file: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload">Choose CSV File</Label>
        <Input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-muted-foreground
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90"
        />
        {selectedFile && (
          <p className="text-sm text-muted-foreground mt-2">Selected: {selectedFile.name}</p>
        )}
      </div>
      <Button onClick={handleUpload} disabled={!selectedFile || loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload File
          </>
        )}
      </Button>
    </div>
  );
};

export default FileUpload;