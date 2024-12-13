import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { SellerHeader } from '@/components/seller/dashboard/SellerHeader';
import { ListingsList } from '@/components/seller/dashboard/ListingsList';
import { useSellerListings } from '@/lib/hooks/useSellerListings';

export default function SellerDashboard() {
  const router = useRouter();
  const { listings, isLoading } = useSellerListings();

  useEffect(() => {
    const sellerName = localStorage.getItem('seller_name');
    const sellerPhone = localStorage.getItem('seller_phone');

    if (!sellerName || !sellerPhone) {
      router.replace('/seller/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('seller_name');
    localStorage.removeItem('seller_phone');
    router.push('/seller/login');
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
        <SellerHeader 
          sellerName={localStorage.getItem('seller_name') || ''}
          onLogout={handleLogout}
        />
        <ListingsList listings={listings} />
      </div>
    </Layout>
  );
}