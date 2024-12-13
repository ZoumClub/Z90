import { supabase } from './supabase';
import type { Brand, Car } from './types/car';

export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
  return data;
}

export async function getCars(): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars_with_brand')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
  return data;
}

export async function getCarsByBrand(brandId: string): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars_with_brand')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cars by brand:', error);
    throw error;
  }
  return data;
}

export async function getCar(id: string): Promise<Car> {
  const { data, error } = await supabase
    .from('cars_with_brand')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching car:', error);
    throw error;
  }

  return data;
}

export async function createCar(car: Omit<Car, 'id' | 'created_at' | 'updated_at' | 'brand' | 'brand_name' | 'brand_logo_url'>): Promise<Car> {
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

export async function updateCar(id: string, car: Partial<Car>): Promise<Car> {
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