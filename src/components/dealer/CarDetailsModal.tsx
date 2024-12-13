import { X } from 'lucide-react';
import Image from 'next/image';
import type { Car, PrivateListing } from '@/lib/supabase';

interface CarDetailsModalProps {
  listing?: PrivateListing;
  car?: Car;
  onClose: () => void;
}

export function CarDetailsModal({ listing, car, onClose }: CarDetailsModalProps) {
  // Use either listing or car data
  const data = listing || car;
  const brandName = data?.brand?.name;
  
  if (!data) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {data.year} {brandName} {data.model}
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
              src={data.image}
              alt={`${brandName} ${data.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
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
                  <span className="font-medium text-gray-900">{data.mileage || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fuel Type</span>
                  <span className="font-medium text-gray-900">{data.fuel_type || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transmission</span>
                  <span className="font-medium text-gray-900">{data.transmission || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Body Type</span>
                  <span className="font-medium text-gray-900">{data.body_type || 'N/A'}</span>
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
                  <span className="font-medium text-gray-900">{data.exterior_color || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interior Color</span>
                  <span className="font-medium text-gray-900">{data.interior_color || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium text-gray-900">£{data.price?.toLocaleString() || 'N/A'}</span>
                </div>
                {car && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${car.is_sold ? 'text-red-600' : 'text-green-600'}`}>
                      {car.is_sold ? 'Sold' : 'Available'}
                    </span>
                  </div>
                )}
                {listing && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${
                      listing.status === 'pending'
                        ? 'text-yellow-600'
                        : listing.status === 'approved'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Video Preview */}
          {data.video_url && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Video Preview
              </h3>
              <video
                src={data.video_url}
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