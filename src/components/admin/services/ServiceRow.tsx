import { ServiceImage } from './ServiceImage';
import { ServiceDetails } from './ServiceDetails';
import { ServiceCategoryBadge } from './ServiceCategoryBadge';
import { ServiceStatusBadge } from './ServiceStatusBadge';
import { ServiceActions } from './ServiceActions';
import { VisibilityBadge } from '../common/VisibilityBadge';
import type { Service } from '@/types/service';

interface ServiceRowProps {
  service: Service;
  isUpdating: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

export function ServiceRow({
  service,
  isUpdating,
  onEdit,
  onDelete,
  onToggleVisibility
}: ServiceRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <ServiceImage src={service.image} alt={service.name} />
          <ServiceDetails name={service.name} description={service.description} />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ServiceCategoryBadge category={service.category} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        £{service.price.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {service.duration}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ServiceStatusBadge isAvailable={service.available} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <VisibilityBadge
          isVisible={service.visible}
          isUpdating={isUpdating}
          onClick={onToggleVisibility}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <ServiceActions onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}