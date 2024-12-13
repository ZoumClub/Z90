import { useState } from 'react';
import { useRouter } from 'next/router';
import { createCar } from '@/lib/services/car';
import { toast } from 'react-hot-toast';
import type { Car } from '@/lib/types/car';

interface UseCarFormOptions {
  onSuccess?: () => void;
  redirectPath?: string;
}

export function useCarForm(options: UseCarFormOptions = {}) {
  const { onSuccess, redirectPath = '/admin/dashboard' } = options;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (formData: Partial<Car>, features: string[]) => {
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.brand_id) throw new Error('Please select a brand');
      if (!formData.model) throw new Error('Please enter a model');
      if (!formData.price) throw new Error('Please enter a price');
      if (!formData.image) throw new Error('Please upload an image');

      // Create car with features
      await createCar({
        ...formData,
        savings: formData.savings || Math.floor((formData.price || 0) * 0.1), // Default 10% savings
        is_sold: false
      } as any, features);

      toast.success('Car added successfully');
      
      if (onSuccess) {
        onSuccess();
      } else if (redirectPath) {
        router.push(redirectPath);
      }
    } catch (error) {
      console.error('Error submitting car:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save car');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return {
    isSubmitting,
    uploadProgress,
    handleSubmit
  };
}