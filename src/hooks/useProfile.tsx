
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { getProfile, createProfileIfNotExists, Profile } from '@/services/profile.service';

type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  remainingCredits: number;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Try to get the user's profile, or create one if it doesn't exist
        const userProfile = await getProfile(user.id);
        
        if (userProfile) {
          setProfile(userProfile);
        } else {
          const newProfile = await createProfileIfNotExists(user.id, user.email || '');
          setProfile(newProfile);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const refreshedProfile = await getProfile(user.id);
      setProfile(refreshedProfile);
    } catch (err) {
      console.error('Failed to refresh profile', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  const remainingCredits = profile ? profile.credits_total - profile.credits_used : 0;

  const value = {
    profile,
    loading,
    error,
    refreshProfile,
    remainingCredits,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
