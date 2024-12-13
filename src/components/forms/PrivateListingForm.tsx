import { useState } from 'react';
import { useRouter } from 'next/router';
import { SellerInfo } from './SellerInfo';
import { CarBasicInfo } from './CarBasicInfo';
import { CarTechnicalSpecs } from './CarTechnicalSpecs';
import { CarColors } from './CarColors';
import { CarFeatures } from './CarFeatures';
import { CarMediaUpload } from './CarMediaUpload';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Brand } from '@/lib/types/brand';
import type { CarFeature } from '@/types/features';

interface PrivateListingFormProps {
  brands: Brand[];
  onSuccess?: () => void;
}

export function PrivateListingForm({ brands, onSuccess }: PrivateListingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brand_id: '',
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
    features: []
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

  const handleFeaturesChange = (features: CarFeature[]) => {
    setFormData(prev => ({
      ...prev,
      features
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <SellerInfo
        formData={formData}
        setFormData={setFormData}
      />

      <CarBasicInfo
        formData={formData}
        setFormData={setFormData}
        brands={brands}
      />

      <CarTechnicalSpecs
        formData={formData}
        setFormData={setFormData}
      />

      <CarColors
        formData={formData}
        setFormData={setFormData}
      />

      <CarFeatures
        initialFeatures={formData.features?.map(f => f.name) || []}
        onChange={handleFeaturesChange}
      />

      <CarMediaUpload
        formData={formData}
        setFormData={setFormData}
      />

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