
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/services/project.service";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const createdAt = new Date(project.created_at);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title || "Untitled Project"}</CardTitle>
        <CardDescription>Created {timeAgo}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {truncateText(project.original_text, 100)}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/dashboard/projects/${project.id}`} className="flex-1">
          <Button variant="outline" className="w-full">View</Button>
        </Link>
        <Button 
          variant="ghost" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
