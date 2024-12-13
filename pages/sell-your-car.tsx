import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { PrivateCarForm } from '@/components/private-listings/PrivateCarForm';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Brand } from '@/lib/types/car';

export default function SellYourCarPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error loading brands:', error);
      toast.error('Failed to load brands');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    toast.success('Your car listing has been submitted successfully!');
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