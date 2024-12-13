import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Car } from '@/lib/types/car';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars_with_brand')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error loading cars:', error);
      toast.error('Failed to load cars');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const deleteCar = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCars(cars.filter(car => car.id !== id));
      toast.success('Car deleted successfully');
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Failed to delete car');
    }
  };

  const toggleSoldStatus = async (car: Car) => {
    try {
      const { error } = await supabase
        .from('cars')
        .update({ is_sold: !car.is_sold })
        .eq('id', car.id);

      if (error) throw error;
      setCars(cars.map(c => c.id === car.id ? { ...c, is_sold: !car.is_sold } : c));
      toast.success(`Car marked as ${!car.is_sold ? 'sold' : 'available'}`);
    } catch (error) {
      console.error('Error updating car:', error);
      toast.error('Failed to update car status');
    }
  };

  return {
    cars,
    isLoading,
    deleteCar,
    toggleSoldStatus,
    refresh: loadCars
  };
}