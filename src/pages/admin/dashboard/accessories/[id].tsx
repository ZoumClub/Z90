```tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AdminNav } from '@/components/admin/dashboard/AdminNav';
import { AccessoryForm } from '@/components/admin/accessories/AccessoryForm';
import { updateAccessory } from '@/lib/api/accessories';
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
      await updateAccessory(accessory.id, data);
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
        <div className="flex min-h-screen">
          <AdminNav onLogout={() => router.push('/admin/login')} />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!accessory) {
    return (
      <Layout>
        <div className="flex min-h-screen">
          <AdminNav onLogout={() => router.push('/admin/login')} />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-500">Accessory not found</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Accessory</h1>
              <button
                onClick={() => router.push('/admin/dashboard/accessories')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Accessories
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <AccessoryForm
                initialData={accessory}
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