import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/types/car';

export async function getCars() {
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
  return data || [];
}

export async function getCarsByCondition(condition: 'new' | 'used') {
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
    .eq('condition', condition)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCarById(id: string) {
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
}