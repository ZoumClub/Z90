import { GetStaticProps } from 'next';
import { Hero } from '@/components/home/Hero';
import { FeaturedCars } from '@/components/home/FeaturedCars';
import { UsedCars } from '@/components/home/UsedCars';
import { BrandLogos } from '@/components/home/BrandLogos';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import type { Brand, Car } from '@/lib/supabase';

interface HomePageProps {
  brands: Brand[];
  newCars: Car[];
  usedCars: Car[];
}

export default function HomePage({ brands, newCars, usedCars }: HomePageProps) {
  return (
    <Layout>
      <main>
        <Hero />
        <FeaturedCars cars={newCars} />
        <UsedCars cars={usedCars} />
        <BrandLogos brands={brands} />
        <WhyChooseUs />
      </main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const [brandsResponse, newCarsResponse, usedCarsResponse] = await Promise.all([
    supabase.from('brands').select('*').order('name'),
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
      .eq('condition', 'new')
      .order('created_at', { ascending: false })
      .limit(6),
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
      .eq('condition', 'used')
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  return {
    props: {
      brands: brandsResponse.data || [],
      newCars: newCarsResponse.data || [],
      usedCars: usedCarsResponse.data || [],
    },
    revalidate: 60,
  };
};