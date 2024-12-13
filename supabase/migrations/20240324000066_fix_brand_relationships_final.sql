-- Drop existing views and constraints
drop view if exists car_details cascade;
drop trigger if exists maintain_car_brand_consistency on cars cascade;
drop trigger if exists maintain_private_listing_brand_consistency on private_listings cascade;
drop function if exists maintain_brand_consistency() cascade;

-- Create brands_view for consistent brand information
create or replace view brands_view as
select 
  id,
  name as brand_name,
  logo_url as brand_logo_url
from brands;

-- Create cars_view with brand information
create or replace view cars_view as
select 
  c.*,
  b.brand_name,
  b.brand_logo_url,
  array_agg(distinct jsonb_build_object(
    'id', cf.id,
    'name', cf.name,
    'available', cf.available
  )) filter (where cf.id is not null) as features
from cars c
left join brands_view b on b.id = c.brand_id
left join car_features cf on cf.car_id = c.id
group by c.id, b.brand_name, b.brand_logo_url;

-- Create private_listings_view with brand information
create or replace view private_listings_view as
select 
  pl.*,
  b.brand_name,
  b.brand_logo_url,
  array_agg(distinct jsonb_build_object(
    'id', plf.id,
    'name', plf.name,
    'available', plf.available
  )) filter (where plf.id is not null) as features
from private_listings pl
left join brands_view b on b.id = pl.brand_id
left join private_listing_features plf on plf.listing_id = pl.id
group by pl.id, b.brand_name, b.brand_logo_url;

-- Add proper foreign key constraints
alter table cars
  drop constraint if exists cars_brand_id_fkey,
  add constraint cars_brand_id_fkey 
  foreign key (brand_id) 
  references brands(id) 
  on delete restrict;

alter table private_listings
  drop constraint if exists private_listings_brand_id_fkey,
  add constraint private_listings_brand_id_fkey 
  foreign key (brand_id) 
  references brands(id) 
  on delete restrict;

-- Create RLS policies for views
create policy "Brands view is accessible by everyone"
  on brands_view for select
  using (true);

create policy "Cars view is accessible by everyone"
  on cars_view for select
  using (true);

create policy "Private listings view is accessible by everyone"
  on private_listings_view for select
  using (true);

-- Create indexes for better performance
create index if not exists idx_cars_brand_id on cars(brand_id);
create index if not exists idx_private_listings_brand_id on private_listings(brand_id);

-- Refresh schema cache
notify pgrst, 'reload schema';