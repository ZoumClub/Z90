-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Add make column back to cars table
alter table cars 
add column if not exists make text generated always as (
  (select name from brands where id = brand_id)
) stored;

-- Create cars_with_brand view
create or replace view cars_with_brand as
select 
  c.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url,
  coalesce(
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
    ),
    '[]'::jsonb
  ) as features
from cars c
join brands b on b.id = c.brand_id;

-- Create private_listings_with_brand view
create or replace view private_listings_with_brand as
select 
  pl.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url,
  coalesce(
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
    ),
    '[]'::jsonb
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

-- Refresh schema cache
notify pgrst, 'reload schema';