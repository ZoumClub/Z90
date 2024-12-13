import { useState } from 'react';
import { GetStaticProps } from 'next';
import { Hero } from '@/components/home/Hero';
import { FilterButtons } from '@/components/home/FilterButtons';
import { CarGrid } from '@/components/home/CarGrid';
import { BrandLogos } from '@/components/home/BrandLogos';
import { AccessorySection } from '@/components/home/accessories/AccessorySection';
import { ServiceSection } from '@/components/home/services/ServiceSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/types/car';
import type { Accessory } from '@/types/accessory';
import type { Service } from '@/types/service';

interface HomePageProps {
  cars: Car[];
  accessories: Accessory[];
  services: Service[];
}

export default function HomePage({ cars, accessories, services }: HomePageProps) {
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
        <AccessorySection accessories={accessories} />
        <ServiceSection services={services} />
        <WhyChooseUs />
      </main>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    const [{ data: cars }, { data: accessories }, { data: services }] = await Promise.all([
      supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('accessories')
        .select('*')
        .eq('visible', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('main_services') // Note: Using main_services table instead of services
        .select('*')
        .eq('visible', true)
        .eq('available', true)
        .order('created_at', { ascending: false })
    ]);

    return {
      props: {
        cars: cars || [],
        accessories: accessories || [],
        services: services || []
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        cars: [],
        accessories: [],
        services: []
      },
      revalidate: 60
    };
  }
};