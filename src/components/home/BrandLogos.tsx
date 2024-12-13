import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import type { Make } from '@/lib/types/make';

export function BrandLogos() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadMakes();
  }, []);

  const loadMakes = async () => {
    try {
      const { data, error } = await supabase
        .from('makes')
        .select('*')
        .order('name');

      if (error) throw error;
      setMakes(data || []);
    } catch (error) {
      console.error('Error loading makes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeClick = (make: Make) => {
    router.push(`/cars/make/${make.name.toLowerCase()}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Make</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {makes.map((make) => (
            <button
              key={make.id}
              onClick={() => handleMakeClick(make)}
              className="group flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="w-20 h-20 mb-4 overflow-hidden rounded-full relative bg-white">
                <Image
                  src={make.logo_url}
                  alt={`${make.name} logo`}
                  fill
                  sizes="80px"
                  className="object-contain p-2 group-hover:scale-110 transition-transform"
                  loading="lazy"
                />
              </div>
              <span className="text-gray-900 font-medium">{make.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}