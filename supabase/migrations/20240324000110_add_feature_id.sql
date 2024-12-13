-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Add feature_id column to private_listing_features
alter table private_listing_features
add column feature_id uuid references features(id);

-- Create index for feature_id
create index idx_private_listing_features_feature_id on private_listing_features(feature_id);

-- Create cars_with_brand view
create view cars_with_brand as
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
        order by cf.name
      )
      filter (where cf.id is not null)
      from car_features cf
      where cf.car_id = c.id
    ),
    '[]'::jsonb
  ) as features
from cars c
join brands b on b.id = c.brand_id;

-- Create private_listings_with_brand view
create view private_listings_with_brand as
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
          'feature_id', plf.feature_id,
          'available', plf.available
        )
        order by plf.name
      )
      filter (where plf.id is not null)
      from private_listing_features plf
      where plf.listing_id = pl.id
    ),
    '[]'::jsonb
  ) as features
from private_listings pl
join brands b on b.id = pl.brand_id;

-- Grant permissions
grant select on cars_with_brand to anon, authenticated;
grant select on private_listings_with_brand to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';