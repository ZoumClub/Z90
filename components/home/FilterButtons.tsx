import { useState } from 'react';
import { Car, History } from 'lucide-react';

interface FilterButtonsProps {
  onFilterChange: (filter: 'all' | 'new' | 'used') => void;
  currentFilter: 'all' | 'new' | 'used';
}

export function FilterButtons({ onFilterChange, currentFilter }: FilterButtonsProps) {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={() => onFilterChange('new')}
        className={`
          flex items-center gap-2 px-6 py-3 
          rounded-lg font-medium transition-all duration-200
          ${currentFilter === 'new'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform -translate-y-0.5'
            : 'bg-white text-gray-700 hover:shadow-md hover:-translate-y-0.5'
          }
        `}
      >
        <Car className="w-5 h-5" />
        <span>New Cars</span>
      </button>
      <button
        onClick={() => onFilterChange('used')}
        className={`
          flex items-center gap-2 px-6 py-3 
          rounded-lg font-medium transition-all duration-200
          ${currentFilter === 'used'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform -translate-y-0.5'
            : 'bg-white text-gray-700 hover:shadow-md hover:-translate-y-0.5'
          }
        `}
      >
        <History className="w-5 h-5" />
        <span>Used Cars</span>
      </button>
    </div>
  );
}