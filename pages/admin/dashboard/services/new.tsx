import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { ServiceForm } from '@/components/admin/services/ServiceForm';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Service } from '@/lib/types/service';

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('services')
        .insert([data]);

      if (error) throw error;
      toast.success('Service created successfully');
      router.push('/admin/dashboard/services');
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service');
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
              <h1 className="text-2xl font-bold text-gray-900">Add New Service</h1>
              <button
                onClick={() => router.push('/admin/dashboard/services')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Services
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <ServiceForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}