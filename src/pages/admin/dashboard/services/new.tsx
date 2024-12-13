```tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AdminNav } from '@/components/admin/dashboard/AdminNav';
import { ServiceForm } from '@/components/admin/services/ServiceForm';
import { createService } from '@/lib/api/services';
import { toast } from 'react-hot-toast';
import type { Service } from '@/lib/types/service';

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true);
    try {
      await createService(data);
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
      <div className="flex min-h-screen">
        <AdminNav onLogout={() => router.push('/admin/login')} />
        
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Add New Service</h1>
              <button
                onClick={() => router.push('/admin/dashboard/services')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Services
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <ServiceForm
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