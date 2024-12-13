```tsx
import { useState, useEffect } from 'react';
import { Image } from '@/components/common/Image';
import { BidButton } from '../BidButton';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { PrivateListing } from '@/lib/types/privateListings';

interface AvailableCarsSectionProps {
  dealerId: string;
}

export function AvailableCarsSection({ dealerId }: AvailableCarsSectionProps) {
  const [listings, setListings] = useState<PrivateListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('private_listings_with_brand')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to load available cars');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No cars available for bidding at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">Available Cars for Bidding</h2>
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
                  dealerId={dealerId}
                  onBidPlaced={loadListings}
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