import { useState } from 'react';
import { DEFAULT_FEATURES } from '@/constants/car';
import type { CarFeature, FeatureFormData, FeatureHandlers } from '@/types/features';

export function useFeatures(initialFeatures: string[] = []): FeatureFormData & FeatureHandlers {
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set(initialFeatures)
  );
  const [selectAll, setSelectAll] = useState(
    initialFeatures.length === DEFAULT_FEATURES.length
  );

  const toggleFeature = (feature: string) => {
    const next = new Set(selectedFeatures);
    if (next.has(feature)) {
      next.delete(feature);
    } else {
      next.add(feature);
    }
    setSelectedFeatures(next);
    setSelectAll(next.size === DEFAULT_FEATURES.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFeatures(new Set());
      setSelectAll(false);
    } else {
      setSelectedFeatures(new Set(DEFAULT_FEATURES));
      setSelectAll(true);
    }
  };

  const getFeatureArray = (): CarFeature[] => {
    return Array.from(selectedFeatures).map(name => ({
      name,
      available: true
    }));
  };

  return {
    selectedFeatures,
    selectAll,
    toggleFeature,
    handleSelectAll,
    getFeatureArray
  };
}