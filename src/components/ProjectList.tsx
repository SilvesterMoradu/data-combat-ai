import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import ProjectCard from "./ProjectCard";
import { Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        showError("You must be logged in to view projects.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.data.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        showError("Failed to load projects.");
      } else if (data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border p-4 animate-in fade-in duration-500">
      <h2 className="text-xl font-semibold mb-4 text-primary">Your Projects</h2>
      {projects.length === 0 ? (
        <p className="text-muted-foreground text-center p-8">
          You haven't created any projects yet. Click "New Project" to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;