import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { CarForm } from '@/components/admin/CarForm';
import { supabase } from '@/lib/supabase';
import type { Brand, Car, Dealer } from '@/lib/supabase';

interface EditCarPageProps {
  brands: Brand[];
  dealers: Dealer[];
  car: Car;
}

export default function EditCarPage({ brands, dealers, car }: EditCarPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Car</h1>
          <button
            onClick={() => router.push('/admin/dashboard/cars')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
        <CarForm 
          brands={brands}
          dealers={dealers}
          initialData={car}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
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

  const [{ data: brands }, { data: dealers }, { data: car }] = await Promise.all([
    supabase
      .from('brands')
      .select('*')
      .order('name'),
    supabase
      .from('dealers')
      .select('*')
      .order('name'),
    supabase
      .from('cars')
      .select(`
        *,
        brand:brands (
          id,
          name,
          logo_url
        ),
        features:car_features (
          id,
          name,
          available
        )
      `)
      .eq('id', params.id)
      .single()
  ]);

  if (!car) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      brands: brands || [],
      dealers: dealers || [],
      car,
    },
  };
};