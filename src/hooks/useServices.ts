import { useDataManagement } from './common/useDataManagement';
import { getServices, deleteService } from '@/lib/api/services';
import type { Service } from '@/types/service';

export function useServices() {
  const {
    items: services,
    isLoading,
    updatingId,
    loadData: loadServices,
    toggleVisibility,
    handleDelete
  } = useDataManagement<Service>({
    table: 'main_services',
    fetchData: getServices,
    deleteItem: deleteService
  });

  return {
    services,
    isLoading,
    updatingId,
    loadServices,
    toggleVisibility,
    handleDelete
  };
}