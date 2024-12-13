```tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AdminNav } from '@/components/admin/dashboard/AdminNav';
import { AccessoryForm } from '@/components/admin/accessories/AccessoryForm';
import { createAccessory } from '@/lib/api/accessories';
import { toast } from 'react-hot-toast';
import type { Accessory } from '@/lib/types/accessory';

export default function NewAccessoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Accessory, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true);
    try {
      await createAccessory(data);
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
      <div className="flex min-h-screen">
        <AdminNav onLogout={() => router.push('/admin/login')} />
        
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Add New Accessory</h1>
              <button
                onClick={() => router.push('/admin/dashboard/accessories')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Accessories
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <AccessoryForm
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