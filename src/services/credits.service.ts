
import { supabase } from "@/integrations/supabase/client";

export const useCreditsService = () => {
  const useCredits = async (userId: string, amount: number = 1) => {
    try {
      // Get the current profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("credits_used, credits_total")
        .eq("id", userId)
        .single();
      
      if (profileError || !profile) {
        console.error("Error fetching profile:", profileError);
        return { success: false, remaining: 0 };
      }
      
      // Check if we have enough credits
      if (profile.credits_total - profile.credits_used < amount) {
        return { success: false, remaining: profile.credits_total - profile.credits_used };
      }
      
      // Update credits used
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ credits_used: profile.credits_used + amount })
        .eq("id", userId);
      
      if (updateError) {
        console.error("Error updating credits:", updateError);
        return { success: false, remaining: profile.credits_total - profile.credits_used };
      }
      
      return { 
        success: true, 
        remaining: profile.credits_total - profile.credits_used - amount 
      };
    } catch (error) {
      console.error("Error using credits:", error);
      return { success: false, remaining: 0 };
    }
  };
  
  return { useCredits };
};
