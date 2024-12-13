import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSellerListings } from '@/lib/api/seller';
import { toast } from 'react-hot-toast';
import type { PrivateListing } from '@/lib/types/privateListings';

export function useSellerListings() {
  const [listings, setListings] = useState<PrivateListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const sellerName = localStorage.getItem('seller_name');
      const sellerPhone = localStorage.getItem('seller_phone');

      if (!sellerName || !sellerPhone) {
        router.replace('/seller/login');
        return;
      }

      const data = await getSellerListings(sellerName, sellerPhone);
      setListings(data);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to load your listings');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    listings,
    isLoading,
    refresh: loadListings
  };
}