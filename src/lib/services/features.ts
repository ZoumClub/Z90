import { supabase } from '@/lib/supabase';
import type { Feature } from '@/lib/types/feature';

export async function getFeatures(): Promise<Feature[]> {
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

export async function addCarFeatures(carId: string, featureIds: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('car_features')
      .insert(
        featureIds.map(featureId => ({
          car_id: carId,
          feature_id: featureId,
          available: true
        }))
      );

    if (error) throw error;
  } catch (error) {
    console.error('Error adding car features:', error);
    throw error;
  }
}

export async function addPrivateListingFeatures(listingId: string, featureIds: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('private_listing_features')
      .insert(
        featureIds.map(featureId => ({
          listing_id: listingId,
          feature_id: featureId,
          available: true
        }))
      );

    if (error) throw error;
  } catch (error) {
    console.error('Error adding private listing features:', error);
    throw error;
  }
}