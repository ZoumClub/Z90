import { Check } from 'lucide-react';
import { DEFAULT_FEATURES } from '@/constants/car';

interface CarFeaturesProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function CarFeatures({ formData, setFormData }: CarFeaturesProps) {
  const handleChange = (feature: string) => {
    const columnName = feature.toLowerCase().replace(/\s+/g, '_');
    setFormData(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = DEFAULT_FEATURES.every(feature => 
      formData[feature.toLowerCase().replace(/\s+/g, '_')]
    );

    const updates = DEFAULT_FEATURES.reduce((acc, feature) => ({
      ...acc,
      [feature.toLowerCase().replace(/\s+/g, '_')]: !allSelected
    }), {});

    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const isAllSelected = DEFAULT_FEATURES.every(feature => 
    formData[feature.toLowerCase().replace(/\s+/g, '_')]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Features & Equipment</h2>
        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-md">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Select All</span>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {DEFAULT_FEATURES.map((feature) => {
          const columnName = feature.toLowerCase().replace(/\s+/g, '_');
          return (
            <label 
              key={feature} 
              className="flex items-center space-x-2 cursor-pointer group hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={formData[columnName] || false}
                  onChange={() => handleChange(feature)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {formData[columnName] && (
                  <Check className="absolute text-white pointer-events-none transform scale-75" />
                )}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{feature}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}