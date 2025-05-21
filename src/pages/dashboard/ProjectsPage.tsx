
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Project, getProjects, deleteProject } from "@/services/project.service";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      try {
        setLoading(true);
        const userProjects = await getProjects(user.id);
        setProjects(userProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [user, toast]);

  const handleDeleteProject = async (id: string) => {
    try {
      // In a real app, this would delete the project from the database
      // await deleteProject(id);
      
      // For demo purposes, we'll just remove it from the state
      setProjects(projects.filter(p => p.id !== id));
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredProjects = search.trim() 
    ? projects.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.original_text.toLowerCase().includes(search.toLowerCase())
      )
    : projects;

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">View and manage your saved projects</p>
          </div>
          <Link to="/dashboard/projects/new">
            <Button>New Project</Button>
          </Link>
        </div>

        <div>
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading projects...</p>
        ) : filteredProjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <p className="text-muted-foreground">No projects found matching your search.</p>
        ) : (
          <div className="text-center py-12">
            <h2 className="font-semibold text-2xl mb-2">No projects yet</h2>
            <p className="text-muted-foreground mb-6">Create your first project to get started</p>
            <Link to="/dashboard/projects/new">
              <Button>Create Project</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
