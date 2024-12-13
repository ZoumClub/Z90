```typescript
import { supabase } from '@/lib/supabase';

export async function updateVisibility(
  table: 'accessories' | 'main_services',
  id: string, 
  visible: boolean
): Promise<void> {
  const { error } = await supabase
    .from(table)
    .update({ visible })
    .eq('id', id);

  if (error) {
    console.error(`Error updating ${table} visibility:`, error);
    throw error;
  }
}
```