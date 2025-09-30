import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    created_at: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader>
        <div className="flex items-center mb-2">
          <FolderOpen className="h-6 w-6 mr-3 text-primary" />
          <CardTitle>{project.name}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2">
          {project.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-end">
        <p className="text-sm text-muted-foreground mb-4">
          Created: {new Date(project.created_at).toLocaleDateString()}
        </p>
        <Button asChild className="w-full">
          <Link to={`/projects/${project.id}`}>View Project</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;