import { X } from 'lucide-react';
import Image from 'next/image';
import type { Car } from '@/lib/types/car';

interface CarDetailsModalProps {
  car: Car;
  onClose: () => void;
}

export function CarDetailsModal({ car, onClose }: CarDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {car.year} {car.brand_name} {car.model}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Main Image */}
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={car.image}
              alt={`${car.brand_name} ${car.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Technical Specifications
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mileage</span>
                  <span className="font-medium text-gray-900">{car.mileage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fuel Type</span>
                  <span className="font-medium text-gray-900">{car.fuel_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transmission</span>
                  <span className="font-medium text-gray-900">{car.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Body Type</span>
                  <span className="font-medium text-gray-900">{car.body_type}</span>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Exterior Color</span>
                  <span className="font-medium text-gray-900">{car.exterior_color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interior Color</span>
                  <span className="font-medium text-gray-900">{car.interior_color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium text-gray-900">£{car.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-medium ${car.is_sold ? 'text-red-600' : 'text-green-600'}`}>
                    {car.is_sold ? 'Sold' : 'Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Features & Equipment
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {car.features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      feature.available ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <span className="text-sm">{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Preview */}
          {car.video_url && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Video Preview
              </h3>
              <video
                src={car.video_url}
                controls
                className="w-full rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}