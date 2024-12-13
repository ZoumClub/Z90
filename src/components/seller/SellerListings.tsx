import { useRouter } from 'next/router';
import { useSellerListings } from '@/lib/hooks/useSellerListings';
import { ListingCard } from './ListingCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

export function SellerListings() {
  const router = useRouter();
  const { listings, isLoading, error } = useSellerListings();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!listings.length) {
    return (
      <EmptyState
        title="No Listings Found"
        description="You haven't submitted any car listings yet."
        action={{
          label: "List your first car",
          onClick: () => router.push('/sell-your-car')
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}