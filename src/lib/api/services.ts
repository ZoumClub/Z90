import { supabase } from '@/lib/supabase';
import type { Service } from '@/types/service';

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }

  return data || [];
}

export async function getServiceById(id: string): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    throw error;
  }

  return data;
}

export async function updateServiceVisibility(id: string, visible: boolean): Promise<void> {
  const { error } = await supabase
    .from('services')
    .update({ visible })
    .eq('id', id);

  if (error) {
    console.error('Error updating service visibility:', error);
    throw error;
  }
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}