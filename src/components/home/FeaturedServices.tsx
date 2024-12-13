import { useState } from 'react';
import { Image } from '@/components/common/Image';
import { Clock, Wrench } from 'lucide-react';
import type { Service } from '@/lib/types/service';

interface FeaturedServicesProps {
  services: Service[];
}

export function FeaturedServices({ services }: FeaturedServicesProps) {
  if (!services?.length) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-gray-600">Professional car services to keep your vehicle in perfect condition</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative h-48">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {service.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      £{service.price.toLocaleString()}
                    </span>
                    <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                      {service.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 line-clamp-2">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-5 w-5" />
                    <span>{service.duration}</span>
                  </div>
                  <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    <Wrench className="h-5 w-5" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}