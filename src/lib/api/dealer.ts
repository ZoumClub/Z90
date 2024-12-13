import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/types/car';

export async function getDealerCars(dealerId: string): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars_with_brand')
    .select('*')
    .eq('dealer_id', dealerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching dealer cars:', error);
    throw error;
  }

  return data || [];
}

export async function updateCarStatus(carId: string, isSold: boolean) {
  const { error } = await supabase
    .from('cars')
    .update({ is_sold: isSold })
    .eq('id', carId);

  if (error) {
    console.error('Error updating car status:', error);
    throw error;
  }
}