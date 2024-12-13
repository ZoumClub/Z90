import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AccessoryList } from '@/components/admin/accessories/AccessoryList';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Accessory } from '@/lib/types/accessory';

export default function AccessoriesPage() {
  const router = useRouter();
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAccessories();
  }, []);

  const loadAccessories = async () => {
    try {
      const { data, error } = await supabase
        .from('accessories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccessories(data || []);
    } catch (error) {
      console.error('Error loading accessories:', error);
      toast.error('Failed to load accessories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('accessories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Accessory deleted successfully');
      loadAccessories();
    } catch (error) {
      console.error('Error deleting accessory:', error);
      toast.error('Failed to delete accessory');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Manage Accessories</h1>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-end mb-8">
            <button
              onClick={() => router.push('/admin/dashboard/accessories/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Accessory
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <AccessoryList 
              accessories={accessories}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}