-- Drop existing views and feature-related tables
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;
drop table if exists car_features cascade;
drop table if exists private_listing_features cascade;
drop table if exists features cascade;

-- Modify cars table to include features
alter table cars
add column features jsonb default '[]'::jsonb;

-- Modify private_listings table to include features
alter table private_listings
add column features jsonb default '[]'::jsonb;

-- Create index for better performance on JSONB columns
create index idx_cars_features on cars using gin(features);
create index idx_private_listings_features on private_listings using gin(features);

-- Create function to validate features format
create or replace function validate_features(features jsonb)
returns boolean as $$
begin
  -- Check if features is an array
  if jsonb_typeof(features) != 'array' then
    return false;
  end if;

  -- Check if each feature has required fields
  return not exists (
    select 1
    from jsonb_array_elements(features) as feature
    where not (
      feature ? 'name' and
      feature ? 'available' and
      (feature->>'name') is not null and
      (feature->>'available')::boolean is not null
    )
  );
end;
$$ language plpgsql immutable;

-- Add check constraints
alter table cars
add constraint check_car_features_format
check (features is null or validate_features(features));

alter table private_listings
add constraint check_private_listing_features_format
check (features is null or validate_features(features));

-- Create cars_with_brand view
create view cars_with_brand as
select 
  c.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url
from cars c
join brands b on b.id = c.brand_id;

-- Create private_listings_with_brand view
create view private_listings_with_brand as
select 
  pl.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url
from private_listings pl
join brands b on b.id = pl.brand_id;

-- Create function to process private listing
create or replace function process_private_listing(
  p_listing_id uuid,
  p_status text
) returns jsonb as $$
declare
  v_listing private_listings;
  v_car_id uuid;
  v_result jsonb;
begin
  -- Validate status
  if p_status not in ('approved', 'rejected') then
    return jsonb_build_object(
      'success', false,
      'message', 'Invalid status. Must be either approved or rejected.'
    );
  end if;

  -- Get and lock the listing
  select * into v_listing
  from private_listings
  where id = p_listing_id
  for update;

  if not found then
    return jsonb_build_object(
      'success', false,
      'message', 'Listing not found'
    );
  end if;

  if v_listing.status != 'pending' then
    return jsonb_build_object(
      'success', false,
      'message', 'Listing has already been processed'
    );
  end if;

  -- Update listing status
  update private_listings
  set 
    status = p_status,
    updated_at = now()
  where id = p_listing_id;

  -- If approved, create car listing
  if p_status = 'approved' then
    insert into cars (
      brand_id, model, year, price, image,
      video_url, condition, mileage, fuel_type,
      transmission, body_type, exterior_color,
      interior_color, number_of_owners, savings,
      is_sold, features
    )
    values (
      v_listing.brand_id, v_listing.model,
      v_listing.year, v_listing.price, v_listing.image,
      v_listing.video_url, v_listing.condition, v_listing.mileage,
      v_listing.fuel_type, v_listing.transmission, v_listing.body_type,
      v_listing.exterior_color, v_listing.interior_color,
      v_listing.number_of_owners, floor(v_listing.price * 0.1),
      false, v_listing.features
    )
    returning id into v_car_id;
  end if;

  -- Prepare result
  return jsonb_build_object(
    'success', true,
    'listing_id', p_listing_id,
    'car_id', v_car_id,
    'status', p_status
  );
exception
  when others then
    return jsonb_build_object(
      'success', false,
      'message', SQLERRM
    );
end;
$$ language plpgsql security definer;

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all privileges on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

-- Grant access to views
grant select on cars_with_brand to anon, authenticated;
grant select on private_listings_with_brand to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';