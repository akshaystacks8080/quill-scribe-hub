
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type Project = Database['public']['Tables']['projects']['Row'];
export type NewProject = Omit<Database['public']['Tables']['projects']['Insert'], 'id' | 'created_at'>;

export async function getProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return data || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  
  return data;
}

export async function createProject(project: NewProject): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  
  return data;
}

export async function updateProject(
  id: string,
  updates: Partial<Omit<Database['public']['Tables']['projects']['Update'], 'id' | 'created_at'>>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating project:', error);
    return null;
  }
  
  return data;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  
  return true;
}
