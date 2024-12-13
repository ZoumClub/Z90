import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AccessoryList } from '@/components/admin/accessories/AccessoryList';
import { useAccessories } from '@/hooks/useAccessories';

export default function AccessoriesPage() {
  const router = useRouter();
  const { 
    accessories, 
    isLoading, 
    updatingId,
    loadAccessories, 
    toggleVisibility,
    handleDelete 
  } = useAccessories();

  useEffect(() => {
    loadAccessories();
  }, [loadAccessories]);

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
      <div className="min-h-screen bg-gray-50">
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
              updatingId={updatingId}
              onToggleVisibility={toggleVisibility}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}