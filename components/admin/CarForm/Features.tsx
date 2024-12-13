interface FeaturesProps {
  selectedFeatures: Set<string>;
  setSelectedFeatures: (features: Set<string>) => void;
  defaultFeatures: string[];
}

export function Features({ selectedFeatures, setSelectedFeatures, defaultFeatures }: FeaturesProps) {
  const toggleFeature = (feature: string) => {
    const next = new Set(selectedFeatures);
    if (next.has(feature)) {
      next.delete(feature);
    } else {
      next.add(feature);
    }
    setSelectedFeatures(next);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {defaultFeatures.map((feature) => (
          <label key={feature} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFeatures.has(feature)}
              onChange={() => toggleFeature(feature)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">{feature}</span>
          </label>
        ))}
      </div>
    </div>
  );
}