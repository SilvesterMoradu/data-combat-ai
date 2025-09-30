import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const NewProjectPage = () => {
  return (
    <div className="flex flex-1 h-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-140px)] rounded-lg border">
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center justify-center p-6 bg-background">
            <div className="text-center text-muted-foreground text-lg">
              <h2 className="text-2xl font-bold text-primary mb-2">Project Canvas</h2>
              <p>Drag and drop elements here to build your project.</p>
              <p className="text-sm mt-2">Select an element to see its properties on the right.</p>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={20}>
          <ScrollArea className="h-full p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4 text-primary">Properties</h2>
            <Separator className="mb-4" />
            <div className="text-muted-foreground text-sm space-y-4">
              <p>Select an element on the canvas to view and edit its properties here.</p>
              <p>This section will dynamically update based on your selection.</p>
              {/* Placeholder for contextual properties */}
              <div className="border border-dashed p-4 rounded-md text-center">
                <p>No element selected.</p>
                <p>Properties will appear here.</p>
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default NewProjectPage;