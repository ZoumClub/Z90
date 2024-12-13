import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CarList } from './CarList';
import { getDealerCars, updateCarStatus } from '@/lib/api/dealer';

export function InventorySection({ dealerId }) {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (dealerId) {
      loadInventory();
    }
  }, [dealerId]);

  const loadInventory = async () => {
    try {
      const data = await getDealerCars(dealerId);
      setCars(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSoldStatus = async (car) => {
    try {
      await updateCarStatus(car.id, !car.is_sold);
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