```tsx
import { useState } from 'react';
import { PoundSterling } from 'lucide-react';

interface BidFormProps {
  onSubmit: (amount: number) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  currentBid?: number;
}

export function BidForm({ onSubmit, onCancel, isSubmitting, currentBid }: BidFormProps) {
  const [bidAmount, setBidAmount] = useState(currentBid?.toString() || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) return;
    await onSubmit(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Place Your Bid</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bid Amount (£)
            </label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              required
              min={1}
              step="0.01"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Placing Bid...' : 'Confirm Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```