import { useState } from 'react';
import Image from 'next/image';
import { Eye, Check, X } from 'lucide-react';
import { ListingStatus } from './ListingStatus';
import { ListingModal } from '../private-listings/ListingModal';
import type { PrivateListing } from '@/lib/supabase';

interface PrivateListingsTableProps {
  listings: PrivateListing[];
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  isProcessing: boolean;
}

export function PrivateListingsTable({ 
  listings,
  onStatusUpdate,
  isProcessing
}: PrivateListingsTableProps) {
  const [selectedListing, setSelectedListing] = useState<PrivateListing | null>(null);

  if (!listings.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No private listings found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Car Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0">
                      <Image
                        src={listing.image}
                        alt={`${listing.make} ${listing.model}`}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {listing.year} {listing.make} {listing.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {listing.mileage} • {listing.transmission} • {listing.fuel_type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{listing.client_name}</div>
                  <div className="text-sm text-gray-500">Last 4: {listing.client_phone}</div>
                  <div className="text-sm text-gray-500">{listing.client_city}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    £{listing.price.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ListingStatus status={listing.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                      title="View details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    {listing.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onStatusUpdate(listing.id!, 'approved')}
                          disabled={isProcessing}
                          className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50 disabled:opacity-50"
                          title="Approve listing"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onStatusUpdate(listing.id!, 'rejected')}
                          disabled={isProcessing}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50 disabled:opacity-50"
                          title="Reject listing"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onApprove={
            selectedListing.status === 'pending'
              ? () => onStatusUpdate(selectedListing.id!, 'approved')
              : undefined
          }
          onReject={
            selectedListing.status === 'pending'
              ? () => onStatusUpdate(selectedListing.id!, 'rejected')
              : undefined
          }
          isUpdating={isProcessing}
        />
      )}
    </>
  );
}