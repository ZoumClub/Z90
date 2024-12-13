import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { FeatureForm } from '@/components/features/FeatureForm';
import { FeatureList } from '@/components/features/FeatureList';
import { useFeatures } from '@/hooks/useFeatures';

interface Feature {
  id: string;
  name: string;
  created_at: string;
}

export default function FeaturesPage() {
  const router = useRouter();
  const { 
    features, 
    isLoading, 
    isSubmitting, 
    loadFeatures, 
    addFeature, 
    updateFeature, 
    deleteFeature 
  } = useFeatures();
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  const handleSubmit = async (name: string) => {
    if (editingFeature) {
      await updateFeature(editingFeature.id, name);
      setEditingFeature(null);
    } else {
      await addFeature(name);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    await deleteFeature(id);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Manage Features</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <FeatureForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            editingFeature={editingFeature}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <FeatureList
            features={features}
            onEdit={setEditingFeature}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}