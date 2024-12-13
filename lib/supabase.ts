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

export type Dealer = {
  id: string;
  name: string;
  shop_image: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  id_number: string;
  created_at: string;
};

export type DealerBid = {
  id: string;
  dealer_id: string;
  listing_id: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  notes?: string;
  created_at: string;
  dealer?: Dealer;
};

export type PrivateListing = {
  id: string;
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
  created_at: string;
  brand?: Brand;
  bids?: DealerBid[];
};

// ... rest of the types remain the same