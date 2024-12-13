```tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AdminNav } from '@/components/admin/dashboard/AdminNav';
import { ServiceForm } from '@/components/admin/services/ServiceForm';
import { updateService } from '@/lib/api/services';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Service } from '@/lib/types/service';

export default function EditServicePage() {
  const router = useRouter();
  const { id } = router.query;
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadService(id as string);
    }
  }, [id]);

  const loadService = async (serviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error loading service:', error);
      toast.error('Failed to load service');
      router.push('/admin/dashboard/services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    if (!service) return;
    
    setIsSubmitting(true);
    try {
      await updateService(service.id, data);
      toast.success('Service updated successfully');
      router.push('/admin/dashboard/services');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen">
          <AdminNav onLogout={() => router.push('/admin/login')} />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="flex min-h-screen">
          <AdminNav onLogout={() => router.push('/admin/login')} />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-500">Service not found</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex min-h-screen">
        <AdminNav onLogout={() => router.push('/admin/login')} />
        
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
              <button
                onClick={() => router.push('/admin/dashboard/services')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Services
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <ServiceForm
                initialData={service}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```