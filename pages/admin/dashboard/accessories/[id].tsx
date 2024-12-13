import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AccessoryForm } from '@/components/admin/accessories/AccessoryForm';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Accessory } from '@/lib/types/accessory';

export default function EditAccessoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadAccessory(id as string);
    }
  }, [id]);

  const loadAccessory = async (accessoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('accessories')
        .select('*')
        .eq('id', accessoryId)
        .single();

      if (error) throw error;
      setAccessory(data);
    } catch (error) {
      console.error('Error loading accessory:', error);
      toast.error('Failed to load accessory');
      router.push('/admin/dashboard/accessories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Accessory, 'id' | 'created_at' | 'updated_at'>) => {
    if (!accessory) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('accessories')
        .update(data)
        .eq('id', accessory.id);

      if (error) throw error;
      toast.success('Accessory updated successfully');
      router.push('/admin/dashboard/accessories');
    } catch (error) {
      console.error('Error updating accessory:', error);
      toast.error('Failed to update accessory');
    } finally {
      setIsSubmitting(false);
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

  if (!accessory) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Accessory not found</h2>
            <button
              onClick={() => router.push('/admin/dashboard/accessories')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Back to Accessories
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Edit Accessory</h1>
              <button
                onClick={() => router.push('/admin/dashboard/accessories')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Accessories
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <AccessoryForm
              initialData={accessory}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}