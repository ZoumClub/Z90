import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
};

export type Brand = {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
};

export type Car = {
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
  fuel_type?: string;
  transmission?: string;
  autonomy?: string;
  seats?: number;
  body_type?: string;
  exterior_color?: string;
  interior_color?: string;
  number_of_owners?: number;
  number_of_keys?: string;
  features?: CarFeature[];
  brand?: Brand;
};

export type CarImage = {
  id: string;
  car_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
};

export type CarFeature = {
  id: string;
  car_id: string;
  name: string;
  available: boolean;
  created_at: string;
};

export type PrivateListing = {
  id?: string;
  brand_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  video_url?: string;
  condition: 'used';
  mileage: string;
  fuel_type: string;
  transmission: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;
  number_of_owners: number;
  client_name: string;
  client_phone: string;
  client_city: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  brand?: Brand;
};