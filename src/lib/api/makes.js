import { supabase } from '../supabase';

export async function getMakes() {
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

export async function getMakeById(id) {
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

export async function getMakeByName(name) {
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