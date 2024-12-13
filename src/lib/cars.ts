import { supabase } from './supabase';
import type { Car } from './supabase';

export async function getCars() {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select(`
        *,
        brand:brands (
          id,
          name,
          logo_url
        ),
        features:car_features (
          id,
          name,
          available
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
}

export async function getCar(id: string) {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select(`
        *,
        brand:brands (
          id,
          name,
          logo_url
        ),
        features:car_features (
          id,
          name,
          available
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching car:', error);
    throw error;
  }
}

export async function createCar(car: Omit<Car, 'id' | 'created_at' | 'updated_at' | 'brand'>) {
  try {
    const { data: newCar, error: carError } = await supabase
      .from('cars')
      .insert([car])
      .select()
      .single();

    if (carError) throw carError;
    return newCar;
  } catch (error) {
    console.error('Error creating car:', error);
    throw error;
  }
}

export async function updateCar(id: string, updates: Partial<Car>) {
  try {
    const { data: updatedCar, error: carError } = await supabase
      .from('cars')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (carError) throw carError;
    return updatedCar;
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
}

export async function deleteCar(id: string) {
  try {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
}