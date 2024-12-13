import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/types/car';

interface CarListProps {
  onDelete: (id: string) => Promise<void>;
  onToggleSold: (car: Car) => Promise<void>;
}

export function CarList({ onDelete, onToggleSold }: CarListProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No cars found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Make
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Model
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cars.map((car) => (
            <tr key={car.id} className={`hover:bg-gray-50 relative ${car.is_sold ? 'opacity-75' : ''}`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative h-16 w-16">
                  <Image
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    fill
                    sizes="64px"
                    className="object-cover rounded"
                  />
                  {car.is_sold && (
                    <div className="absolute inset-0 bg-red-600 bg-opacity-50 flex items-center justify-center rounded">
                      <span className="text-white font-bold transform -rotate-45 text-xs">SOLD</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{car.make}</td>
              <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
              <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                £{car.price.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  car.condition === 'new' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {car.condition.charAt(0).toUpperCase() + car.condition.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-4">
                  <Link
                    href={`/admin/dashboard/cars/${car.id}`}
                    className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                    title="Edit car"
                  >
                    <Pencil className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => onToggleSold(car)}
                    className={`${
                      car.is_sold ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'
                    } transition-colors p-1 rounded hover:bg-orange-50`}
                    title={car.is_sold ? 'Mark as available' : 'Mark as sold'}
                  >
                    <Tag className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(car.id)}
                    className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                    title="Delete car"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}