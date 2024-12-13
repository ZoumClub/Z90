import { useState } from 'react';
import { useRouter } from 'next/router';
import { BasicInfo } from './CarForm/BasicInfo';
import { TechnicalSpecs } from './CarForm/TechnicalSpecs';
import { Colors } from './CarForm/Colors';
import { Features } from './CarForm/Features';
import { MediaUpload } from './CarForm/MediaUpload';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Brand, Car } from '@/lib/supabase';

const DEFAULT_FEATURES = [
  'Speed Regulator',
  'Air Condition',
  'Reversing Camera',
  'Reversing Radar',
  'GPS Navigation',
  'Park Assist',
  'Start and Stop',
  'Airbag',
  'ABS',
  'Computer',
  'Rims',
  'Electric mirrors',
  'Electric windows',
  'Bluetooth'
];

interface CarFormComponentProps {
  brands: Brand[];
  initialData?: Car;
  onSuccess?: () => void;
}

export function CarFormComponent({ brands, initialData, onSuccess }: CarFormComponentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set(initialData?.features?.filter(f => f.available).map(f => f.name) || DEFAULT_FEATURES)
  );
  const [formData, setFormData] = useState<Partial<Car>>(initialData || {
    brand_id: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: undefined,
    savings: undefined,
    image: '',
    condition: 'new',
    mileage: '',
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

      const { data: car, error: carError } = initialData?.id
        ? await supabase
            .from('cars')
            .update(formData)
            .eq('id', initialData.id)
            .select()
            .single()
        : await supabase
            .from('cars')
            .insert([formData])
            .select()
            .single();

      if (carError) throw carError;

      // Manage features
      const features = Array.from(selectedFeatures).map(name => ({
        car_id: car.id,
        name,
        available: true
      }));

      const { error: featuresError } = await supabase.rpc('manage_car_features', {
        p_car_id: car.id,
        p_features: features
      });

      if (featuresError) throw featuresError;

      toast.success(initialData ? 'Car updated successfully' : 'Car added successfully');

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error submitting car:', error);
      toast.error('Failed to save car');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <BasicInfo
        formData={formData}
        setFormData={setFormData}
        brands={brands}
      />

      <TechnicalSpecs
        formData={formData}
        setFormData={setFormData}
      />

      <Colors
        formData={formData}
        setFormData={setFormData}
      />

      <Features
        selectedFeatures={selectedFeatures}
        setSelectedFeatures={setSelectedFeatures}
        defaultFeatures={DEFAULT_FEATURES}
      />

      <MediaUpload
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