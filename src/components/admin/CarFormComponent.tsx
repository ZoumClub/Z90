import { useState } from 'react';
import { useRouter } from 'next/router';
import { BasicInfo } from './CarForm/BasicInfo';
import { TechnicalSpecs } from './CarForm/TechnicalSpecs';
import { Colors } from './CarForm/Colors';
import { Features } from './CarForm/Features';
import { MediaUpload } from './CarForm/MediaUpload';
import { useCarForm } from '@/hooks/useCarForm';
import type { Brand, Car } from '@/lib/types/car';

interface CarFormComponentProps {
  brands: Brand[];
  initialData?: Car;
  onSuccess?: () => void;
}

export function CarFormComponent({ brands, initialData, onSuccess }: CarFormComponentProps) {
  const router = useRouter();
  const { isSubmitting, uploadProgress, handleSubmit } = useCarForm({
    onSuccess,
    redirectPath: '/admin/dashboard'
  });

  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set(initialData?.features?.filter(f => f.available).map(f => f.name) || [])
  );

  const [formData, setFormData] = useState<Partial<Car>>(initialData || {
    brand_id: '',
    model: '',
    year: new Date().getFullYear(),
    price: undefined,
    savings: undefined,
    image: '',
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData, Array.from(selectedFeatures));
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
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
      />

      <MediaUpload
        formData={formData}
        setFormData={setFormData}
        uploadProgress={uploadProgress}
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