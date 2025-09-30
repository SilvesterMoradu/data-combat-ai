import React from "react";
import { Button } from "@/components/ui/button";
import { Brain, Presentation, FileText } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const QuickActions = () => {
  const handleAction = (actionName: string) => {
    showSuccess(`${actionName} initiated!`);
  };

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border p-4">
      <h2 className="text-xl font-semibold mb-4 text-primary">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={() => handleAction("AI Analyze")} className="h-24 flex flex-col justify-center items-center text-lg">
          <Brain className="h-6 w-6 mb-2" />
          AI Analyze
        </Button>
        <Button onClick={() => handleAction("AI Data Presentation")} className="h-24 flex flex-col justify-center items-center text-lg">
          <Presentation className="h-6 w-6 mb-2" />
          AI Data Presentation
        </Button>
        <Button onClick={() => handleAction("AI Report")} className="h-24 flex flex-col justify-center items-center text-lg">
          <FileText className="h-6 w-6 mb-2" />
          AI Report
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;