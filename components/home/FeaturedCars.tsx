import { CarCard } from './CarCard';
import type { Car } from '@/lib/supabase';

interface FeaturedCarsProps {
  cars: Car[];
}

export function FeaturedCars({ cars }: FeaturedCarsProps) {
  if (!cars?.length) {
    return (
      <div className="text-center py-16 text-gray-600">
        No new cars available at the moment.
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured New Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <CarCard 
              key={car.id} 
              car={car} 
              priority={index < 3} // Only prioritize first 3 images
            />
          ))}
        </div>
      </div>
    </section>
  );
}