import { useState } from 'react';
import { Image } from '@/components/common/Image';
import { ListingStatus } from './ListingStatus';
import { ListingBids } from './ListingBids';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { PrivateListing } from '@/lib/types/privateListings';

interface ListingCardProps {
  listing: PrivateListing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [showBids, setShowBids] = useState(false);
  const hasBids = listing.bids && listing.bids.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-6">
          <div className="relative w-48 h-32 flex-shrink-0">
            <Image
              src={listing.image}
              alt={`${listing.brand_name} ${listing.model}`}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {listing.year} {listing.brand_name} {listing.model}
                </h3>
                <p className="text-lg font-medium text-gray-900 mt-2">
                  Price: £{listing.price.toLocaleString()}
                </p>
                <p className="text-gray-600 mt-1">
                  {listing.mileage} • {listing.transmission} • {listing.fuel_type}
                </p>
              </div>
              <ListingStatus status={listing.status} />
            </div>

            {listing.status === 'approved' && (
              <button
                onClick={() => setShowBids(!showBids)}
                className={`
                  w-full mt-4 flex items-center justify-between
                  px-6 py-4 rounded-lg
                  ${showBids
                    ? 'bg-blue-600 text-white shadow-inner'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                  }
                  transform hover:-translate-y-0.5 
                  transition-all duration-200
                  group
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">View Dealer Bids</span>
                  {hasBids && (
                    <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-sm font-medium">
                      {listing.bids.length}
                    </span>
                  )}
                </div>
                {showBids ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {showBids && listing.status === 'approved' && (
        <ListingBids listingId={listing.id!} />
      )}
    </div>
  );
}