-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Drop brands table and add make column
drop table if exists brands cascade;

-- Add make column to cars
alter table cars add column if not exists make text not null;

-- Add make column to private_listings
alter table private_listings add column if not exists make text not null;

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
  if p_status = 'a