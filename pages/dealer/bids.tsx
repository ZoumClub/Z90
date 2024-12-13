import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Layout } from '@/components/layout/Layout';
import { BidButton } from '@/components/dealer/BidButton';
import { CarDetailsModal } from '@/components/dealer/CarDetailsModal';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { PrivateListing, DealerBid } from '@/lib/supabase';

export default function DealerBids() {
  const router = useRouter();
  const [listings, setListings] = useState<PrivateListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<PrivateListing | null>(null);
  const [dealerId, setDealerId] = useState<string | null>(null);
  const [dealerBids, setDealerBids] = useState<Record<string, number>>({});

  useEffect(() => {
    const id = localStorage.getItem('dealer_id');
    if (!id) {
      router.replace('/dealer');
      return;
    }
    setDealerId(id);
    loadListings(id);
  }, [router]);

  const loadListings = async (id: string) => {
    try {
      // First get all approved listings
      const { data: listings, error: listingsError } = await supabase
        .from('private_listings')
        .select(`
          *,
          brand:brands (
            id,
            name,
            logo_url
          ),
          features:private_listing_features (
            feature:features (
              id,
              name
            )
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;

      // Then get dealer's bids
      const { data: bids, error: bidsError } = await supabase
        .from('dealer_bids')
        .select('listing_id, amount')
        .eq('dealer_id', id);

      if (bidsError) throw bidsError;

      // Create a map of listing_id to bid amount
      const bidMap = bids?.reduce((acc, bid) => ({
        ...acc,
        [bid.listing_id]: bid.amount
      }), {}) || {};

      setListings(listings || []);
      setDealerBids(bidMap);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBidPlaced = () => {
    if (dealerId) {
      loadListings(dealerId);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Available Cars for Bidding</h1>
          <button
            onClick={() => router.push('/dealer/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>

        {listings.length > 0 ? (
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
                      alt={`${listing.make} ${listing.model}`}
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
                    {listing.year} {listing.make} {listing.model}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {listing.mileage} • {listing.transmission} • {listing.fuel_type}
                  </p>
                  {dealerBids[listing.id!] && (
                    <p className="text-sm text-gray-600 mt-2">
                      Current bid: £{dealerBids[listing.id!].toLocaleString()}
                    </p>
                  )}
                  <div className="mt-4">
                    {dealerId && (
                      <BidButton
                        listingId={listing.id!}
                        dealerId={dealerId}
                        currentBid={dealerBids[listing.id!]}
                        onBidPlaced={handleBidPlaced}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <p className="text-gray-500">No cars available for bidding at the moment.</p>
          </div>
        )}

        {selectedListing && (
          <CarDetailsModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
          />
        )}
      </div>
    </Layout>
  );
}