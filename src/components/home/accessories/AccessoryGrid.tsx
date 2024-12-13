import { AccessoryCard } from './AccessoryCard';
import type { Accessory } from '@/types/accessory';

interface AccessoryGridProps {
  accessories: Accessory[];
  onSelectAccessory: (accessory: Accessory) => void;
}

export function AccessoryGrid({ accessories, onSelectAccessory }: AccessoryGridProps) {
  if (!accessories?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No accessories available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {accessories.map((accessory) => (
        <AccessoryCard
          key={accessory.id}
          accessory={accessory}
          onSelect={onSelectAccessory}
        />
      ))}
    </div>
  );
}