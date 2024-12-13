import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getAdminMakes, createMake, updateMake, deleteMake } from '@/lib/api/admin';
import type { Make } from '@/lib/types/make';

export function useAdminMakes() {
  const queryClient = useQueryClient();

  const { data: makes = [], isLoading } = useQuery({
    queryKey: ['admin', 'makes'],
    queryFn: getAdminMakes
  });

  const createMutation = useMutation({
    mutationFn: createMake,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'makes'] });
      toast.success('Make created successfully');
    },
    onError: (error) => {
      console.error('Error creating make:', error);
      toast.error('Failed to create make');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Make> }) => updateMake(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'makes'] });
      toast.success('Make updated successfully');
    },
    onError: (error) => {
      console.error('Error updating make:', error);
      toast.error('Failed to update make');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMake,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'makes'] });
      toast.success('Make deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting make:', error);
      toast.error('Failed to delete make');
    }
  });

  return {
    makes,
    isLoading,
    createMake: createMutation.mutate,
    updateMake: updateMutation.mutate,
    deleteMake: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}