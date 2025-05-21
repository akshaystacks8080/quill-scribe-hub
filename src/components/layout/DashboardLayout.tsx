
import { Navbar } from "./Navbar";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function DashboardLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-muted/30 hidden md:block">
          <div className="flex flex-col gap-2 p-4">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === "/dashboard" && "bg-accent"
                )}
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/dashboard/projects">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname.includes("/dashboard/projects") && "bg-accent"
                )}
              >
                Projects
              </Button>
            </Link>
            <Link to="/dashboard/settings">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === "/dashboard/settings" && "bg-accent"
                )}
              >
                Settings
              </Button>
            </Link>
          </div>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
