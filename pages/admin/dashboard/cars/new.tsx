import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { CarFormComponent } from '@/components/admin/CarFormComponent';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Brand } from '@/lib/supabase';

export default function NewCarPage() {
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Car</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <CarFormComponent 
            brands={brands} 
            onSuccess={() => {
              toast.success('Car added successfully');
              router.push('/admin/dashboard');
            }}
          />
        </div>
      </div>
    </Layout>
  );
}
