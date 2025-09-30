import { Link } from "react-router-dom";
import { Home, PlusCircle, Puzzle, LayoutTemplate, ArrowUpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: PlusCircle, label: "New Project", to: "/new-project" },
  { icon: Puzzle, label: "Integrations", to: "/integrations" },
  { icon: LayoutTemplate, label: "Templates", to: "/templates" },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileView: boolean; // New prop to indicate if it's rendered in a mobile sheet
}

const Sidebar = ({ isCollapsed, onToggle, isMobileView }: SidebarProps) => {
  const renderNavItems = () => (
    <nav className="flex flex-col space-y-2 p-4">
      {navItems.map((item) => (
        <Tooltip key={item.label}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={`justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isCollapsed && !isMobileView ? 'w-10 h-10 p-0' : 'w-full'}`}
              asChild
            >
              <Link to={item.to} className="flex items-center space-x-3">
                <item.icon className="h-5 w-5" />
                {(!isCollapsed || isMobileView) && <span>{item.label}</span>} {/* Show label on mobile view or when not collapsed */}
              </Link>
            </Button>
          </TooltipTrigger>
          {isCollapsed && !isMobileView && <TooltipContent side="right">{item.label}</TooltipContent>} {/* Tooltip only for desktop collapsed */}
        </Tooltip>
      ))}
      <div className="pt-4">
        <Button className={`bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 ${isCollapsed && !isMobileView ? 'w-10 h-10 p-0' : 'w-full'}`}>
          <ArrowUpCircle className={`${isCollapsed && !isMobileView ? 'h-5 w-5' : 'mr-2 h-4 w-4'}`} />
          {(!isCollapsed || isMobileView) && "Upgrade"} {/* Show label on mobile view or when not collapsed */}
        </Button>
      </div>
    </nav>
  );

  if (isMobileView) {
    return renderNavItems(); // Just render the nav items for mobile sheet
  }

  // Desktop sidebar with collapse functionality
  return (
    <aside className={`hidden lg:flex flex-col border-r bg-sidebar-background h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-end p-4">
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      {renderNavItems()}
    </aside>
  );
};

export default Sidebar;