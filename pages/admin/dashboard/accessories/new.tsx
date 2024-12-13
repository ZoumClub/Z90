import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AccessoryForm } from '@/components/admin/accessories/AccessoryForm';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Accessory } from '@/lib/types/accessory';

export default function NewAccessoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Accessory, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('accessories')
        .insert([data]);

      if (error) throw error;
      toast.success('Accessory created successfully');
      router.push('/admin/dashboard/accessories');
    } catch (error) {
      console.error('Error creating accessory:', error);
      toast.error('Failed to create accessory');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Add New Accessory</h1>
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
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}