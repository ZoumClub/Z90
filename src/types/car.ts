import type { Brand } from '@/lib/supabase';
import { FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES, COLORS } from '@/constants/car';

export type FuelType = typeof FUEL_TYPES[number];
export type TransmissionType = typeof TRANSMISSION_TYPES[number];
export type BodyType = typeof BODY_TYPES[number];
export type Color = typeof COLORS[number];

export interface CarFeature {
  id: string;
  car_id: string;
  name: string;
  available: boolean;
  created_at: string;
}

export interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Car {
  id: string;
  brand_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  images?: CarImage[];
  video_url?: string;
  savings: number;
  condition: 'new' | 'used';
  is_sold: boolean;
  created_at: string;
  updated_at: string;
  mileage?: string;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  autonomy?: string;
  seats?: number;
  body_type?: BodyType;
  exterior_color?: Color;
  interior_color?: Color;
  number_of_owners?: number;
  number_of_keys?: string;
  features?: CarFeature[];
  brand?: Brand;
}