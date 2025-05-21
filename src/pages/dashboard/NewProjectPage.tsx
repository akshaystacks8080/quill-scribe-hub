
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { createProject } from "@/services/project.service";
import { rewriteText } from "@/services/rewriter.service";
import { useLocation, useNavigate } from "react-router-dom";
import { useCredits } from "@/hooks/useCredits";
import { useToast } from "@/components/ui/use-toast";

export function NewProjectPage() {
  const { user } = useAuth();
  const { profile, remainingCredits, refreshProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { useCredits: spendCredits } = useCredits();

  // Get passed text from home page if available
  const { text: passedText, rewritten: passedRewritten } = 
    (location.state as { text?: string, rewritten?: string }) || {};

  const [title, setTitle] = useState("");
  const [originalText, setOriginalText] = useState(passedText || "");
  const [rewrittenText, setRewrittenText] = useState(passedRewritten || "");
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Pre-fill title based on text
  useEffect(() => {
    if (!title && originalText) {
      // Create title from first few words
      const words = originalText.split(" ").filter(w => w.trim().length > 0);
      const generatedTitle = words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");
      setTitle(generatedTitle);
    }
  }, [originalText, title]);

  const handleRewrite = async () => {
    if (!originalText.trim()) {
      toast({
        title: "No text to rewrite",
        description: "Please enter some text to rewrite",
        variant: "destructive",
      });
      return;
    }

    if (remainingCredits < 1) {
      toast({
        title: "Not enough credits",
        description: "Please upgrade your plan or purchase more credits",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);
      
      // Use a credit
      const result = await spendCredits();
      if (!result.success) {
        toast({
          title: "Failed to use credit",
          description: "Please try again or contact support",
          variant: "destructive",
        });
        return;
      }
      
      // Refresh profile to update credits
      await refreshProfile();
      
      // Rewrite text
      const rewritten = await rewriteText(originalText);
      setRewrittenText(rewritten);
      
      toast({
        title: "Text rewritten",
        description: `Used 1 credit. ${result.remaining} credits remaining.`,
      });
    } catch (error) {
      console.error("Error rewriting text:", error);
      toast({
        title: "Error",
        description: "Failed to rewrite text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!title.trim() || !originalText.trim() || !rewrittenText.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      // Create the project
      const project = await createProject({
        user_id: user.id,
        title,
        original_text: originalText,
        rewritten_text: rewrittenText
      });
      
      if (project) {
        toast({
          title: "Project saved",
          description: "Your project has been saved successfully",
        });
        
        navigate(`/dashboard/projects/${project.id}`);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">New Project</h1>
          <p className="text-muted-foreground">
            Create a new text rewriting project
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-title">Project Title</Label>
            <Input
              id="project-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your project"
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
                  placeholder="Enter the text you want to rewrite..."
                  className="min-h-[200px]"
                />
              </div>
              <div>
                <Button 
                  onClick={handleRewrite}
                  disabled={processing || !originalText.trim() || remainingCredits < 1}
                >
                  {processing ? "Processing..." : `Rewrite (1 credit)`}
                </Button>
                {remainingCredits < 1 && (
                  <p className="text-sm text-destructive mt-2">
                    No credits remaining. Please upgrade your plan.
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="rewritten-text">Rewritten Text</Label>
                <Textarea
                  id="rewritten-text"
                  value={rewrittenText}
                  onChange={(e) => setRewrittenText(e.target.value)}
                  placeholder="Rewritten text will appear here..."
                  className="min-h-[200px]"
                />
              </div>
              <div>
                <Button 
                  onClick={handleSave}
                  disabled={saving || !originalText.trim() || !rewrittenText.trim()}
                >
                  {saving ? "Saving..." : "Save Project"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
