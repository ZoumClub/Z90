import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getAdminAccessories, createAccessory, updateAccessory, deleteAccessory } from '@/lib/api/admin';
import type { Accessory } from '@/lib/types/accessory';

export function useAdminAccessories() {
  const queryClient = useQueryClient();

  const { data: accessories = [], isLoading } = useQuery({
    queryKey: ['admin', 'accessories'],
    queryFn: getAdminAccessories
  });

  const createMutation = useMutation({
    mutationFn: createAccessory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accessories'] });
      toast.success('Accessory created successfully');
    },
    onError: (error) => {
      console.error('Error creating accessory:', error);
      toast.error('Failed to create accessory');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Accessory> }) => updateAccessory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accessories'] });
      toast.success('Accessory updated successfully');
    },
    onError: (error) => {
      console.error('Error updating accessory:', error);
      toast.error('Failed to update accessory');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccessory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accessories'] });
      toast.success('Accessory deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting accessory:', error);
      toast.error('Failed to delete accessory');
    }
  });

  return {
    accessories,
    isLoading,
    createAccessory: createMutation.mutate,
    updateAccessory: updateMutation.mutate,
    deleteAccessory: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}