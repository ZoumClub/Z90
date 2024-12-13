export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ServiceCategory;
  duration: string;
  available: boolean;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export type ServiceCategory = 
  | 'Maintenance'
  | 'Repair'
  | 'Inspection'
  | 'Customization'
  | 'Cleaning'
  | 'Insurance'
  | 'Warranty'
  | 'Other';