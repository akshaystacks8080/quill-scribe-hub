
import { useAuth } from "./useAuth";
import { useProfile } from "./useProfile";
import { useCreditsService } from "@/services/credits.service";

export function useCredits() {
  const { user } = useAuth();
  const { refreshProfile, remainingCredits } = useProfile();
  const { useCredits: consumeCredits } = useCreditsService();
  
  const useCreditsFunction = async (amount: number = 1) => {
    if (!user) return { success: false, remaining: 0 };
    
    // Check if we have enough credits first
    if (remainingCredits < amount) {
      return { success: false, remaining: remainingCredits };
    }
    
    try {
      const result = await consumeCredits(user.id, amount);
      
      // Refresh the profile to get updated credit count
      await refreshProfile();
      
      return result;
    } catch (error) {
      console.error("Error using credits:", error);
      return { success: false, remaining: remainingCredits };
    }
  };
  
  return {
    useCredits: useCreditsFunction,
    remainingCredits
  };
}
