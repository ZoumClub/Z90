import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export function useDealer() {
  const router = useRouter();
  const [dealerId, setDealerId] = useState<string | null>(null);
  const [dealerName, setDealerName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('dealer_id');
    const name = localStorage.getItem('dealer_name');

    if (!id) {
      router.replace('/dealer');
      return;
    }

    setDealerId(id);
    setDealerName(name || '');
    setIsLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('dealer_id');
    localStorage.removeItem('dealer_name');
    router.replace('/dealer');
  };

  const validateDealer = async () => {
    if (!dealerId) return false;

    try {
      const { data, error } = await supabase
        .from('dealers')
        .select('id, name')
        .eq('id', dealerId)
        .single();

      if (error || !data) {
        throw new Error('Invalid dealer credentials');
      }

      return true;
    } catch (error) {
      console.error('Error validating dealer:', error);
      toast.error('Session expired. Please login again.');
      logout();
      return false;
    }
  };

  return {
    dealerId,
    dealerName,
    isLoading,
    logout,
    validateDealer
  };
}