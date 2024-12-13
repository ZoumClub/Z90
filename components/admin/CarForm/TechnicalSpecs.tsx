import type { Car } from '@/lib/supabase';

interface TechnicalSpecsProps {
  formData: Partial<Car>;
  setFormData: (data: Partial<Car>) => void;
}

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSION_TYPES = ['Automatic', 'Manual'];
const BODY_TYPES = ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Convertible', 'Van'];
const MILEAGE_RANGES = [
  'Under 1,000 miles',
  '1,000 - 5,000 miles',
  '5,000 - 10,000 miles',
  '10,000 - 20,000 miles',
  '20,000 - 30,000 miles',
  '30,000 - 50,000 miles',
  '50,000 - 75,000 miles',
  '75,000 - 100,000 miles',
  'Over 100,000 miles'
];

export function TechnicalSpecs({ formData, setFormData }: TechnicalSpecsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Technical Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mileage
          </label>
          <select
            name="mileage"
            value={formData.mileage || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select mileage range</option>
            {MILEAGE_RANGES.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type
          </label>
          <select
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select fuel type</option>
            {FUEL_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transmission
          </label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select transmission</option>
            {TRANSMISSION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body Type
          </label>
          <select
            name="body_type"
            value={formData.body_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select body type</option>
            {BODY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}