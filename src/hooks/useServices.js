import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getServices, updateServiceVisibility, deleteService } from '@/lib/api/services';

export function useServices() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const toggleVisibility = async (service) => {
    try {
      setUpdatingId(service.id);
      await updateServiceVisibility(service.id, !service.visible);
      await loadServices();
      toast.success(service.visible ? 'Service hidden' : 'Service now visible');
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      await loadServices();
      toast.success('Service deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  return {
    services,
    isLoading,
    updatingId,
    loadServices,
    toggleVisibility,
    handleDelete
  };
}