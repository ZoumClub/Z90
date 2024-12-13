import type { Brand } from './brand';

export interface Car {
  id: string;
  brand_id: string;
  brand_name?: string;
  brand_logo_url?: string;
  model: string;
  year: number;
  price: number;
  savings: number;
  image: string;
  video_url?: string;
  condition: 'new' | 'used';
  mileage: string;
  fuel_type: string;
  transmission: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;
  number_of_owners: number;
  is_sold: boolean;
  dealer_id?: string;
  features?: CarFeature[];
  created_at: string;
  updated_at: string;
}

export interface CarFeature {
  id: string;
  name: string;
  available: boolean;
}