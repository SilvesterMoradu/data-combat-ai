import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, Puzzle, LayoutTemplate, ArrowUpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: PlusCircle, label: "New Project", to: "/new-project" },
  { icon: Puzzle, label: "Integrations", to: "/integrations" },
  { icon: LayoutTemplate, label: "Templates", to: "/templates" },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileView: boolean;
  currentPageTitle: string; // New prop for current page title
}

const Sidebar = ({ isCollapsed, onToggle, isMobileView, currentPageTitle }: SidebarProps) => {
  const location = useLocation();

  const renderNavItems = () => (
    <nav className="flex flex-col space-y-2 p-4">
      {navItems.map((item) => (
        <Tooltip key={item.label}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "transition-colors duration-200 ease-in-out",
                "rounded-lg py-3",
                location.pathname === item.to && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
                isCollapsed && !isMobileView ? 'w-10 h-10 p-0 flex items-center justify-center' : 'w-full' // Centering for collapsed state
              )}
              asChild
            >
              <Link to={item.to} className={cn("flex items-center", isCollapsed && !isMobileView ? 'justify-center' : 'space-x-3')}> {/* Conditional spacing */}
                <item.icon className="h-5 w-5" />
                {(!isCollapsed || isMobileView) && <span>{item.label}</span>}
              </Link>
            </Button>
          </TooltipTrigger>
          {isCollapsed && !isMobileView && <TooltipContent side="right">{item.label}</TooltipContent>}
        </Tooltip>
      ))}
      <div className="pt-4">
        <Button className={cn(
          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
          "transition-colors duration-200 ease-in-out",
          "rounded-lg py-3",
          isCollapsed && !isMobileView ? 'w-10 h-10 p-0 flex items-center justify-center' : 'w-full' // Centering for collapsed state
        )}>
          <ArrowUpCircle className={cn(isCollapsed && !isMobileView ? 'h-5 w-5' : 'mr-2 h-4 w-4')} />
          {(!isCollapsed || isMobileView) && "Upgrade"}
        </Button>
      </div>
    </nav>
  );

  if (isMobileView) {
    return (
      <div className="flex flex-col h-full bg-sidebar-background">
        <div className="flex items-center justify-center h-14 border-b border-sidebar-border p-4">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <span className="text-red-600">Data</span> <span className="text-sidebar-foreground">Combat</span>
          </Link>
        </div>
        {renderNavItems()}
      </div>
    );
  }

  return (
    <aside className={cn(
      "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar-background h-full transition-all duration-300",
      isCollapsed ? 'w-16' : 'w-72'
    )}>
      <div className="flex items-center justify-between h-14 border-b border-sidebar-border p-4">
        {!isCollapsed && (
          <span className="flex items-center space-x-2 font-bold text-xl text-sidebar-foreground">
            {currentPageTitle} {/* Display current page title here */}
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 ml-auto">
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      {renderNavItems()}
    </aside>
  );
};

export default Sidebar;