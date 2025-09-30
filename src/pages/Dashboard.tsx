import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AIChat from "@/components/AIChat";
import QuickActions from "@/components/QuickActions";
import TemplateGrid from "@/components/TemplateGrid";
import ProjectList from "@/components/ProjectList"; // Import ProjectList
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <Button asChild>
          <Link to="/new-project">
            <PlusCircle className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div className="lg:col-span-1">
          <AIChat />
        </div>
      </div>

      <ProjectList /> {/* Display user's projects */}
      <TemplateGrid />
    </div>
  );
};

export default Dashboard;