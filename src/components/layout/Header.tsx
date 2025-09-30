import { Link, useNavigate } from "react-router-dom";
import { Bell, User, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { logoutUser } from "@/integrations/firebase/authFunctions"; // Import Firebase logout
import { useFirebaseUser } from "@/components/auth/FirebaseAuthProvider"; // Import Firebase user hook

interface HeaderProps {
  isCollapsed: boolean;
}

const Header = ({ isCollapsed }: HeaderProps) => {
  const navigate = useNavigate();
  const { user } = useFirebaseUser(); // Get Firebase user

  const handleLogout = async () => {
    await logoutUser(); // Use Firebase logout
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 font-extrabold text-2xl bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text">
          <Sword className="h-6 w-6 text-red-600" />
          <span>Data Combat</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt={user?.displayName || "User"} />
                  <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0) || "DC"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName || "Ninja Warrior"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "data.combat@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;