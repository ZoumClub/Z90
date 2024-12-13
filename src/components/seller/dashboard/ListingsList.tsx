import { ListingCard } from './ListingCard';
import type { PrivateListing } from '@/lib/types/privateListings';

interface ListingsListProps {
  listings: PrivateListing[];
}

export function ListingsList({ listings }: ListingsListProps) {
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
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}