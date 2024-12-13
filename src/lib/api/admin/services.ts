import { supabase } from '@/lib/supabase';
import type { Service } from '@/lib/types/service';

export async function getAdminServices() {
  const { data, error } = await supabase
    .from('main_services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }

  return data || [];
}

export async function getAdminServiceById(id: string) {
  const { data, error } = await supabase
    .from('main_services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    throw error;
  }

  return data;
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('main_services')
    .insert([service])
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    throw error;
  }

  return data;
}

export async function updateService(id: string, service: Partial<Service>) {
  const { data, error } = await supabase
    .from('main_services')
    .update(service)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }

  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from('main_services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}