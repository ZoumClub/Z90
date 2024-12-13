import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getAdminCars, createCar, updateCar, deleteCar } from '@/lib/api/admin';
import type { Car } from '@/lib/types/car';

export function useAdminCars() {
  const queryClient = useQueryClient();

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['admin', 'cars'],
    queryFn: getAdminCars
  });

  const createMutation = useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cars'] });
      toast.success('Car created successfully');
    },
    onError: (error) => {
      console.error('Error creating car:', error);
      toast.error('Failed to create car');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Car> }) => updateCar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cars'] });
      toast.success('Car updated successfully');
    },
    onError: (error) => {
      console.error('Error updating car:', error);
      toast.error('Failed to update car');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cars'] });
      toast.success('Car deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting car:', error);
      toast.error('Failed to delete car');
    }
  });

  return {
    cars,
    isLoading,
    createCar: createMutation.mutate,
    updateCar: updateMutation.mutate,
    deleteCar: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}