```typescript
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { updateVisibility } from '@/lib/api/visibility';

interface UseVisibilityToggleProps {
  table: 'accessories' | 'main_services';
  onSuccess: () => Promise<void>;
}

export function useVisibilityToggle({ table, onSuccess }: UseVisibilityToggleProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleVisibility = useCallback(async (id: string, currentVisible: boolean) => {
    try {
      setUpdatingId(id);
      await updateVisibility(table, id, !currentVisible);
      await onSuccess();
      toast.success(
        currentVisible 
          ? 'Item hidden from main page' 
          : 'Item now visible on main page'
      );
    } catch (error) {
      toast.error('Failed to update visibility');
    } finally {
      setUpdatingId(null);
    }
  }, [table, onSuccess]);

  return {
    updatingId,
    toggleVisibility
  };
}
```