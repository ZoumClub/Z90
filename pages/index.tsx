import { useState } from 'react';
import { GetStaticProps } from 'next';
import { Hero } from '@/components/home/Hero';
import { FilterButtons } from '@/components/home/FilterButtons';
import { CarGrid } from '@/components/home/CarGrid';
import { BrandLogos } from '@/components/home/BrandLogos';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/types/car';

interface HomePageProps {
  cars: Car[];
}

export default function HomePage({ cars }: HomePageProps) {
  const [filter, setFilter] = useState<'all' | 'new' | 'used'>('all');
  const [selectedMake, setSelectedMake] = useState<string | null>(null);

  const filteredCars = cars.filter(car => {
    const matchesCondition = filter === 'all' || car.condition === filter;
    const matchesMake = !selectedMake || car.make === selectedMake;
    return matchesCondition && matchesMake;
  });

  const handleMakeSelect = (make: string) => {
    setSelectedMake(make === selectedMake ? null : make);
  };

  return (
    <Layout>
      <main>
        <Hero />
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Our Collection</h2>
              <p className="text-gray-600">Find your perfect car from our extensive inventory</p>
            </div>
            <FilterButtons onFilterChange={setFilter} currentFilter={filter} />
            <CarGrid cars={filteredCars} filter={filter} />
          </div>
        </section>
        <BrandLogos onMakeSelect={handleMakeSelect} />
        <WhyChooseUs />
      </main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    const { data: cars, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      props: {
        cars: cars || []
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        cars: []
      },
      revalidate: 60,
    };
  }
}