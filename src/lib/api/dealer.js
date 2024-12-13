import { supabase } from '@/lib/supabase';

export async function getDealerCars(dealerId) {
  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      make:makes (
        id,
        name,
        logo_url
      )
    `)
    .eq('dealer_id', dealerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching dealer cars:', error);
    throw error;
  }

  return data || [];
}

export async function updateCarStatus(carId, isSold) {
  const { error } = await supabase
    .from('cars')
    .update({ is_sold: isSold })
    .eq('id', carId);

  if (error) {
    console.error('Error updating car status:', error);
    throw error;
  }
}

export async function validateDealer(dealerId) {
  const { data, error } = await supabase
    .from('dealers')
    .select('id, name')
    .eq('id', dealerId)
    .single();

  if (error || !data) {
    throw new Error('Invalid dealer credentials');
  }

  return data;
}