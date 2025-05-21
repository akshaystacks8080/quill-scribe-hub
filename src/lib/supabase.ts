
import { supabase } from '@/integrations/supabase/client';

// Re-export the supabase client for backward compatibility
// This file can be removed in the future if all imports are updated to use the client from integrations
export { supabase };
