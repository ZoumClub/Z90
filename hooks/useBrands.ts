import { useQuery } from '@tanstack/react-query';
import { getCars, getCarsByBrand, getNewCars, getUsedCars } from '../lib/database';
import type { Car } from '../config/supabase';

export function useCars(brandName?: string) {
  return useQuery({
    queryKey: ['cars', brandName],
    queryFn: () => brandName ? getCarsByBrand(brandName) : getCars(),
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}

export function useNewCars() {
  return useQuery({
    queryKey: ['newCars'],
    queryFn: getNewCars,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}

export function useUsedCars() {
  return useQuery({
    queryKey: ['usedCars'],
    queryFn: getUsedCars,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}