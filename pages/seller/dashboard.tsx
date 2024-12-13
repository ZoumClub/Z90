import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { SellerDashboard } from '@/components/seller/SellerDashboard';

export default function SellerDashboardPage() {
  const router = useRouter();

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

  return (
    <Layout>
      <SellerDashboard 
        sellerName={localStorage.getItem('seller_name') || ''}
        onLogout={handleLogout}
      />
    </Layout>
  );
}