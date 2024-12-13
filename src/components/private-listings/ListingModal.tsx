import { X } from 'lucide-react';
import Image from 'next/image';
import type { PrivateListing } from '@/lib/supabase';

interface ListingModalProps {
  listing: PrivateListing;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  isUpdating?: boolean;
}

export function ListingModal({ 
  listing,
  onClose,
  onApprove,
  onReject,
  isUpdating
}: ListingModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {listing.year} {listing.make} {listing.model}
              </h2>
              <p className="text-lg text-gray-600 mt-1">
                £{listing.price.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Image */}
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={listing.image}
                alt={`${listing.make} ${listing.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Client Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-base font-medium text-gray-900">{listing.client_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-base font-medium text-gray-900">{listing.client_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="text-base font-medium text-gray-900">{listing.client_city}</p>
                </div>
              </div>
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
                    <span className="font-medium text-gray-900">{listing.mileage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fuel Type</span>
                    <span className="font-medium text-gray-900">{listing.fuel_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transmission</span>
                    <span className="font-medium text-gray-900">{listing.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Body Type</span>
                    <span className="font-medium text-gray-900">{listing.body_type}</span>
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
                    <span className="font-medium text-gray-900">{listing.exterior_color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Interior Color</span>
                    <span className="font-medium text-gray-900">{listing.interior_color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Previous Owners</span>
                    <span className="font-medium text-gray-900">{listing.number_of_owners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Condition</span>
                    <span className="font-medium text-gray-900">{listing.condition.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Preview */}
            {listing.video_url && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Video Preview
                </h3>
                <video
                  src={listing.video_url}
                  controls
                  className="w-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Action Buttons */}
            {listing.status === 'pending' && onApprove && onReject && (
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={onReject}
                  disabled={isUpdating}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={onApprove}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}