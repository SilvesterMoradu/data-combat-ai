import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, PlusCircle } from "lucide-react";

const NewProjectPage = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      showError("You must be logged in to create a project.");
      setLoading(false);
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.data.user.id,
        name: projectName,
        description: projectDescription,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      showError("Failed to create project. Please try again.");
    } else if (data) {
      showSuccess("Project created successfully!");
      navigate(`/projects/${data.id}`);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-1 items-center justify-center h-full p-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center">
            <PlusCircle className="mr-2 h-6 w-6" /> Create New Project
          </CardTitle>
          <CardDescription>
            Start a new data combat mission by giving your project a name and description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="e.g., Q3 Sales Analysis"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="projectDescription">Description (Optional)</Label>
              <Textarea
                id="projectDescription"
                placeholder="Briefly describe your project's goals or data."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProjectPage;