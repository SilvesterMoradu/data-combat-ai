import { Link } from "react-router-dom";
import { Home, PlusCircle, Puzzle, LayoutTemplate, ArrowUpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: PlusCircle, label: "New Project", to: "/new-project" },
  { icon: Puzzle, label: "Integrations", to: "/integrations" },
  { icon: LayoutTemplate, label: "Templates", to: "/templates" },
];

const Sidebar = () => {
  const isMobile = useIsMobile();

  const renderSidebarContent = () => (
    <nav className="flex flex-col space-y-2 p-4">
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant="ghost"
          className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          asChild
        >
          <Link to={item.to} className="flex items-center space-x-3">
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        </Button>
      ))}
      <div className="pt-4">
        <Button className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
          <ArrowUpCircle className="mr-2 h-4 w-4" /> Upgrade
        </Button>
      </div>
    </nav>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden lg:block w-64 border-r bg-sidebar-background h-full">
      {renderSidebarContent()}
    </aside>
  );
};

export default Sidebar;