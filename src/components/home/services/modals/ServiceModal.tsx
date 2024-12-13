import { X, Clock, Calendar } from 'lucide-react';
import type { Service } from '@/types/service';

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative h-64 rounded-lg overflow-hidden mb-6">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  £{service.price.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {service.category}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <div className="flex items-center gap-2 text-gray-900 mt-1">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>{service.duration}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <div className="flex items-center gap-2 text-gray-900 mt-1">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>{service.available ? 'Available Now' : 'Currently Unavailable'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <div className="text-sm font-medium text-gray-500">
                {service.available ? 'Book your appointment now' : 'Service temporarily unavailable'}
              </div>
              <button
                disabled={!service.available}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}