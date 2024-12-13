import { useState } from 'react';
import { useRouter } from 'next/router';
import { ImageUpload } from '../common/ImageUpload';
import { VideoUpload } from '../common/VideoUpload';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Brand } from '@/lib/types/car';
import { 
  FUEL_TYPES, 
  TRANSMISSION_TYPES, 
  BODY_TYPES, 
  COLORS,
  DEFAULT_FEATURES 
} from '@/constants/car';

interface DealerCarFormProps {
  brands: Brand[];
  dealerId: string;
  onSuccess?: () => void;
}

export function DealerCarForm({ brands, dealerId, onSuccess }: DealerCarFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    brand_id: '',
    dealer_id: dealerId,
    model: '',
    year: new Date().getFullYear(),
    price: '',
    savings: '',
    image: '',
    video_url: '',
    condition: 'new',
    mileage: 'Under 1,000 km',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Sedan',
    exterior_color: 'Black',
    interior_color: 'Black',
    number_of_owners: 1,
    is_sold: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.brand_id) {
        throw new Error('Please select a brand');
      }

      if (!formData.image) {
        throw new Error('Please upload at least one image');
      }

      const price = parseFloat(formData.price.toString());
      const savings = parseFloat(formData.savings.toString());

      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price');
      }

      if (isNaN(savings) || savings < 0) {
        throw new Error('Please enter a valid discount amount');
      }

      if (savings >= price) {
        throw new Error('Discount cannot be greater than or equal to the price');
      }

      // First create the car
      const { data: car, error: carError } = await supabase
        .from('cars')
        .insert([{
          ...formData,
          price,
          savings,
          is_sold: false
        }])
        .select()
        .single();

      if (carError) throw carError;

      // Then add features
      if (selectedFeatures.size > 0) {
        const { error: featuresError } = await supabase
          .from('car_features')
          .insert(
            Array.from(selectedFeatures).map(name => ({
              car_id: car.id,
              name,
              available: true
            }))
          );

        if (featuresError) throw featuresError;
      }

      toast.success('Car listed successfully!');
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dealer/inventory');
      }
    } catch (error) {
      console.error('Error submitting car:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit car');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'brand_id') {
      const selectedBrand = brands.find(b => b.id === value);
      if (selectedBrand) {
        setFormData(prev => ({
          ...prev,
          brand_id: value
        }));
      }
    }
  };

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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Car Information */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Car Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <select
              name="brand_id"
              value={formData.brand_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (£)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount (£)
            </label>
            <input
              type="number"
              name="savings"
              value={formData.savings}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter discount amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mileage
            </label>
            <select
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Under 1,000 km">Under 1,000 km</option>
              <option value="1,000 - 5,000 km">1,000 - 5,000 km</option>
              <option value="5,000 - 10,000 km">5,000 - 10,000 km</option>
              <option value="10,000 - 20,000 km">10,000 - 20,000 km</option>
              <option value="20,000 - 30,000 km">20,000 - 30,000 km</option>
              <option value="30,000 - 50,000 km">30,000 - 50,000 km</option>
              <option value="50,000 - 75,000 km">50,000 - 75,000 km</option>
              <option value="75,000 - 100,000 km">75,000 - 100,000 km</option>
              <option value="100,000 - 150,000 km">100,000 - 150,000 km</option>
              <option value="Over 150,000 km">Over 150,000 km</option>
            </select>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {BODY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exterior Color
            </label>
            <select
              name="exterior_color"
              value={formData.exterior_color}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {COLORS.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interior Color
            </label>
            <select
              name="interior_color"
              value={formData.interior_color}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {COLORS.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Features & Equipment */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Equipment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {DEFAULT_FEATURES.map((feature) => (
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

      {/* Images and Video */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Images and Video</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image
          </label>
          <ImageUpload
            onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
            className="mb-4"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Car preview"
              className="w-full h-48 object-cover rounded-md"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video (Optional)
          </label>
          <VideoUpload
            onVideoUploaded={(url) => setFormData(prev => ({ ...prev, video_url: url }))}
            existingVideo={formData.video_url}
            onVideoRemoved={() => setFormData(prev => ({ ...prev, video_url: '' }))}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Listing Car...' : 'List Car'}
        </button>
      </div>
    </form>
  );
}