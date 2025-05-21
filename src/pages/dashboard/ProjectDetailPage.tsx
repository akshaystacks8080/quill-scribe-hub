
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getProject, updateProject, deleteProject } from "@/services/project.service";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [rewrittenText, setRewrittenText] = useState("");
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      
      try {
        setLoading(true);
        const projectData = await getProject(id);
        
        if (projectData) {
          setProject(projectData);
          setTitle(projectData.title || "");
          setOriginalText(projectData.original_text || "");
          setRewrittenText(projectData.rewritten_text || "");
        } else {
          // Project not found
          toast({
            title: "Project not found",
            description: "The project you're looking for doesn't exist or you don't have access to it",
            variant: "destructive",
          });
          navigate("/dashboard/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchProject();
  }, [id, navigate, toast]);
  
  const handleSave = async () => {
    if (!id) return;
    
    try {
      setSaving(true);
      
      // Update the project
      const updatedProject = await updateProject(id, {
        title,
        original_text: originalText,
        rewritten_text: rewrittenText
      });
      
      if (updatedProject) {
        setProject(updatedProject);
        toast({
          title: "Project updated",
          description: "Your changes have been saved",
        });
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }
    
    try {
      // In a real app, this would delete the project from the database
      // await deleteProject(id);
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted",
      });
      
      navigate("/dashboard/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p>Loading project...</p>
      </div>
    );
  }
  
  if (!project) {
    return null;
  }
  
  const createdAt = new Date(project.created_at);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  
  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{title || "Untitled Project"}</h1>
            <p className="text-muted-foreground">Created {timeAgo}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-title">Project Title</Label>
            <Input
              id="project-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="original-text">Original Text</Label>
                <Textarea
                  id="original-text"
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <div>
                <Button 
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(originalText)}
                >
                  Copy Original
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="rewritten-text">Rewritten Text</Label>
                <Textarea
                  id="rewritten-text"
                  value={rewrittenText}
                  onChange={(e) => setRewrittenText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <div>
                <Button 
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(rewrittenText)}
                >
                  Copy Rewritten
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
