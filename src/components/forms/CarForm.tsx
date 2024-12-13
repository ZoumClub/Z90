import { useState } from 'react';
import { useRouter } from 'next/router';
import { CarBasicInfo } from './CarBasicInfo';
import { CarTechnicalSpecs } from './CarTechnicalSpecs';
import { CarColors } from './CarColors';
import { CarFeatures } from './CarFeatures';
import { CarMediaUpload } from './CarMediaUpload';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Brand } from '@/lib/types/brand';
import type { CarFeature } from '@/types/features';

interface CarFormProps {
  brands: Brand[];
  initialData?: any;
  onSuccess?: () => void;
  isDealer?: boolean;
}

export function CarForm({ brands, initialData, onSuccess, isDealer = false }: CarFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ...initialData || {
      brand_id: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      savings: '',
      image: '',
      video_url: '',
      condition: isDealer ? 'used' : 'new',
      mileage: 'Under 1,000 km',
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      body_type: 'Sedan',
      exterior_color: 'Black',
      interior_color: 'Black',
      number_of_owners: 1,
      is_sold: false,
      features: []
    }
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

      const data = {
        ...formData,
        features: formData.features || []
      };

      if (initialData?.id) {
        // Update existing car
        const { error } = await supabase
          .from('cars')
          .update(data)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Car updated successfully');
      } else {
        // Create new car
        const { error } = await supabase
          .from('cars')
          .insert([data]);

        if (error) throw error;
        toast.success('Car added successfully');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(isDealer ? '/dealer/inventory' : '/admin/dashboard');
      }
    } catch (error) {
      console.error('Error submitting car:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save car');
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
          {isSubmitting ? 'Saving...' : initialData ? 'Update Car' : 'Add Car'}
        </button>
      </div>
    </form>
  );
}