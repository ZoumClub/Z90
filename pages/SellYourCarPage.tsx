import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PrivateCarForm } from '@/components/private-listings/PrivateCarForm';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Brand } from '@/lib/supabase';

export default function SellYourCarPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSuccess = () => {
    toast.success('Your car listing has been submitted successfully!');
    router.push('/seller/login');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Sell Your Car
            </h1>
            <PrivateCarForm brands={brands} onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </Layout>
  );
}