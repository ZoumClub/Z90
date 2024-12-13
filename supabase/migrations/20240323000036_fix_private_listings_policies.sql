-- Drop existing policies
drop policy if exists "Allow read access to private listings" on private_listings;
drop policy if exists "Allow insert for everyone" on private_listings;
drop policy if exists "Allow admin updates" on private_listings;

-- Create improved policies
create policy "Anyone can read private listings"
  on private_listings for select
  using (true);

create policy "Anyone can insert private listings"
  on private_listings for insert
  with check (
    status = 'pending'
  );

create policy "Authenticated users can update private listings"
  on private_listings for update
  using (true)
  with check (true);

-- Create RPC function for transaction handling
create or replace function process_private_listing(
  p_listing_id uuid,
  p_status text
) returns json as $$
declare
  v_listing private_listings;
  v_car_id uuid;
begin
  -- Get and lock the listing
  select * into v_listing
  from private_listings
  where id = p_listing_id and status = 'pending'
  for update;

  if not found then
    raise exception 'Listing not found or already processed';
  end if;

  -- Update listing status
  update private_listings
  set status = p_status
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

  return json_build_object(
    'success', true,
    'listing_id', p_listing_id,
    'car_id', v_car_id
  );
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function process_private_listing(uuid, text) to authenticated;