import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { DealerCard } from './DealerCard';
import type { Dealer } from '@/lib/supabase';

interface CarActionsProps {
  price: number;
  savings: number;
  isSold: boolean;
  dealer: Dealer;
}

export function CarActions({ price, savings, isSold, dealer }: CarActionsProps) {
  const [showDealerCard, setShowDealerCard] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-3xl font-bold text-gray-900">
            £{price.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Savings</p>
          <p className="text-2xl font-bold text-green-600">
            £{savings.toLocaleString()}
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowDealerCard(true)}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
          isSold
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        disabled={isSold}
      >
        {isSold ? 'Sold Out' : 'Get Best Deal'}
      </button>

      {!isSold && (
        <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
          <ThumbsUp className="h-5 w-5" />
          <span>Best price guaranteed</span>
        </div>
      )}

      {showDealerCard && (
        <DealerCard
          dealer={dealer}
          onClose={() => setShowDealerCard(false)}
        />
      )}
    </div>
  );
}