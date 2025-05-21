
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProfileProvider } from "./hooks/useProfile";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Pages
import { HomePage } from "./pages/HomePage";
import { PricingPage } from "./pages/PricingPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { ProjectsPage } from "./pages/dashboard/ProjectsPage";
import { NewProjectPage } from "./pages/dashboard/NewProjectPage";
import { ProjectDetailPage } from "./pages/dashboard/ProjectDetailPage";
import { SettingsPage } from "./pages/dashboard/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProfileProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main layout routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Dashboard layout routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/projects" element={<ProjectsPage />} />
                <Route path="/dashboard/projects/new" element={<NewProjectPage />} />
                <Route path="/dashboard/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProfileProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
