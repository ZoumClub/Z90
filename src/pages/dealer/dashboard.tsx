import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { DealerHeader } from '@/components/dealer/dashboard/DealerHeader';
import { ActionButtons } from '@/components/dealer/dashboard/ActionButtons';
import { InventorySection } from '@/components/dealer/dashboard/InventorySection';

export default function DealerDashboard() {
  const router = useRouter();
  const [dealerName, setDealerName] = useState('');
  const [dealerId, setDealerId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('dealer_id');
    const name = localStorage.getItem('dealer_name');

    if (!id) {
      router.replace('/dealer');
      return;
    }

    setDealerId(id);
    setDealerName(name || '');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dealer_id');
    localStorage.removeItem('dealer_name');
    router.replace('/dealer');
  };

  if (!dealerId) {
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
      <div className="min-h-screen bg-gray-50">
        <DealerHeader dealerName={dealerName} onLogout={handleLogout} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ActionButtons />
          <InventorySection dealerId={dealerId} />
        </div>
      </div>
    </Layout>
  );
}