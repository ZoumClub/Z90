import { supabase } from '@/lib/supabase';
import type { Make } from '@/lib/types/make';

export async function getMakes(): Promise<Make[]> {
  const { data, error } = await supabase
    .from('makes')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching makes:', error);
    throw error;
  }

  return data || [];
}

export async function getMakeById(id: string): Promise<Make> {
  const { data, error } = await supabase
    .from('makes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching make:', error);
    throw error;
  }

  return data;
}

export async function getMakeByName(name: string): Promise<Make> {
  const { data, error } = await supabase
    .from('makes')
    .select('*')
    .eq('name', name)
    .single();

  if (error) {
    console.error('Error fetching make:', error);
    throw error;
  }

  return data;
}