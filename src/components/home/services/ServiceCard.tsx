import { Clock, Wrench } from 'lucide-react';
import { Image } from '@/components/common/Image';
import type { Service } from '@/types/service';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

export function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
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
          <button 
            onClick={() => onSelect(service)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Wrench className="h-5 w-5" />
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}