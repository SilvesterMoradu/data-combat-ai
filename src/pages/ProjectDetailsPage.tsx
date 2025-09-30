import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UploadCloud, MessageSquareText } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileUpload from "@/components/FileUpload";
import AIChat from "@/components/AIChat";
import DataTableDisplay from "@/components/DataTableDisplay";
import { useFirebaseUser } from "@/components/auth/FirebaseAuthProvider"; // Import Firebase user hook

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useFirebaseUser(); // Get Firebase user

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        showError("Project ID is missing.");
        navigate("/");
        return;
      }
      if (userLoading) return; // Wait for user loading to complete

      if (!user) {
        showError("You must be logged in to view project details.");
        navigate("/login");
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        showError("Failed to load project details.");
        navigate("/");
      } else if (data) {
        setProject(data);
      } else {
        showError("Project not found.");
        navigate("/");
      }
      setLoading(false);
    };

    fetchProject();
  }, [id, navigate, user, userLoading]);

  if (loading || userLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project || !user) {
    return null; // Should be handled by navigate("/") or login redirect
  }

  return (
    <div className="flex flex-col flex-1 h-full p-4 animate-in fade-in duration-500">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mr-4">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-primary">{project.name}</h1>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <ScrollArea className="h-full p-6 bg-background">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UploadCloud className="h-5 w-5 mr-2" /> Upload Data
                    </CardTitle>
                    <CardDescription>Upload your CSV files to analyze them.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload projectId={project.id} onFileUploadSuccess={() => { /* Optional: refresh data table */ }} />
                  </CardContent>
                </Card>
                <DataTableDisplay projectId={project.id} />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <ScrollArea className="h-full p-6 bg-card">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquareText className="h-5 w-5 mr-2" /> AI Chat
                    </CardTitle>
                    <CardDescription>Ask your AI assistant about your data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AIChat projectId={project.id} />
                  </CardContent>
                </Card>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={20}>
          <ScrollArea className="h-full p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4 text-primary">Project Details</h2>
            <p className="text-muted-foreground text-sm mb-2">Name: <span className="font-medium text-foreground">{project.name}</span></p>
            <p className="text-muted-foreground text-sm mb-2">Description: <span className="font-medium text-foreground">{project.description || "No description provided."}</span></p>
            <p className="text-muted-foreground text-sm">Created: <span className="font-medium text-foreground">{new Date(project.created_at).toLocaleDateString()}</span></p>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectDetailsPage;