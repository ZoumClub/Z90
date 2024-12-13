import { Image } from '@/components/common/Image';
import { Tag } from 'lucide-react';
import type { Car } from '@/lib/types/car';

interface CarListProps {
  cars: Car[];
  onToggleStatus: (car: Car) => Promise<void>;
}

export function CarList({ cars = [], onToggleStatus }: CarListProps) {
  if (!cars?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No cars in your inventory. Click "List Car" to add your first listing.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cars.map((car) => (
        <div
          key={car.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={car.image}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover rounded-md"
                sizes="64px"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {car.year} {car.make} {car.model}
              </h3>
              <p className="text-sm text-gray-500">
                £{car.price.toLocaleString()}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {car.mileage} • {car.transmission} • {car.fuel_type}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onToggleStatus(car)}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
              car.is_sold
                ? 'text-green-700 bg-green-100 hover:bg-green-200'
                : 'text-red-700 bg-red-100 hover:bg-red-200'
            }`}
          >
            <Tag className="h-4 w-4 stroke-[1.5]" />
            {car.is_sold ? 'Mark Available' : 'Mark Sold'}
          </button>
        </div>
      ))}
    </div>
  );
}