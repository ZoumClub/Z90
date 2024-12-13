import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { CarList } from './CarList';
import type { Car } from '@/lib/types/car';

interface InventorySectionProps {
  dealerId: string;
}

export function InventorySection({ dealerId }: InventorySectionProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, [dealerId]);

  const loadInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Inventory</h2>
      <CarList cars={cars} onToggleStatus={toggleSoldStatus} />
    </div>
  );
}