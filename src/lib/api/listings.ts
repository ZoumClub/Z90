import { supabase } from '@/lib/supabase';
import type { PrivateListing } from '@/lib/types/privateListings';

export async function getPrivateListings(status?: 'pending' | 'approved' | 'rejected'): Promise<PrivateListing[]> {
  const query = supabase
    .from('private_listings_with_brand')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }

  return data || [];
}

export async function getListingById(id: string): Promise<PrivateListing> {
  const { data, error } = await supabase
    .from('private_listings_with_brand')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }

  return data;
}

export async function getListingBids(listingId: string) {
  const { data, error } = await supabase.rpc('get_listing_bids', {
    p_listing_id: listingId
  });

  if (error) {
    console.error('Error fetching bids:', error);
    throw error;
  }

  return data || [];
}