import { useState, useEffect } from 'react';
import { getDealerCars, updateCarStatus } from '@/lib/api/dealer';
import { toast } from 'react-hot-toast';
import type { Car } from '@/lib/types/car';

export function useDealerCars(dealerId: string | null) {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (dealerId) {
      loadCars();
    }
  }, [dealerId]);

  const loadCars = async () => {
    if (!dealerId) return;

    try {
      const data = await getDealerCars(dealerId);
      setCars(data);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCarStatus = async (car: Car) => {
    try {
      await updateCarStatus(car.id, !car.is_sold);
      setCars(cars.map(c => c.id === car.id ? { ...c, is_sold: !car.is_sold } : c));
      toast.success(`Car marked as ${!car.is_sold ? 'sold' : 'available'}`);
    } catch (error) {
      toast.error('Failed to update car status');
    }
  };

  return {
    cars,
    isLoading,
    toggleCarStatus,
    refresh: loadCars
  };
}