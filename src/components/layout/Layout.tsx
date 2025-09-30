import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="grid flex-1 lg:grid-cols-[auto_1fr]"> {/* Use grid for desktop layout */}
        {isMobile ? (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar isCollapsed={false} onToggle={() => {}} isMobileView={true} />
              </SheetContent>
            </Sheet>
            {/* On mobile, the main content needs to be rendered outside the Sheet, but still within the grid */}
            <main className="p-6 lg:p-8 overflow-auto">
              {children}
            </main>
          </>
        ) : (
          <>
            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} isMobileView={false} />
            <main className="p-6 lg:p-8 overflow-auto">
              {children}
            </main>
          </>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Layout;