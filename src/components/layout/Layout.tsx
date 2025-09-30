import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobileView = useMediaQuery("(max-width: 1024px)"); // Tailwind's 'lg' breakpoint is 1024px

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header isCollapsed={isCollapsed} /> {/* Pass isCollapsed to Header */}
      <div className="flex flex-1">
        {isMobileView ? (
          <Sheet open={!isCollapsed} onOpenChange={setIsCollapsed}>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} isMobileView={isMobileView} />
            </SheetContent>
          </Sheet>
        ) : (
          <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} isMobileView={isMobileView} />
        )}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;