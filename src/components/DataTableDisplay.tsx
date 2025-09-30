import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Loader2, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FileEntry {
  id: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  size: number;
  created_at: string;
}

interface DataTableDisplayProps {
  projectId: string;
}

const DataTableDisplay: React.FC<DataTableDisplayProps> = ({ projectId }) => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching files:", error);
      showError("Failed to load uploaded files.");
    } else if (data) {
      setFiles(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("project-files")
        .download(filePath);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showSuccess(`Downloaded "${fileName}"`);
    } catch (error: any) {
      console.error("Error downloading file:", error);
      showError(`Failed to download file: ${error.message || "Unknown error"}`);
    }
  };

  const handleDeleteFile = async (fileId: string, storagePath: string) => {
    setDeletingFileId(fileId);
    try {
      // 1. Delete from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from("project-files")
        .remove([storagePath]);

      if (storageError) {
        throw storageError;
      }

      // 2. Delete from 'files' table
      const { error: dbError } = await supabase
        .from("files")
        .delete()
        .eq("id", fileId);

      if (dbError) {
        throw dbError;
      }

      showSuccess("File deleted successfully!");
      fetchFiles(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting file:", error);
      showError(`Failed to delete file: ${error.message || "Unknown error"}`);
    } finally {
      setDeletingFileId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading files...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Data</CardTitle>
        <CardDescription>View your uploaded files and their contents.</CardDescription>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <p className="text-muted-foreground text-center p-4">No files uploaded yet. Upload a CSV above.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {file.file_name}
                  </TableCell>
                  <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                  <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadFile(file.storage_path, file.file_name)}
                      className="mr-2"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={deletingFileId === file.id}>
                          {deletingFileId === file.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your file
                            "{file.file_name}" from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteFile(file.id, file.storage_path)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTableDisplay;