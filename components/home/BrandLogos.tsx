import Image from 'next/image';
import Link from 'next/link';
import type { Brand } from '@/lib/supabase';

interface BrandLogosProps {
  brands: Brand[];
}

export function BrandLogos({ brands }: BrandLogosProps) {
  if (!brands?.length) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Brand</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.name.toLowerCase()}`}
              className="group flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-20 h-20 mb-4 overflow-hidden rounded-full relative">
                <Image
                  src={brand.logo_url}
                  alt={`${brand.name} logo`}
                  fill
                  sizes="80px"
                  className="object-cover group-hover:scale-110 transition-transform"
                  priority={false}
                />
              </div>
              <span className="text-gray-900 font-medium">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}