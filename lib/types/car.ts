import type { Brand } from '@/lib/supabase';
import { FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES, COLORS } from '@/constants/car';

export type FuelType = typeof FUEL_TYPES[number];
export type TransmissionType = typeof TRANSMISSION_TYPES[number];
export type BodyType = typeof BODY_TYPES[number];
export type Color = typeof COLORS[number];

export interface CarFeature {
  name: string;
  available: boolean;
}

export interface Car {
  id: string;
  brand_id: string;
  model: string;
  year: number;
  price: number;
  image: string;
  video_url?: string;
  savings: number;
  condition: 'new' | 'used';
  is_sold: boolean;
  created_at: string;
  updated_at: string;
  mileage: string;
  fuel_type: FuelType;
  transmission: TransmissionType;
  body_type: BodyType;
  exterior_color: Color;
  interior_color: Color;
  number_of_owners: number;
  dealer_id?: string;
  features?: CarFeature[];
  brand_name?: string;
  brand_logo_url?: string;
}