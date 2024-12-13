import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { BidList } from '@/components/dealer/bids/BidList';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { PrivateListing } from '@/lib/types/privateListings';

export default function DealerBids() {
  const router = useRouter();
  const [listings, setListings] = useState<PrivateListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dealerId, setDealerId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('dealer_id');
    if (!id) {
      router.replace('/dealer');
      return;
    }
    setDealerId(id);
    loadListings();
  }, [router]);

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
      toast.error('Failed to load listings');
    } finally {
      setIsLoading(false);
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
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>

        {dealerId && (
          <BidList 
            listings={listings}
            dealerId={dealerId}
            onBidPlaced={loadListings}
          />
        )}
      </div>
    </Layout>
  );
}