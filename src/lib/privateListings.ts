import { supabase } from '../config/supabase';
import { z } from 'zod';
import type { PrivateCarListing } from '../types/privateListings';
import toast from 'react-hot-toast';

// Simpler phone regex that accepts common formats
const phoneRegex = /^\+?[\d\s-()]{10,}$/;

const privateListingSchema = z.object({
  brand_id: z.string().uuid('Invalid brand selected'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  price: z.number().positive('Price must be greater than 0'),
  image: z.string().url('Please upload at least one image'),
  video_url: z.string().url('Invalid video URL').optional().nullable(),
  condition: z.literal('used'),
  mileage: z.string().min(1, 'Mileage is required'),
  fuel_type: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  body_type: z.string().min(1, 'Body type is required'),
  exterior_color: z.string().min(1, 'Exterior color is required'),
  interior_color: z.string().min(1, 'Interior color is required'),
  number_of_owners: z.number().positive('Number of owners must be greater than 0'),
  client_name: z.string().min(2, 'Name must be at least 2 characters'),
  client_phone: z.string().regex(phoneRegex, 'Invalid phone number format. Please include country code.'),
  client_city: z.string().min(2, 'City must be at least 2 characters')
});

export async function submitCarForSale(listing: Omit<PrivateCarListing, 'id' | 'created_at' | 'status'>) {
  try {
    // Validate the listing data
    const validatedData = privateListingSchema.parse({
      ...listing,
      video_url: listing.video_url || null
    });

    // Format phone number to remove extra spaces and ensure consistent format
    const formattedPhone = validatedData.client_phone.replace(/\s+/g, ' ').trim();

    // Insert the listing
    const { data, error } = await supabase
      .from('private_listings')
      .insert([{
        ...validatedData,
        client_phone: formattedPhone,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      if (error.code === '23503') {
        throw new Error('Invalid brand selected');
      }
      if (error.code === '23514') {
        throw new Error('Please check all required fields');
      }
      if (error.code === '23505') {
        throw new Error('This listing already exists');
      }
      
      throw new Error('Failed to submit listing. Please try again.');
    }

    toast.success('Car listing submitted successfully!');
    return data;
  } catch (error) {
    console.error('Submission error:', error);
    
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(firstError.message);
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to submit car listing. Please try again.');
  }
}

export async function getPrivateListings() {
  const { data, error } = await supabase
    .from('private_listings')
    .select(`
      *,
      brand:brands (
        id,
        name,
        logo_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    throw new Error('Failed to fetch listings');
  }

  return data;
}

export async function updateListingStatus(id: string, status: 'approved' | 'rejected') {
  try {
    const { data, error } = await supabase
      .from('private_listings')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle(); // Use maybeSingle() instead of single() to handle no rows gracefully

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Listing not found');
    }

    toast.success(`Listing ${status} successfully`);
    return data;
  } catch (error) {
    console.error('Error updating status:', error);
    toast.error('Failed to update listing status');
    throw error;
  }
}