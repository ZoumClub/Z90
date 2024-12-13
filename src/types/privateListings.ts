export interface PrivateCarListing {
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
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}