import { useState, useEffect } from 'react';
import { getListingBids } from '@/lib/api/listings';
import { toast } from 'react-hot-toast';
import type { DealerBid } from '@/lib/types/dealer';

export function useListingBids(listingId: string) {
  const [bids, setBids] = useState<DealerBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBids();
  }, [listingId]);

  const loadBids = async () => {
    try {
      const data = await getListingBids(listingId);
      setBids(data);
    } catch (error) {
      console.error('Error loading bids:', error);
      toast.error('Failed to load bids');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bids,
    isLoading,
    refresh: loadBids
  };
}