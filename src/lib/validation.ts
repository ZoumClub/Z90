import { z } from 'zod';
import { 
  FUEL_TYPES, 
  TRANSMISSION_TYPES, 
  BODY_TYPES, 
  COLORS, 
  MILEAGE_RANGES 
} from '@/constants/car';

// Simplified phone regex that accepts 4 digits
const phoneRegex = /^\d{4}$/;

export const phoneNumberSchema = z.string()
  .regex(phoneRegex, 'Please enter exactly 4 digits');

export const featureSchema = z.object({
  name: z.string(),
  available: z.boolean().default(true)
});

export const privateListingSchema = z.object({
  brand_id: z.string().uuid('Invalid brand selected'),
  model: z.string().min(1, 'Model is required'),
  year: z.number()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  price: z.number().positive('Price must be greater than 0'),
  image: z.string().url('Please upload at least one image'),
  video_url: z.string().url().optional().nullable(),
  condition: z.literal('used'),
  mileage: z.enum(MILEAGE_RANGES),
  fuel_type: z.enum(FUEL_TYPES),
  transmission: z.enum(TRANSMISSION_TYPES),
  body_type: z.enum(BODY_TYPES),
  exterior_color: z.enum(COLORS),
  interior_color: z.enum(COLORS),
  number_of_owners: z.number().min(1, 'Number of owners must be at least 1'),
  client_name: z.string().min(2, 'Name must be at least 2 characters'),
  client_phone: phoneNumberSchema,
  client_city: z.string().min(2, 'City must be at least 2 characters'),
  features: z.array(featureSchema).optional()
});

export type PrivateListingFormData = z.infer<typeof privateListingSchema>;
export type Feature = z.infer<typeof featureSchema>;