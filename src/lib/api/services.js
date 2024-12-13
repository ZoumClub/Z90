import { supabase } from '../supabase';

export async function getServices() {
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

export async function getServiceById(id) {
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

export async function createService(service) {
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

export async function updateService(id, service) {
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

export async function updateServiceVisibility(id, visible) {
  const { error } = await supabase
    .from('main_services')
    .update({ visible })
    .eq('id', id);

  if (error) {
    console.error('Error updating service visibility:', error);
    throw error;
  }
}

export async function deleteService(id) {
  const { error } = await supabase
    .from('main_services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}