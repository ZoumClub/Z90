import { CarCard } from './CarCard';
import type { Car } from '@/lib/supabase';

interface CarGridProps {
  cars: Car[];
  filter: 'all' | 'new' | 'used';
}

export function CarGrid({ cars, filter }: CarGridProps) {
  const filteredCars = filter === 'all' 
    ? cars 
    : cars.filter(car => car.condition === filter);

  if (!filteredCars.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No {filter} cars available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredCars.map((car, index) => (
        <CarCard 
          key={car.id} 
          car={car} 
          priority={index < 3} 
        />
      ))}
    </div>
  );
}