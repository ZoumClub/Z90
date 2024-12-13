import { supabase } from '@/lib/supabase';

export async function getFeatures() {
  const { data, error } = await supabase
    .from('features')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching features:', error);
    throw error;
  }

  return data || [];
}

export async function addCarFeatures(carId: string, featureNames: string[]) {
  const { error } = await supabase
    .from('car_features')
    .insert(
      featureNames.map(name => ({
        car_id: carId,
        name,
        available: true
      }))
    );

  if (error) {
    console.error('Error adding car features:', error);
    throw error;
  }
}