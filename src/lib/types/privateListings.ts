export interface DealerBid {
  id: string;
  amount: number;
  dealer: {
    id: string;
    name: string;
    phone: string;
    whatsapp: string;
  };
}

export interface PrivateListing {
  id?: string;
  brand_id: string;
  brand_name?: string;
  brand_logo_url?: string;
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
  features?: Array<{
    name: string;
    available: boolean;
  }>;
  bids?: DealerBid[];
}