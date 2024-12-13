-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

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
          'name', cf.name,
          'available', cf.available
        )
        order by cf.name
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
          'name', plf.name,
          'available', plf.available
        )
        order by plf.name
      )
      from private_listing_features plf
      where plf.listing_id = pl.id
    ),
    '[]'::jsonb
  ) as features
from private_listings pl
join brands b on b.id = pl.brand_id;

-- Create indexes for better performance
create index if not exists idx_cars_brand_id on cars(brand_id);
create index if not exists idx_cars_condition on cars(condition);
create index if not exists idx_cars_is_sold on cars(is_sold);
create index if not exists idx_cars_dealer_id on cars(dealer_id);
create index if not exists idx_car_features_car_id on car_features(car_id);
create index if not exists idx_private_listings_brand_id on private_listings(brand_id);
create index if not exists idx_private_listings_status on private_listings(status);
create index if not exists idx_private_listing_features_listing_id on private_listing_features(listing_id);

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