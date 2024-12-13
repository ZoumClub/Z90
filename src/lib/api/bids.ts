```typescript
import { supabase } from '@/lib/supabase';

export async function getDealerBid(dealerId: string, listingId: string): Promise<number | null> {
  const { data, error } = await supabase.rpc('get_dealer_bid', {
    p_dealer_id: dealerId,
    p_listing_id: listingId
  });

  if (error) {
    console.error('Error getting dealer bid:', error);
    throw error;
  }

  return data;
}

export async function getListingBids(listingId: string) {
  const { data, error } = await supabase.rpc('get_listing_bids', {
    p_listing_id: listingId
  });

  if (error) {
    console.error('Error getting listing bids:', error);
    throw error;
  }

  return data || [];
}

export async function placeBid(dealerId: string, listingId: string, amount: number) {
  const { error } = await supabase.rpc('place_dealer_bid', {
    p_dealer_id: dealerId,
    p_listing_id: listingId,
    p_amount: amount
  });

  if (error) {
    console.error('Error placing bid:', error);
    throw error;
  }
}
```