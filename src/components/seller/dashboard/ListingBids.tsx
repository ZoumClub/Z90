```tsx
import { useState, useEffect } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { getListingBids } from '@/lib/api/bids';
import { toast } from 'react-hot-toast';
import type { DealerBid } from '@/lib/types/dealer';

interface ListingBidsProps {
  listingId: string;
}

export function ListingBids({ listingId }: ListingBidsProps) {
  const [bids, setBids] = useState<DealerBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBids();
  }, [listingId]);

  const loadBids = async () => {
    try {
      const data = await getListingBids(listingId);
      setBids(data);
    } catch (error) {
      console.error('Error loading bids:', error);
      toast.error('Failed to load bids');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!bids.length) {
    return (
      <div className="text-center py-8 px-4 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">
          No bids received yet for this listing.
        </p>
        <p className="text-gray-400 mt-2">
          Check back later for dealer offers.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Dealer Bids
      </h4>
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
                {bid.dealer.name}
              </p>
              <p className={`text-xl font-semibold ${
                index === 0 ? 'text-blue-600' : 'text-green-600'
              }`}>
                £{bid.amount.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${bid.dealer.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Call</span>
              </a>
              <a
                href={`https://wa.me/${bid.dealer.whatsapp.replace(/\D/g, '')}`}
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
    </div>
  );
}
```