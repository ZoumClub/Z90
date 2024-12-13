-- Drop existing views and tables
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;
drop table if exists makes cascade;
drop table if exists car_features cascade;
drop table if exists private_listing_features cascade;
drop table if exists features cascade;
drop table if exists brands cascade;

-- Drop existing triggers
drop trigger if exists set_car_make_id on cars;
drop trigger if exists set_private_listing_make_id on private_listings;
drop trigger if exists set_car_make_logo on cars;
drop trigger if exists set_private_listing_make_logo on private_listings;
drop function if exists set_make_id();
drop function if exists set_make_logo_url();
drop function if exists get_make_id();
drop function if exists get_make_logo_url();

-- Add make column to cars
alter table cars 
drop column if exists brand_id,
drop column if exists make_id,
drop column if exists make_logo_url,
add column if not exists make text not null;

-- Add make column to private_listings 
alter table private_listings
drop column if exists brand_id,
drop column if exists make_id,
drop column if exists make_logo_url,
add column if not exists make text not null;

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

-- Drop features column if it exists
alter table cars drop column if exists features;
alter table private_listings drop column if exists features;

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
      make, model, year, price, image,
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
      v_listing.make, v_listing.model,
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

-- Create indexes for better performance
create index if not exists idx_cars_make on cars(make);
create index if not exists idx_private_listings_make on private_listings(make);

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all privileges on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

-- Refresh schema cache
notify pgrst, 'reload schema';