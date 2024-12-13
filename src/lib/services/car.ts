import { supabase } from '@/lib/supabase';
import { addCarFeatures } from './features';
import type { Car } from '@/lib/types/car';

export async function createCar(car: Omit<Car, 'id' | 'created_at' | 'updated_at'>, features: string[]) {
  try {
    // Create car
    const { data: newCar, error: carError } = await supabase
      .from('cars')
      .insert([{
        brand_id: car.brand_id,
        model: car.model,
        year: car.year,
        price: car.price,
        savings: car.savings,
        image: car.image,
        video_url: car.video_url,
        condition: car.condition,
        mileage: car.mileage,
        fuel_type: car.fuel_type,
        transmission: car.transmission,
        body_type: car.body_type,
        exterior_color: car.exterior_color,
        interior_color: car.interior_color,
        number_of_owners: car.number_of_owners,
        is_sold: false
      }])
      .select()
      .single();

    if (carError) throw carError;

    // Add features
    if (features.length > 0) {
      await addCarFeatures(newCar.id, features);
    }

    // Get complete car with features
    const { data: carWithFeatures, error: viewError } = await supabase
      .from('cars_with_brand')
      .select('*')
      .eq('id', newCar.id)
      .single();

    if (viewError) throw viewError;
    return carWithFeatures;
  } catch (error) {
    console.error('Error creating car:', error);
    throw error;
  }
}

export async function getCars() {
  const { data, error } = await supabase
    .from('cars_with_brand')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCarById(id: string) {
  const { data, error } = await supabase
    .from('cars_with_brand')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}