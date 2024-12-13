-- Drop existing views
drop view if exists cars_view cascade;
drop view if exists private_listings_view cascade;
drop view if exists brands_view cascade;

-- Create cars_with_brand view
create view cars_with_brand as
select 
  c.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url,
  (
    select jsonb_agg(
      jsonb_build_object(
        'id', cf.id,
        'name', cf.name,
        'available', cf.available
      )
    )
    from car_features cf
    where cf.car_id = c.id
  ) as features
from cars c
join brands b on b.id = c.brand_id;

-- Create private_listings_with_brand view
create view private_listings_with_brand as
select 
  pl.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url,
  (
    select jsonb_agg(
      jsonb_build_object(
        'id', plf.id,
        'name', plf.name,
        'available', plf.available
      )
    )
    from private_listing_features plf
    where plf.listing_id = pl.id
  ) as features
from private_listings pl
join brands b on b.id = pl.brand_id;

-- Enable RLS on views
alter view cars_with_brand owner to authenticated;
alter view private_listings_with_brand owner to authenticated;

-- Create RLS policies for views
create policy "Anyone can view cars"
  on cars_with_brand
  for select
  using (true);

create policy "Anyone can view private listings"
  on private_listings_with_brand
  for select
  using (true);

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
    raise exception 'Invalid status. Must be either approved or rejected.';
  end if;

  -- Get and lock the listing
  select * into v_listing
  from private_listings
  where id = p_listing_id
  for update;

  if not found then
    raise exception 'Listing not found';
  end if;

  if v_listing.status != 'pending' then
    raise exception 'Listing has already been processed';
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
      is_sold
    )
    values (
      v_listing.brand_id, v_listing.model,
      v_listing.year, v_listing.price, v_listing.image,
      v_listing.video_url, v_listing.condition, v_listing.mileage,
      v_listing.fuel_type, v_listing.transmission, v_listing.body_type,
      v_listing.exterior_color, v_listing.interior_color,
      v_listing.number_of_owners, floor(v_listing.price * 0.1),
      false
    )
    returning id into v_car_id;

    -- Copy features to car
    insert into car_features (car_id, name, available)
    select v_car_id, plf.name, plf.available
    from private_listing_features plf
    where plf.listing_id = p_listing_id;
  end if;

  -- Prepare result
  v_result := jsonb_build_object(
    'success', true,
    'listing_id', p_listing_id,
    'car_id', v_car_id,
    'status', p_status
  );

  return v_result;
exception
  when others then
    raise exception '%', sqlerrm;
end;
$$ language plpgsql security definer;

-- Grant necessary permissions
grant select on cars_with_brand to anon, authenticated;
grant select on private_listings_with_brand to anon, authenticated;
grant execute on function process_private_listing(uuid, text) to authenticated;

-- Create indexes for better performance
create index if not exists idx_cars_brand_id on cars(brand_id);
create index if not exists idx_private_listings_brand_id on private_listings(brand_id);
create index if not exists idx_car_features_car_id on car_features(car_id);
create index if not exists idx_private_listing_features_listing_id on private_listing_features(listing_id);

-- Refresh schema cache
notify pgrst, 'reload schema';