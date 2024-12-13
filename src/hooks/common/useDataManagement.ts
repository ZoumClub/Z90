```typescript
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useVisibilityToggle } from './useVisibilityToggle';

interface UseDataManagementProps<T> {
  table: 'accessories' | 'main_services';
  fetchData: () => Promise<T[]>;
  deleteItem: (id: string) => Promise<void>;
}

export function useDataManagement<T extends { id: string; visible: boolean }>({ 
  table,
  fetchData,
  deleteItem
}: UseDataManagementProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchData();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  const { updatingId, toggleVisibility } = useVisibilityToggle({
    table,
    onSuccess: loadData
  });

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteItem(id);
      await loadData();
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  }, [deleteItem, loadData]);

  return {
    items,
    isLoading,
    updatingId,
    loadData,
    toggleVisibility: (item: T) => toggleVisibility(item.id, item.visible),
    handleDelete
  };
}
```