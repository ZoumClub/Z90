import { useState } from 'react';
import Image from 'next/image';
import { Phone, MessageCircle, MapPin, X, Building2, User } from 'lucide-react';

interface Dealer {
  id: string;
  name: string;
  shop_image: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  id_number: string;
}

interface DealerCardProps {
  dealer: Dealer;
  onClose: () => void;
}

export function DealerCard({ dealer, onClose }: DealerCardProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Dealer Information</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Dealer content */}
        <div className="p-4">
          {/* Shop image */}
          <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={dealer.shop_image}
              alt={dealer.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Dealer details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">{dealer.name}</h3>
                <p className="text-sm text-gray-500">ID: {dealer.id_number}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-900">{dealer.address}</p>
                <p className="text-sm text-gray-500">{dealer.city}</p>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <a
                href={`tel:${dealer.phone}`}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Phone className="h-5 w-5" />
                Call Dealer
              </a>
              <a
                href={`https://wa.me/${dealer.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}