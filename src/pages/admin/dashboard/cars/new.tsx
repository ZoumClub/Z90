import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { CarForm } from '@/components/admin/CarForm';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function NewCarPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Car</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
        <CarForm 
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          onSuccess={() => {
            toast.success('Car added successfully');
            router.push('/admin/dashboard');
          }}
        />
      </div>
    </Layout>
  );
}