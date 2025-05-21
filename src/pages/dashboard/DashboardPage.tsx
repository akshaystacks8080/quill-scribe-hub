
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditDisplay } from "@/components/dashboard/CreditDisplay";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Project, getProjects } from "@/services/project.service";
import { useAuth } from "@/hooks/useAuth";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { useToast } from "@/components/ui/use-toast";

export function DashboardPage() {
  const { profile } = useProfile();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      try {
        setLoading(true);
        const userProjects = await getProjects(user.id);
        setProjects(userProjects.slice(0, 3)); // Only get the 3 most recent projects
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [user]);

  const handleDeleteProject = (id: string) => {
    toast({
      title: "Not implemented",
      description: "Project deletion is not implemented in this demo",
    });
  };

  const welcomeMessage = profile?.full_name 
    ? `Welcome back, ${profile.full_name}!`
    : "Welcome to your dashboard!";

  return (
    <div className="p-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
          <p className="text-muted-foreground">Manage your projects and account</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CreditDisplay />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-semibold">Subscription</CardTitle>
              <Link to="/pricing">
                <Button variant="ghost" size="sm">Upgrade</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold capitalize">{profile?.subscription_tier || "Free"}</span>
                  <span className="text-sm text-muted-foreground"> plan</span>
                </div>
                {profile?.subscription_tier === "free" && (
                  <p className="text-sm text-muted-foreground">
                    Upgrade to get more credits and features
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Projects</h2>
            <Link to="/dashboard/projects">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>
          
          {loading ? (
            <p className="text-muted-foreground">Loading projects...</p>
          ) : projects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No projects yet</CardTitle>
                <CardDescription>
                  Get started by creating your first project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/dashboard/projects/new">
                  <Button>Create Project</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
