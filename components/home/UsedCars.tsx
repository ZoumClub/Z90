import { CarCard } from './CarCard';
import type { Car } from '@/lib/supabase';

interface UsedCarsProps {
  cars: Car[];
}

export function UsedCars({ cars }: UsedCarsProps) {
  if (!cars?.length) {
    return (
      <div className="text-center py-16 text-gray-600">
        No used cars available at the moment.
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Used Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard 
              key={car.id} 
              car={car}
              priority={false} // Don't prioritize used car images
            />
          ))}
        </div>
      </div>
    </section>
  );
}