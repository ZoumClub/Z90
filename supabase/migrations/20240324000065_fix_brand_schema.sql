-- Drop existing foreign key constraints
alter table cars drop constraint if exists cars_brand_id_fkey;
alter table private_listings drop constraint if exists private_listings_brand_id_fkey;

-- Create a view to handle brand name lookups
create or replace view car_details as
select 
  c.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url
from cars c
join brands b on b.id = c.brand_id;

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

-- Create RLS policies for the view
create policy "Car details are viewable by everyone"
  on car_details for select
  using (true);

-- Refresh schema cache
notify pgrst, 'reload schema';