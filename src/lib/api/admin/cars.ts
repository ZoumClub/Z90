import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/types/car';

export async function getAdminCars() {
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

export async function getAdminCarById(id: string) {
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

export async function createCar(car: Omit<Car, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('cars')
    .insert([car])
    .select()
    .single();

  if (error) {
    console.error('Error creating car:', error);
    throw error;
  }

  return data;
}

export async function updateCar(id: string, car: Partial<Car>) {
  const { data, error } = await supabase
    .from('cars')
    .update(car)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating car:', error);
    throw error;
  }

  return data;
}

export async function deleteCar(id: string) {
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
}