import { supabase } from './supabase';
import { DEFAULT_FEATURES } from './constants';
import type { CarFeature } from './supabase';

export async function getCarFeatures(carId: string): Promise<CarFeature[]> {
  try {
    const { data, error } = await supabase
      .from('car_features')
      .select('*')
      .eq('car_id', carId)
      .order('name');

    if (error) throw error;

    // If no features exist, return default features
    if (!data || data.length === 0) {
      return DEFAULT_FEATURES.map(name => ({
        id: crypto.randomUUID(),
        car_id: carId,
        name,
        available: true,
        created_at: new Date().toISOString()
      }));
    }

    return data;
  } catch (error) {
    console.error('Error fetching car features:', error);
    throw error;
  }
}

export async function updateCarFeatures(carId: string, features: string[]): Promise<CarFeature[]> {
  try {
    // Delete existing features
    const { error: deleteError } = await supabase
      .from('car_features')
      .delete()
      .eq('car_id', carId);

    if (deleteError) throw deleteError;

    // Insert new features
    const { data, error: insertError } = await supabase
      .from('car_features')
      .insert(
        features.map(name => ({
          car_id: carId,
          name,
          available: true
        }))
      )
      .select();

    if (insertError) throw insertError;

    return data;
  } catch (error) {
    console.error('Error updating car features:', error);
    throw error;
  }
}

export async function initializeFeatures(): Promise<void> {
  try {
    // Get all cars without features
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id');

    if (carsError) throw carsError;

    // Initialize features for each car
    await Promise.all(
      cars.map(car =>
        updateCarFeatures(car.id, DEFAULT_FEATURES)
      )
    );
  } catch (error) {
    console.error('Error initializing features:', error);
    throw error;
  }
}