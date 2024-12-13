import { useState } from 'react';
import Image from 'next/image';
import { Phone, MessageSquare, Gavel, ChevronDown, ChevronUp } from 'lucide-react';
import type { PrivateListing, DealerBid } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

interface SellerListingsProps {
  listings: PrivateListing[];
}

export function SellerListings({ listings }: SellerListingsProps) {
  const [selectedListing, setSelectedListing] = useState<PrivateListing | null>(null);
  const [bids, setBids] = useState<DealerBid[]>([]);
  const [isLoadingBids, setIsLoadingBids] = useState(false);

  const handleViewBids = async (listing: PrivateListing) => {
    if (selectedListing?.id === listing.id) {
      setSelectedListing(null);
      return;
    }

    setSelectedListing(listing);
    setIsLoadingBids(true);

    try {
      const { data, error } = await supabase
        .from('dealer_bids')
        .select(`
          *,
          dealer:dealers (
            id,
            name,
            phone,
            whatsapp
          )
        `)
        .eq('listing_id', listing.id)
        .order('amount', { ascending: false })
        .limit(5);

      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error('Error loading bids:', error);
    } finally {
      setIsLoadingBids(false);
    }
  };

  if (!listings.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">You haven't submitted any car listings yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {listings.map((listing) => (
        <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-start gap-6">
              <div className="relative w-48 h-32 flex-shrink-0">
                <Image
                  src={listing.image}
                  alt={`${listing.make} ${listing.model}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {listing.year} {listing.make} {listing.model}
                    </h3>
                    <p className="text-lg font-medium text-gray-900 mt-2">
                      Price: £{listing.price.toLocaleString()}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {listing.mileage} • {listing.transmission} • {listing.fuel_type}
                    </p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      listing.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : listing.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </div>
                </div>

                {listing.status === 'approved' && (
                  <button
                    onClick={() => handleViewBids(listing)}
                    className={`
                      w-full mt-4 flex items-center justify-between
                      px-6 py-4 rounded-lg
                      ${selectedListing?.id === listing.id
                        ? 'bg-blue-600 text-white shadow-inner'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                      }
                      transform hover:-translate-y-0.5 
                      transition-all duration-200
                      group
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Gavel className={`h-6 w-6 ${
                        selectedListing?.id === listing.id
                          ? 'animate-bounce'
                          : 'group-hover:animate-bounce'
                      }`} />
                      <span className="text-lg font-semibold">View Dealer Bids</span>
                    </div>
                    {selectedListing?.id === listing.id ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {selectedListing?.id === listing.id && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Top 5 Dealer Bids
              </h4>

              {isLoadingBids ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : bids.length > 0 ? (
                <div className="space-y-4">
                  {bids.map((bid, index) => (
                    <div 
                      key={bid.id}
                      className={`
                        flex items-center justify-between p-6 rounded-lg
                        transition-all duration-200 hover:scale-[1.02]
                        ${index === 0 
                          ? 'bg-blue-50 border-2 border-blue-200 shadow-lg' 
                          : 'bg-white border border-gray-200'
                        }
                      `}
                    >
                      <div>
                        <p className={`font-bold text-lg ${
                          index === 0 ? 'text-blue-700' : 'text-gray-900'
                        }`}>
                          {bid.dealer?.name}
                        </p>
                        <p className={`text-xl font-semibold ${
                          index === 0 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          £{bid.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <a
                          href={`tel:${bid.dealer?.phone}`}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Phone className="h-5 w-5" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${bid.dealer?.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors"
                        >
                          <MessageSquare className="h-5 w-5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-lg">
                    No bids received yet for this listing.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Check back later for dealer offers.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}