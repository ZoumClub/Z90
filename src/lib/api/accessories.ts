import { supabase } from '@/lib/supabase';
import type { Accessory } from '@/types/accessory';

export async function getAccessories(): Promise<Accessory[]> {
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

export async function getAccessoryById(id: string): Promise<Accessory> {
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

export async function updateAccessoryVisibility(id: string, visible: boolean): Promise<void> {
  const { error } = await supabase
    .from('accessories')
    .update({ visible })
    .eq('id', id);

  if (error) {
    console.error('Error updating accessory visibility:', error);
    throw error;
  }
}

export async function deleteAccessory(id: string): Promise<void> {
  const { error } = await supabase
    .from('accessories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting accessory:', error);
    throw error;
  }
}