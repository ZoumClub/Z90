```typescript
import { getAccessories, deleteAccessory } from '@/lib/api/accessories';
import { useDataManagement } from './common/useDataManagement';
import type { Accessory } from '@/types/accessory';

export function useAccessories() {
  const {
    items: accessories,
    isLoading,
    updatingId,
    loadData: loadAccessories,
    toggleVisibility,
    handleDelete
  } = useDataManagement<Accessory>({
    table: 'accessories',
    fetchData: getAccessories,
    deleteItem: deleteAccessory
  });

  return {
    accessories,
    isLoading,
    updatingId,
    loadAccessories,
    toggleVisibility,
    handleDelete
  };
}
```