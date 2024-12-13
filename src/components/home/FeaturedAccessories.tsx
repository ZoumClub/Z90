import { useState } from 'react';
import { Image } from '@/components/common/Image';
import { ShoppingBag } from 'lucide-react';
import type { Accessory } from '@/lib/types/accessory';

interface FeaturedAccessoriesProps {
  accessories: Accessory[];
}

export function FeaturedAccessories({ accessories }: FeaturedAccessoriesProps) {
  if (!accessories?.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Car Accessories</h2>
          <p className="text-gray-600">Enhance your driving experience with our premium accessories</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accessories.map((accessory) => (
            <div
              key={accessory.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative h-48">
                <Image
                  src={accessory.image}
                  alt={accessory.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {accessory.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      £{accessory.price.toLocaleString()}
                    </span>
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                      {accessory.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 line-clamp-2">
                  {accessory.description}
                </p>
                <button className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}