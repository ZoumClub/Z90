import { supabase } from '@/lib/supabase';
import type { Make } from '@/lib/types/make';

export async function getAdminMakes() {
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

export async function getAdminMakeById(id: string) {
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

export async function createMake(make: Omit<Make, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('makes')
    .insert([make])
    .select()
    .single();

  if (error) {
    console.error('Error creating make:', error);
    throw error;
  }

  return data;
}

export async function updateMake(id: string, make: Partial<Make>) {
  const { data, error } = await supabase
    .from('makes')
    .update(make)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating make:', error);
    throw error;
  }

  return data;
}

export async function deleteMake(id: string) {
  const { error } = await supabase
    .from('makes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting make:', error);
    throw error;
  }
}