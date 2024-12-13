import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import { Layout } from '@/components/layout/Layout';
import { CarCard } from '@/components/home/CarCard';
import { supabase } from '@/lib/supabase';
import type { Make } from '@/lib/types/make';
import type { Car } from '@/lib/types/car';

interface MakePageProps {
  make: Make;
  cars: Car[];
}

export default function MakePage({ make, cars }: MakePageProps) {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 relative overflow-hidden rounded-full bg-white shadow-md">
              <Image
                src={make.logo_url}
                alt={`${make.name} logo`}
                fill
                sizes="80px"
                className="object-contain p-2"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{make.name} Cars</h1>
              <p className="text-gray-600 mt-1">
                {cars.length} {cars.length === 1 ? 'car' : 'cars'} available
              </p>
            </div>
          </div>

          {cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No cars available from {make.name} at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: makes } = await supabase
    .from('makes')
    .select('name');

  const paths = makes?.map((make) => ({
    params: { name: make.name.toLowerCase() },
  })) || [];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<MakePageProps> = async ({ params }) => {
  if (!params?.name) {
    return { notFound: true };
  }

  const makeName = params.name.toString().charAt(0).toUpperCase() + params.name.slice(1);

  const [{ data: make }, { data: cars }] = await Promise.all([
    supabase
      .from('makes')
      .select('*')
      .eq('name', makeName)
      .single(),
    supabase
      .from('cars')
      .select('*')
      .eq('make', makeName)
      .order('created_at', { ascending: false })
  ]);

  if (!make) {
    return { notFound: true };
  }

  return {
    props: {
      make,
      cars: cars || [],
    },
    revalidate: 60,
  };
};