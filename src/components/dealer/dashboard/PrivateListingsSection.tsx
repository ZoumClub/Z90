```tsx
import { useState } from 'react';
import { Image } from '@/components/common/Image';
import { BidButton } from '../BidButton';
import type { PrivateListing } from '@/lib/types/privateListings';

interface PrivateListingsSectionProps {
  listings: PrivateListing[];
}

export function PrivateListingsSection({ listings }: PrivateListingsSectionProps) {
  if (!listings?.length) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Private Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={listing.image}
                alt={`${listing.brand_name} ${listing.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {listing.year} {listing.brand_name} {listing.model}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {listing.mileage} • {listing.transmission} • {listing.fuel_type}
              </p>
              <p className="text-lg font-medium text-gray-900 mt-2">
                £{listing.price.toLocaleString()}
              </p>
              <div className="mt-4">
                <BidButton
                  listingId={listing.id!}
                  dealerId={localStorage.getItem('dealer_id')!}
                  onBidPlaced={() => {}}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```