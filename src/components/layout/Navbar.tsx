
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  return (
    <header className="border-b sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-primary">TextCraft</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle({ className: cn(location.pathname === "/" && "bg-accent") })}>
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/pricing" 
                className={navigationMenuTriggerStyle({ className: cn(location.pathname === "/pricing" && "bg-accent") })}
              >
                Pricing
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/contact" 
                className={navigationMenuTriggerStyle({ className: cn(location.pathname === "/contact" && "bg-accent") })}
              >
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={signOut}>Log out</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
