
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function MainLayout() {
  const [missingEnvVars, setMissingEnvVars] = useState<boolean>(false);

  useEffect(() => {
    // Check if Supabase environment variables are set
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      setMissingEnvVars(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {missingEnvVars && (
          <div className="container mx-auto p-4">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing Configuration</AlertTitle>
              <AlertDescription>
                Supabase URL and Anon Key are required. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
