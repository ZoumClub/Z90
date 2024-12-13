import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export function useDealer() {
  const router = useRouter();
  const [dealerId, setDealerId] = useState(null);
  const [dealerName, setDealerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDealer = async () => {
      try {
        const id = localStorage.getItem('dealer_id');
        const name = localStorage.getItem('dealer_name');

        if (!id) {
          router.replace('/dealer');
          return;
        }

        // Verify dealer exists
        const { data, error } = await supabase
          .from('dealers')
          .select('id, name')
          .eq('id', id)
          .single();

        if (error || !data) {
          throw new Error('Invalid dealer credentials');
        }

        setDealerId(id);
        setDealerName(name || data.name);
      } catch (error) {
        console.error('Error validating dealer:', error);
        router.replace('/dealer');
      } finally {
        setIsLoading(false);
      }
    };

    checkDealer();
  }, [router]);

  const logout = () => {
    localStorage.removeItem('dealer_id');
    localStorage.removeItem('dealer_name');
    router.replace('/dealer');
  };

  return {
    dealerId,
    dealerName,
    isLoading,
    logout
  };
}