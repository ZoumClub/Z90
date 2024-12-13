-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Rename foreign key columns
alter table cars 
  drop constraint if exists cars_brand_id_fkey,
  rename column brand_id to make_id;

alter table private_listings
  drop constraint if exists private_listings_brand_id_fkey,
  rename column brand_id to make_id;

-- Add foreign key constraints
alter table cars
  add constraint cars_make_id_fkey 
  foreign key (make_id) 
  references makes(id) 
  on delete restrict;

alter table private_listings
  add constraint private_listings_make_id_fkey 
  foreign key (make_id) 
  references makes(id) 
  on delete restrict;

-- Create cars_with_make view
create view cars_with_make as
select 
  c.*,
  m.name as make_name,
  m.logo_url as make_logo_url,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'name', cf.name,
          'available', cf.available
        )
        order by cf.name
      )
      filter (where cf.name is not null)
      from car_features cf
      where cf.car_id = c.id
    ),
    '[]'::jsonb
  ) as features
from cars c
join makes m on m.id = c.make_id;

-- Create private_listings_with_make view
create view private_listings_with_make as
select 
  pl.*,
  m.name as make_name,
  m.logo_url as make_logo_url,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'name', plf.name,
          'available', plf.available
        )
        order by plf.name
      )
      filter (where plf.name is not null)
      from private_listing_features plf
      where plf.listing_id = pl.id
    ),
    '[]'::jsonb
  ) as features
from private_listings pl
join makes m on m.id = pl.make_id;

-- Grant permissions
grant select on cars_with_make to anon, authenticated;
grant select on private_listings_with_make to anon, authenticated;

-- Create indexes
create index if not exists idx_cars_make_id on cars(make_id);
create index if not exists idx_private_listings_make_id on private_listings(make_id);

-- Refresh schema cache
notify pgrst, 'reload schema';