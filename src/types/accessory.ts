export type AccessoryCategory = 
  | 'Interior'
  | 'Exterior'
  | 'Electronics'
  | 'Performance'
  | 'Safety'
  | 'Comfort'
  | 'Maintenance'
  | 'Other';

export interface Accessory {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: AccessoryCategory;
  in_stock: boolean;
  visible: boolean;
  created_at: string;
  updated_at: string;
}