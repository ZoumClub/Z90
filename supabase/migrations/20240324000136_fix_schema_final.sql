-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Add feature columns to cars
alter table cars add column if not exists speed_regulator boolean default false;
alter table cars add column if not exists air_condition boolean default false;
alter table cars add column if not exists reversing_camera boolean default false;
alter table cars add column if not exists reversing_radar boolean default false;
alter table cars add column if not exists gps_navigation boolean default false;
alter table cars add column if not exists park_assist boolean default false;
alter table cars add column if not exists start_stop boolean default false;
alter table cars add column if not exists airbag boolean default false;
alter table cars add column if not exists abs boolean default false;
alter table cars add column if not exists computer boolean default false;
alter table cars add column if not exists rims boolean default false;
alter table cars add column if not exists electric_mirrors boolean default false;
alter table cars add column if not exists electric_windows boolean default false;
alter table cars add column if not exists bluetooth boolean default false;

-- Add feature columns to private_listings
alter table private_listings add column if not exists speed_regulator boolean default false;
alter table private_listings add column if not exists air_condition boolean default false;
alter table private_listings add column if not exists reversing_camera boolean default false;
alter table private_listings add column if not exists reversing_radar boolean default false;
alter table private_listings add column if not exists gps_navigation boolean default false;
alter table private_listings add column if not exists park_assist boolean default false;
alter table private_listings add column if not exists start_stop boolean default false;
alter table private_listings add column if not exists airbag boolean default false;
alter table private_listings add column if not exists abs boolean default false;
alter table private_listings add column if not exists computer boolean default false;
alter table private_listings add column if not exists rims boolean default false;
alter table private_listings add column if not exists electric_mirrors boolean default false;
alter table private_listings add column if not exists electric_windows boolean default false;
alter table private_listings add column if not exists bluetooth boolean default false;

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

-- Update process_private_listing function
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
      is_sold,
      -- Copy all feature flags
      speed_regulator, air_condition, reversing_camera,
      reversing_radar, gps_navigation, park_assist,
      start_stop, airbag, abs, computer, rims,
      electric_mirrors, electric_windows, bluetooth
    )
    values (
      v_listing.brand_id, v_listing.model,
      v_listing.year, v_listing.price, v_listing.image,
      v_listing.video_url, v_listing.condition, v_listing.mileage,
      v_listing.fuel_type, v_listing.transmission, v_listing.body_type,
      v_listing.exterior_color, v_listing.interior_color,
      v_listing.number_of_owners, floor(v_listing.price * 0.1),
      false,
      -- Copy all feature values
      v_listing.speed_regulator, v_listing.air_condition,
      v_listing.reversing_camera, v_listing.reversing_radar,
      v_listing.gps_navigation, v_listing.park_assist,
      v_listing.start_stop, v_listing.airbag, v_listing.abs,
      v_listing.computer, v_listing.rims, v_listing.electric_mirrors,
      v_listing.electric_windows, v_listing.bluetooth
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