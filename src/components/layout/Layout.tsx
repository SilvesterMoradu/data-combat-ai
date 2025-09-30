import { useState, ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/":
      return "Dashboard";
    case "/new-project":
      return "New Project";
    case "/integrations":
      return "Integrations";
    case "/templates":
      return "Templates";
    case "/settings":
      return "Settings";
    case "/login":
      return "Login";
    default:
      return "Data Combat"; // Fallback for unknown routes
  }
};

const Layout = ({ children }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobileView = useMediaQuery("(max-width: 1024px)"); // Tailwind's 'lg' breakpoint is 1024px
  const location = useLocation();
  const currentPageTitle = getPageTitle(location.pathname);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header isCollapsed={isCollapsed} />
      <div className="flex flex-1">
        {isMobileView ? (
          <Sheet open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar
                isCollapsed={isCollapsed}
                onToggle={toggleSidebar}
                isMobileView={isMobileView}
                currentPageTitle={currentPageTitle}
              />
            </SheetContent>
          </Sheet>
        ) : (
          <Sidebar
            isCollapsed={isCollapsed}
            onToggle={toggleSidebar}
            isMobileView={isMobileView}
            currentPageTitle={currentPageTitle}
          />
        )}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;