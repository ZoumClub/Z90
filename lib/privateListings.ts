import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import type { PrivateCarListing } from '@/lib/types/privateListings';
import { toast } from 'react-hot-toast';

// Simpler phone regex that accepts exactly 4 digits
const phoneRegex = /^\d{4}$/;

const privateListingSchema = z.object({
  brand_id: z.string().uuid('Invalid brand selected'),
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
  number_of_owners: z.number().min(1, 'Number of owners must be at least 1'),
  client_name: z.string().min(2, 'Name must be at least 2 characters'),
  client_phone: z.string().regex(phoneRegex, 'Please enter exactly 4 digits'),
  client_city: z.string().min(2, 'City must be at least 2 characters')
});

export async function submitCarForSale(listing: Omit<PrivateCarListing, 'id' | 'created_at' | 'status'>) {
  try {
    // Validate the listing data
    const validatedData = privateListingSchema.parse({
      ...listing,
      video_url: listing.video_url || null
    });

    // First create the listing
    const { data: newListing, error: listingError } = await supabase
      .from('private_listings')
      .insert([{
        ...validatedData,
        status: 'pending'
      }])
      .select()
      .single();

    if (listingError) {
      console.error('Database error:', listingError);
      
      if (listingError.code === '23503') {
        throw new Error('Invalid brand selected');
      }
      if (listingError.code === '23514') {
        throw new Error('Please check all required fields');
      }
      if (listingError.code === '23505') {
        throw new Error('This listing already exists');
      }
      
      throw new Error('Failed to submit listing. Please try again.');
    }

    // Then add features if any are provided
    if (listing.features && listing.features.length > 0) {
      // Get feature IDs
      const { data: features } = await supabase
        .from('features')
        .select('id, name')
        .in('name', listing.features.map(f => f.name));

      if (features && features.length > 0) {
        const { error: featuresError } = await supabase
          .from('private_listing_features')
          .insert(
            features.map(feature => ({
              listing_id: newListing.id,
              feature_id: feature.id,
              available: listing.features?.find(f => f.name === feature.name)?.available ?? true
            }))
          );

        if (featuresError) throw featuresError;
      }
    }

    toast.success('Car listing submitted successfully!');
    return newListing;
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
    .from('private_listings_with_brand')
    .select('*')
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
      .maybeSingle();

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