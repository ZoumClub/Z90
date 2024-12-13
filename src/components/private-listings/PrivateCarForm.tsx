import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ImageUpload } from '../common/ImageUpload';
import { VideoUpload } from '../common/VideoUpload';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Brand } from '@/lib/supabase';

interface Feature {
  id: string;
  name: string;
}

interface PrivateCarFormProps {
  brands: Brand[];
  onSuccess?: () => void;
}

export function PrivateCarForm({ brands, onSuccess }: PrivateCarFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    brand_id: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    image: '',
    video_url: '',
    condition: 'used' as const,
    mileage: 'Under 1,000 km',
    fuel_type: 'Petrol' as const,
    transmission: 'Automatic' as const,
    body_type: 'Sedan' as const,
    exterior_color: 'Black' as const,
    interior_color: 'Black' as const,
    number_of_owners: 1,
    client_name: '',
    client_phone: '', // Last 4 digits only
    client_city: ''
  });

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
      toast.error('Failed to load features');
    }
  };

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

      // Validate last 4 digits
      if (!/^\d{4}$/.test(formData.client_phone)) {
        throw new Error('Please enter exactly 4 digits');
      }

      // First create the listing
      const { data: listing, error: listingError } = await supabase
        .from('private_listings')
        .insert([{
          ...formData,
          price: Number(formData.price)
        }])
        .select()
        .single();

      if (listingError) throw listingError;

      // Then add the features
      if (selectedFeatures.size > 0) {
        const { error: featuresError } = await supabase
          .from('private_listing_features')
          .insert(
            Array.from(selectedFeatures).map(featureId => ({
              listing_id: listing.id,
              feature_id: featureId,
              available: true
            }))
          );

        if (featuresError) throw featuresError;
      }

      toast.success('Your car listing has been submitted successfully!');
      router.push('/seller/login');
    } catch (error) {
      console.error('Error submitting car:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'brand_id') {
      const selectedBrand = brands.find(b => b.id === value);
      if (selectedBrand) {
        setFormData({
          ...formData,
          brand_id: value,
          make: selectedBrand.name
        });
      }
    } else if (name === 'client_phone') {
      // Only allow digits and limit to 4 characters
      const digits = value.replace(/\D/g, '').slice(0, 4);
      setFormData({
        ...formData,
        client_phone: digits
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Previous Owners
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
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
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
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
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
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Coupe">Coupe</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Convertible">Convertible</option>
              <option value="Van">Van</option>
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
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Silver">Silver</option>
              <option value="Blue">Blue</option>
              <option value="Red">Red</option>
              <option value="Grey">Grey</option>
              <option value="Green">Green</option>
              <option value="Brown">Brown</option>
              <option value="Beige">Beige</option>
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
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Silver">Silver</option>
              <option value="Blue">Blue</option>
              <option value="Red">Red</option>
              <option value="Grey">Grey</option>
              <option value="Green">Green</option>
              <option value="Brown">Brown</option>
              <option value="Beige">Beige</option>
            </select>
          </div>
        </div>
      </div>

      {/* Features & Equipment */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Equipment</h2>
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
          {isSubmitting ? 'Submitting...' : 'Submit Listing'}
        </button>
      </div>
    </form>
  );
}