
import { useProfile } from "@/hooks/useProfile";
import { Progress } from "@/components/ui/progress";

export function CreditDisplay() {
  const { profile, remainingCredits } = useProfile();
  
  if (!profile) return null;

  const totalCredits = profile.credits_total;
  const usedCredits = profile.credits_used;
  const percentUsed = Math.round((usedCredits / totalCredits) * 100);

  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold mb-2">Credits</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {remainingCredits} of {totalCredits} credits remaining
          </span>
          <span className="text-sm font-medium">{percentUsed}% used</span>
        </div>
        <Progress value={percentUsed} className="h-2" />
      </div>
    </div>
  );
}
