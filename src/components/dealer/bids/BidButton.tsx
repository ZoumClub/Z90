```tsx
import { useState, useEffect } from 'react';
import { PoundSterling } from 'lucide-react';
import { getDealerBid, placeBid } from '@/lib/api/bids';
import { toast } from 'react-hot-toast';
import { BidForm } from './BidForm';

interface BidButtonProps {
  listingId: string;
  dealerId: string;
  onBidPlaced: () => void;
}

export function BidButton({ listingId, dealerId, onBidPlaced }: BidButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [currentBid, setCurrentBid] = useState<number | null>(null);

  useEffect(() => {
    loadCurrentBid();
  }, [dealerId, listingId]);

  const loadCurrentBid = async () => {
    try {
      const amount = await getDealerBid(dealerId, listingId);
      if (amount) {
        setCurrentBid(amount);
      }
    } catch (error) {
      console.error('Error loading current bid:', error);
    }
  };

  const handleSubmit = async (amount: number) => {
    setIsSubmitting(true);
    try {
      await placeBid(dealerId, listingId, amount);
      toast.success('Bid placed successfully');
      setShowBidForm(false);
      loadCurrentBid();
      onBidPlaced();
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {currentBid ? (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Current bid: £{currentBid.toLocaleString()}
          </div>
          <button
            onClick={() => setShowBidForm(true)}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <PoundSterling className="h-4 w-4" />
            Update Bid
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowBidForm(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PoundSterling className="h-4 w-4" />
          Place Bid
        </button>
      )}

      {showBidForm && (
        <BidForm
          onSubmit={handleSubmit}
          onCancel={() => setShowBidForm(false)}
          isSubmitting={isSubmitting}
          currentBid={currentBid}
        />
      )}
    </div>
  );
}
```