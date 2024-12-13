```tsx
import { useState } from 'react';
import { Image } from '@/components/common/Image';
import { BidButton } from './BidButton';
import { CarDetailsModal } from '../CarDetailsModal';
import type { PrivateListing } from '@/lib/types/privateListings';

interface BidListProps {
  listings: PrivateListing[];
  dealerId: string;
  onBidPlaced: () => void;
}

export function BidList({ listings, dealerId, onBidPlaced }: BidListProps) {
  const [selectedListing, setSelectedListing] = useState<PrivateListing | null>(null);

  if (!listings.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-500">No cars available for bidding at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div 
            className="relative cursor-pointer"
            onClick={() => setSelectedListing(listing)}
          >
            <div className="relative h-48 w-full">
              <Image
                src={listing.image}
                alt={`${listing.brand_name} ${listing.model}`}
                fill
                className="object-cover hover:opacity-90 transition-opacity"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              Click for details
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {listing.year} {listing.brand_name} {listing.model}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {listing.mileage} • {listing.transmission} • {listing.fuel_type}
            </p>
            <div className="mt-4">
              <BidButton
                listingId={listing.id!}
                dealerId={dealerId}
                onBidPlaced={onBidPlaced}
              />
            </div>
          </div>
        </div>
      ))}

      {selectedListing && (
        <CarDetailsModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}
```