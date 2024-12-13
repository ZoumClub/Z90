import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Feature {
  id: string;
  name: string;
}

interface FeaturesProps {
  selectedFeatures: Set<string>;
  setSelectedFeatures: (features: Set<string>) => void;
}

export function Features({ selectedFeatures, setSelectedFeatures }: FeaturesProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('features')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeature = (featureId: string) => {
    const next = new Set(selectedFeatures);
    if (next.has(featureId)) {
      next.delete(featureId);
    } else {
      next.add(featureId);
    }
    setSelectedFeatures(next);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Features & Equipment</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Features & Equipment</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <label key={feature.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFeatures.has(feature.id)}
              onChange={() => toggleFeature(feature.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">{feature.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}