import { supabase } from '@/lib/supabase';
import type { Brand } from '@/lib/types/brand';

export async function getBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getBrandById(id: string) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}