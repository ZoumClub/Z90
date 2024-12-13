import { supabase } from '@/lib/supabase';
import type { Accessory } from '@/lib/types/accessory';

export async function getAdminAccessories() {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching accessories:', error);
    throw error;
  }

  return data || [];
}

export async function getAdminAccessoryById(id: string) {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching accessory:', error);
    throw error;
  }

  return data;
}

export async function createAccessory(accessory: Omit<Accessory, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('accessories')
    .insert([accessory])
    .select()
    .single();

  if (error) {
    console.error('Error creating accessory:', error);
    throw error;
  }

  return data;
}

export async function updateAccessory(id: string, accessory: Partial<Accessory>) {
  const { data, error } = await supabase
    .from('accessories')
    .update(accessory)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating accessory:', error);
    throw error;
  }

  return data;
}

export async function deleteAccessory(id: string) {
  const { error } = await supabase
    .from('accessories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting accessory:', error);
    throw error;
  }
}