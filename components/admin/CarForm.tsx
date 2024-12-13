import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Car } from '@/lib/supabase';

interface CarFormProps {
  initialData?: Car;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onSuccess?: () => void;
}

export function CarForm({ 
  initialData,
  isSubmitting,
  setIsSubmitting,
  onSuccess
}: CarFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Car>>(initialData || {
    brand_id: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    savings: 0,
    image: '',
    condition: 'new',
    is_sold: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData?.id) {
        // Update existing car
        const { error } = await supabase
          .from('cars')
          .update(formData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Car updated successfully');
      } else {
        // Create new car
        const { error } = await supabase
          .from('cars')
          .insert([formData]);

        if (error) throw error;
        toast.success('Car added successfully');
      }

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

  // Form fields JSX...
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}