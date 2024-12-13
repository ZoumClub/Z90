import { useState } from 'react';
import { ServiceGrid } from './ServiceGrid';
import { ServiceModal } from './modals/ServiceModal';
import type { Service } from '@/types/service';

interface ServiceSectionProps {
  services: Service[];
}

export function ServiceSection({ services }: ServiceSectionProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-gray-600">Professional car services to keep your vehicle in perfect condition</p>
        </div>
        
        <ServiceGrid 
          services={services} 
          onSelectService={setSelectedService} 
        />

        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </div>
    </section>
  );
}