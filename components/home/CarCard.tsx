import Link from 'next/link';
import Image from 'next/image';
import { ThumbsUp, PoundSterling } from 'lucide-react';
import type { Car } from '@/lib/types/car';

interface CarCardProps {
  car: Car;
  priority?: boolean;
}

export function CarCard({ car, priority = false }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`} className="block">
      <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] ${
        car.is_sold ? 'opacity-90' : ''
      }`}>
        <div className="relative h-48">
          <Image
            src={car.image}
            alt={`${car.brand_name} ${car.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
          />
          
          {car.is_sold && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-red-600 text-white px-16 py-6 rounded-full transform -rotate-45 font-bold text-5xl shadow-2xl border-4 border-white">
                SOLD
              </div>
            </div>
          )}

          {!car.is_sold && car.condition === 'used' && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Used
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {car.year} {car.brand_name} {car.model}
          </h3>
          
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="text-2xl font-bold text-gray-900">
                £{car.price.toLocaleString()}
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center text-green-600">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Save £{car.savings.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <button 
            className={`mt-6 w-full py-2 rounded-md flex items-center justify-center ${
              car.is_sold 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
            disabled={car.is_sold}
          >
            <PoundSterling className="h-4 w-4 mr-2" />
            {car.is_sold ? 'Sold Out' : 'Get best deals'}
          </button>
        </div>
      </div>
    </Link>
  );
}