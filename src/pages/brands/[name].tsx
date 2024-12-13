import { GetStaticProps, GetStaticPaths } from 'next';
import { Layout } from '@/components/layout/Layout';
import { CarCard } from '@/components/home/CarCard';
import { supabase } from '@/lib/supabase';
import type { Car, Brand } from '@/lib/supabase';

interface BrandPageProps {
  brand: Brand;
  cars: Car[];
}

export default function BrandPage({ brand, cars }: BrandPageProps) {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 relative overflow-hidden rounded-full">
              <img
                src={brand.logo_url}
                alt={`${brand.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{brand.name} Cars</h1>
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
                No cars available from {brand.name} at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: brands } = await supabase
    .from('brands')
    .select('name');

  const paths = brands?.map((brand) => ({
    params: { name: brand.name.toLowerCase() },
  })) || [];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<BrandPageProps> = async ({ params }) => {
  if (!params?.name) {
    return { notFound: true };
  }

  const brandName = (params.name as string).charAt(0).toUpperCase() + (params.name as string).slice(1);

  const [{ data: brand }, { data: cars }] = await Promise.all([
    supabase
      .from('brands')
      .select('*')
      .ilike('name', brandName)
      .single(),
    supabase
      .from('cars')
      .select(`
        *,
        brand:brands (
          id,
          name,
          logo_url
        )
      `)
      .ilike('make', brandName)
      .order('created_at', { ascending: false })
  ]);

  if (!brand) {
    return { notFound: true };
  }

  return {
    props: {
      brand,
      cars: cars || [],
    },
    revalidate: 60,
  };
};