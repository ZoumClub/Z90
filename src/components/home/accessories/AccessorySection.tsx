import { useState } from 'react';
import { AccessoryGrid } from './AccessoryGrid';
import { AccessoryModal } from './modals/AccessoryModal';
import type { Accessory } from '@/types/accessory';

interface AccessorySectionProps {
  accessories: Accessory[];
}

export function AccessorySection({ accessories }: AccessorySectionProps) {
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Car Accessories</h2>
          <p className="text-gray-600">Enhance your driving experience with our premium accessories</p>
        </div>
        
        <AccessoryGrid 
          accessories={accessories} 
          onSelectAccessory={setSelectedAccessory} 
        />

        {selectedAccessory && (
          <AccessoryModal
            accessory={selectedAccessory}
            onClose={() => setSelectedAccessory(null)}
          />
        )}
      </div>
    </section>
  );
}