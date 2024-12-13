import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { AdminNav } from '@/components/admin/AdminNav';
import { PrivateListingsTable } from '@/components/admin/PrivateListingsTable';
import { ListingModal } from '@/components/private-listings/ListingModal';
import { supabase } from '@/lib/supabase';
import type { Profile, PrivateListing } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface PrivateListingsPageProps {
  profile: Profile;
  listings: PrivateListing[];
}

export default function PrivateListingsPage({ profile, listings: initialListings }: PrivateListingsPageProps) {
  const [listings, setListings] = useState(initialListings);
  const [selectedListing, setSelectedListing] = useState<PrivateListing | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    if (!id || isUpdating) return;

    try {
      setIsUpdating(true);
      const { data, error } = await supabase.rpc('process_private_listing', {
        p_listing_id: id,
        p_status: status
      });

      if (error) throw error;

      // Update local state
      setListings(prev => prev.map(listing => 
        listing.id === id ? { ...listing, status } : listing
      ));

      toast.success(`Listing ${status} successfully`);
      setSelectedListing(null);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update listing status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminNav onLogout={() => {}} />
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Private Listings</h1>
            
            <PrivateListingsTable
              listings={listings}
              onViewDetails={setSelectedListing}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={isUpdating}
            />

            {selectedListing && (
              <ListingModal
                listing={selectedListing}
                onClose={() => setSelectedListing(null)}
                onApprove={
                  selectedListing.status === 'pending'
                    ? () => handleStatusUpdate(selectedListing.id!, 'approved')
                    : undefined
                }
                onReject={
                  selectedListing.status === 'pending'
                    ? () => handleStatusUpdate(selectedListing.id!, 'rejected')
                    : undefined
                }
                isUpdating={isUpdating}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const [{ data: profile }, { data: listings }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single(),
    supabase
      .from('private_listings')
      .select(`
        *,
        brand:brands (
          id,
          name,
          logo_url
        )
      `)
      .order('created_at', { ascending: false })
  ]);

  if (!profile || profile.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      profile,
      listings: listings || [],
    },
  };
};