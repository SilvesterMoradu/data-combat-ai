import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AIChat from "@/components/AIChat";
import QuickActions from "@/components/QuickActions";
import TemplateGrid from "@/components/TemplateGrid";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <Button asChild>
          <Link to="/new-project">
            <PlusCircle className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      {/* Moved TemplateGrid here */}
      <TemplateGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/* Changed to lg:grid-cols-2 */}
        <div className="lg:col-span-1"> {/* Changed to lg:col-span-1 */}
          <QuickActions />
        </div>
        <div className="lg:col-span-1 h-[400px]"> {/* Changed to lg:col-span-1 */}
          <AIChat />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;