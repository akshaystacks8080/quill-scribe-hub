
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
}

export async function updateProfile(
  id: string,
  updates: Database['public']['Tables']['profiles']['Update']
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  
  return data;
}

export async function createProfileIfNotExists(
  id: string,
  email: string
): Promise<Profile | null> {
  // First check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (existingProfile) {
    return existingProfile;
  }
  
  // If not, create a new profile with default values
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id,
        email,
        subscription_tier: 'free',
        credits_used: 0,
        credits_total: 20 // Default free credits
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }
  
  return data;
}

export async function updateSubscription(
  id: string, 
  tier: string,
  additionalCredits: number
): Promise<Profile | null> {
  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!profile) return null;
  
  // Calculate new total credits
  const newTotalCredits = profile.credits_total - profile.credits_used + additionalCredits;
  
  // Update subscription and credits
  const { data, error } = await supabase
    .from('profiles')
    .update({
      subscription_tier: tier,
      credits_total: newTotalCredits
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating subscription:', error);
    return null;
  }
  
  return data;
}

export async function useCredits(id: string, amount: number = 1): Promise<{ success: boolean, remaining: number }> {
  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!profile) return { success: false, remaining: 0 };
  
  // Check if user has enough credits
  const remainingCredits = profile.credits_total - profile.credits_used;
  if (remainingCredits < amount) {
    return { success: false, remaining: remainingCredits };
  }
  
  // Update credits used
  const { error } = await supabase
    .from('profiles')
    .update({
      credits_used: profile.credits_used + amount
    })
    .eq('id', id);
  
  if (error) {
    console.error('Error using credits:', error);
    return { success: false, remaining: remainingCredits };
  }
  
  return { success: true, remaining: remainingCredits - amount };
}
