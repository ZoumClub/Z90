-- Drop existing function
drop function if exists process_private_listing(uuid, text);

-- Create improved RPC function with better error handling
create or replace function process_private_listing(
  p_listing_id uuid,
  p_status text
) returns jsonb language plpgsql security definer as $$
declare
  v_listing private_listings;
  v_car_id uuid;
  v_result jsonb;
begin
  -- Input validation
  if p_listing_id is null then
    raise exception 'Listing ID is required';
  end if;

  if p_status is null or p_status not in ('approved', 'rejected') then
    raise exception 'Status must be either approved or rejected';
  end if;

  -- Get and lock the listing
  select * into strict v_listing
  from private_listings
  where id = p_listing_id
  for update;

  -- Verify listing status
  if v_listing.status != 'pending' then
    raise exception 'Listing is not in pending status';
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
      brand_id, make, model, year, price, image,
      video_url, condition, mileage, fuel_type,
      transmission, body_type, exterior_color,
      interior_color, number_of_owners, savings,
      is_sold
    )
    values (
      v_listing.brand_id, v_listing.make, v_listing.model,
      v_listing.year, v_listing.price, v_listing.image,
      v_listing.video_url, v_listing.condition, v_listing.mileage,
      v_listing.fuel_type, v_listing.transmission, v_listing.body_type,
      v_listing.exterior_color, v_listing.interior_color,
      v_listing.number_of_owners, floor(v_listing.price * 0.1),
      false
    )
    returning id into v_car_id;
  end if;

  -- Build result
  v_result := jsonb_build_object(
    'success', true,
    'listing_id', p_listing_id,
    'status', p_status,
    'car_id', v_car_id
  );

  return v_result;
exception
  when no_data_found then
    raise exception 'Listing not found';
  when others then
    raise;
end;
$$;

-- Revoke all existing permissions
revoke all on function process_private_listing(uuid, text) from public;
revoke all on function process_private_listing(uuid, text) from anon;
revoke all on function process_private_listing(uuid, text) from authenticated;

-- Grant execute permission to authenticated users
grant execute on function process_private_listing(uuid, text) to authenticated;

-- Ensure proper RLS policies
drop policy if exists "Authenticated users can update private listings" on private_listings;

create policy "Authenticated users can update private listings"
  on private_listings for update
  using (auth.role() = 'authenticated')
  with check (
    status in ('approved', 'rejected') and
    exists (
      select 1 from private_listings
      where id = private_listings.id
      and status = 'pending'
    )
  );