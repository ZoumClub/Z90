import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { DealerHeader } from '@/components/dealer/dashboard/DealerHeader';
import { ActionButtons } from '@/components/dealer/dashboard/ActionButtons';
import { InventorySection } from '@/components/dealer/dashboard/InventorySection';
import { useDealer } from '@/hooks/useDealer';

export default function DealerDashboard() {
  const router = useRouter();
  const { dealerId, dealerName, isLoading, logout } = useDealer();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!dealerId) {
    return null; // Let useDealer handle the redirect
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <DealerHeader dealerName={dealerName} onLogout={logout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ActionButtons />
          <InventorySection dealerId={dealerId} />
        </div>
      </div>
    </Layout>
  );
}

// Add getServerSideProps to ensure page is rendered on server
export async function getServerSideProps() {
  return {
    props: {} // Will be passed to the page component as props
  };
}