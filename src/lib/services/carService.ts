import { supabase } from '../../config/supabase';
import type { PrivateCarListing } from '../../types/privateListings';

export async function createCarFromListing(listing: PrivateCarListing) {
  // Calculate savings (10% of price)
  const savings = Math.floor(listing.price * 0.1);

  return await supabase
    .from('cars')
    .insert([{
      brand_id: listing.brand_id,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      price: listing.price,
      image: listing.image,
      video_url: listing.video_url,
      condition: listing.condition,
      mileage: listing.mileage,
      fuel_type: listing.fuel_type,
      transmission: listing.transmission,
      body_type: listing.body_type,
      exterior_color: listing.exterior_color,
      interior_color: listing.interior_color,
      number_of_owners: listing.number_of_owners,
      savings,
      is_sold: false
    }])
    .select();
}