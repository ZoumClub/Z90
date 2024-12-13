-- Drop existing foreign key constraints
alter table cars drop constraint if exists cars_brand_id_fkey;
alter table cars drop constraint if exists cars_make_fkey;
alter table private_listings drop constraint if exists private_listings_brand_id_fkey;
alter table private_listings drop constraint if exists private_listings_make_fkey;

-- Drop redundant make columns
alter table cars drop column if exists make;
alter table private_listings drop column if exists make;

-- Add proper foreign key constraints
alter table cars
  add constraint cars_brand_id_fkey 
  foreign key (brand_id) 
  references brands(id) 
  on delete restrict;

alter table private_listings
  add constraint private_listings_brand_id_fkey 
  foreign key (brand_id) 
  references brands(id) 
  on delete restrict;

-- Create function to get brand details
create or replace function get_brand_details(brand_id uuid)
returns jsonb as $$
  select jsonb_build_object(
    'id', id,
    'name', name,
    'logo_url', logo_url
  )
  from brands
  where id = brand_id;
$$ language sql stable;

-- Create function to get car with brand details
create or replace function get_car_with_brand(car_id uuid)
returns jsonb as $$
  select jsonb_build_object(
    'id', c.id,
    'brand', get_brand_details(c.brand_id),
    'model', c.model,
    'year', c.year,
    'price', c.price,
    'image', c.image,
    'video_url', c.video_url,
    'condition', c.condition,
    'mileage', c.mileage,
    'fuel_type', c.fuel_type,
    'transmission', c.transmission,
    'body_type', c.body_type,
    'exterior_color', c.exterior_color,
    'interior_color', c.interior_color,
    'number_of_owners', c.number_of_owners,
    'savings', c.savings,
    'is_sold', c.is_sold
  )
  from cars c
  where c.id = car_id;
$$ language sql stable;

-- Create function to get private listing with brand details
create or replace function get_private_listing_with_brand(listing_id uuid)
returns jsonb as $$
  select jsonb_build_object(
    'id', pl.id,
    'brand', get_brand_details(pl.brand_id),
    'model', pl.model,
    'year', pl.year,
    'price', pl.price,
    'image', pl.image,
    'video_url', pl.video_url,
    'condition', pl.condition,
    'mileage', pl.mileage,
    'fuel_type', pl.fuel_type,
    'transmission', pl.transmission,
    'body_type', pl.body_type,
    'exterior_color', pl.exterior_color,
    'interior_color', pl.interior_color,
    'number_of_owners', pl.number_of_owners,
    'client_name', pl.client_name,
    'client_phone', pl.client_phone,
    'client_city', pl.client_city,
    'status', pl.status
  )
  from private_listings pl
  where pl.id = listing_id;
$$ language sql stable;

-- Create indexes for better performance
create index if not exists idx_cars_brand_id on cars(brand_id);
create index if not exists idx_private_listings_brand_id on private_listings(brand_id);

-- Grant execute permissions
grant execute on function get_brand_details(uuid) to authenticated;
grant execute on function get_car_with_brand(uuid) to authenticated;
grant execute on function get_private_listing_with_brand(uuid) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';