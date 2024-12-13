import { X, ShoppingBag } from 'lucide-react';
import type { Accessory } from '@/types/accessory';

interface AccessoryModalProps {
  accessory: Accessory;
  onClose: () => void;
}

export function AccessoryModal({ accessory, onClose }: AccessoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{accessory.name}</h2>
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
              src={accessory.image}
              alt={accessory.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{accessory.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  £{accessory.price.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {accessory.category}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <div className="text-sm font-medium text-gray-500">
                {accessory.in_stock ? 'In Stock' : 'Out of Stock'}
              </div>
              <button
                disabled={!accessory.in_stock}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}