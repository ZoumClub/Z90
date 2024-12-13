import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getAdminServices, createService, updateService, deleteService } from '@/lib/api/admin';
import type { Service } from '@/lib/types/service';

export function useAdminServices() {
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: getAdminServices
  });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      toast.success('Service created successfully');
    },
    onError: (error) => {
      console.error('Error creating service:', error);
      toast.error('Failed to create service');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      toast.success('Service updated successfully');
    },
    onError: (error) => {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      toast.success('Service deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  });

  return {
    services,
    isLoading,
    createService: createMutation.mutate,
    updateService: updateMutation.mutate,
    deleteService: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}