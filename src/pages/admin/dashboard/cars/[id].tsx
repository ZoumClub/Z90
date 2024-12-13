import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { CarFormComponent } from '@/components/admin/CarFormComponent';
import { supabase } from '@/lib/supabase';
import type { Brand, Car } from '@/lib/types/car';

interface EditCarPageProps {
  car: Car;
  brands: Brand[];
}

export default function EditCarPage({ car, brands }: EditCarPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Car</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <CarFormComponent 
            brands={brands}
            initialData={car}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSuccess={() => router.push('/admin/dashboard')}
          />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }

  const [{ data: car }, { data: brands }] = await Promise.all([
    supabase
      .from('cars_with_brand')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('brands')
      .select('*')
      .order('name')
  ]);

  if (!car || !brands) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      car,
      brands,
    },
  };
};