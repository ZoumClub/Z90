import { useState } from 'react';
import { useRouter } from 'next/router';
import { ImageUpload } from '../common/ImageUpload';
import { VideoUpload } from '../common/VideoUpload';
import { CarFeatures } from '../forms/CarFeatures';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  FUEL_TYPES, 
  TRANSMISSION_TYPES, 
  BODY_TYPES, 
  COLORS,
  MILEAGE_RANGES
} from '@/constants/car';

const MAKES = [
  'BMW',
  'Mercedes',
  'Audi', 
  'Toyota',
  'Honda',
  'Ford',
  'Volkswagen'
];

export function PrivateListingForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    image: '',
    video_url: '',
    condition: 'used',
    mileage: 'Under 1,000 km',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Sedan',
    exterior_color: 'Black',
    interior_color: 'Black',
    number_of_owners: 1,
    client_name: '',
    client_phone: '',
    client_city: '',
    // Feature flags
    speed_regulator: false,
    air_condition: false,
    reversing_camera: false,
    reversing_radar: false,
    gps_navigation: false,
    park_assist: false,
    start_stop: false,
    airbag: false,
    abs: false,
    computer: false,
    rims: false,
    electric_mirrors: false,
    electric_windows: false,
    bluetooth: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.make) {
        throw new Error('Please select a make');
      }

      if (!formData.image) {
        throw new Error('Please upload at least one image');
      }

      // Validate phone number format (4 digits)
      if (!/^\d{4}$/.test(formData.client_phone)) {
        throw new Error('Please enter exactly 4 digits for phone number');
      }

      const { error } = await supabase
        .from('private_listings')
        .insert([{
          ...formData,
          status: 'pending'
        }]);

      if (error) throw error;

      toast.success('Your car listing has been submitted successfully!');
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/seller/login');
      }
    } catch (error) {
      console.error('Error submitting listing:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'client_phone') {
      // Only allow digits and limit to 4 characters
      const digits = value.replace(/\D/g, '').slice(0, 4);
      setFormData(prev => ({ ...prev, client_phone: digits }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last 4 Digits of Phone Number
            </label>
            <input
              type="text"
              name="client_phone"
              value={formData.client_phone}
              onChange={handleChange}
              placeholder="1234"
              maxLength={4}
              pattern="\d{4}"
              title="Please enter exactly 4 digits"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              You'll need these digits to log in and check your listing status
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="client_city"
              value={formData.client_city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Car Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Car Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Make
            </label>
            <select
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a make</option>
              {MAKES.map((make) => (
                <option key={make} value={make}>{make}</option>
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
              Mileage
            </label>
            <select
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {MILEAGE_RANGES.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Owners
            </label>
            <input
              type="number"
              name="number_of_owners"
              value={formData.number_of_owners}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-white p-6 rounded-lg shadow-md">
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
      <CarFeatures
        formData={formData}
        setFormData={setFormData}
      />

      {/* Images and Video */}
      <div className="bg-white p-6 rounded-lg shadow-md">
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
          {isSubmitting ? 'Submitting...' : 'Submit Listing'}
        </button>
      </div>
    </form>
  );
}