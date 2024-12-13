import { ServiceCard } from './ServiceCard';
import type { Service } from '@/types/service';

interface ServiceGridProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

export function ServiceGrid({ services, onSelectService }: ServiceGridProps) {
  if (!services?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No services available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onSelect={onSelectService}
        />
      ))}
    </div>
  );
}