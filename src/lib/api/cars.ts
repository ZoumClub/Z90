import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/types/car';

export async function getCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }

  return data || [];
}

export async function getCarById(id: string) {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching car:', error);
    throw error;
  }

  return data;
}