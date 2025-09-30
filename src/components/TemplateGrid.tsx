import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart, Table, LayoutGrid } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const templates = [
  {
    name: "Sales Dashboard",
    description: "Visualize sales performance and trends.",
    icon: BarChart,
  },
  {
    name: "Marketing Report",
    description: "Track campaign effectiveness and ROI.",
    icon: LineChart,
  },
  {
    name: "Customer Segmentation",
    description: "Analyze customer groups and behaviors.",
    icon: PieChart,
  },
  {
    name: "Inventory Management",
    description: "Monitor stock levels and supply chain.",
    icon: Table,
  },
  {
    name: "Project Overview",
    description: "Get a high-level view of all active projects.",
    icon: LayoutGrid,
  },
];

const TemplateGrid = () => {
  const handleSelectTemplate = (templateName: string) => {
    showSuccess(`Started new project with "${templateName}" template!`);
  };

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border p-4">
      <h2 className="text-xl font-semibold mb-4 text-primary">Start from a Template</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.name} className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center mb-2">
                <template.icon className="h-6 w-6 mr-3 text-primary" />
                <CardTitle>{template.name}</CardTitle>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <div className="p-4 pt-0">
              <Button className="w-full" onClick={() => handleSelectTemplate(template.name)}>
                Use Template
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateGrid;