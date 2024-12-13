import { supabase } from '@/lib/supabase';
import type { PrivateListing } from '@/lib/types/privateListings';

export async function getSellerListings(sellerName: string, sellerPhone: string): Promise<PrivateListing[]> {
  // First get the listings
  const { data: listings, error: listingsError } = await supabase
    .from('private_listings')
    .select(`
      *,
      brand:brands (
        id,
        name,
        logo_url
      ),
      features:private_listing_features (
        id,
        name,
        available
      )
    `)
    .ilike('client_name', sellerName.trim())
    .eq('client_phone', sellerPhone.trim())
    .order('created_at', { ascending: false });

  if (listingsError) throw listingsError;

  // Then get bids for approved listings
  const approvedListingIds = listings
    ?.filter(l => l.status === 'approved')
    .map(l => l.id) || [];

  if (approvedListingIds.length > 0) {
    const { data: bids, error: bidsError } = await supabase
      .from('dealer_bids')
      .select(`
        id,
        listing_id,
        amount,
        dealer:dealers (
          id,
          name,
          phone,
          whatsapp
        )
      `)
      .in('listing_id', approvedListingIds);

    if (bidsError) throw bidsError;

    // Merge bids with listings
    return listings.map(listing => ({
      ...listing,
      brand_name: listing.brand?.name,
      brand_logo_url: listing.brand?.logo_url,
      bids: bids?.filter(bid => bid.listing_id === listing.id) || []
    }));
  }

  return listings.map(listing => ({
    ...listing,
    brand_name: listing.brand?.name,
    brand_logo_url: listing.brand?.logo_url,
    bids: []
  }));
}