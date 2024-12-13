import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getMakes } from '@/lib/api/makes';

export function useMakes() {
  const [makes, setMakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMakes = async () => {
    try {
      const data = await getMakes();
      setMakes(data);
    } catch (error) {
      console.error('Error loading makes:', error);
      toast.error('Failed to load makes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMakes();
  }, []);

  return {
    makes,
    isLoading,
    loadMakes
  };
}