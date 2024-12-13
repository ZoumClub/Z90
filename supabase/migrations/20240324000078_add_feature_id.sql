-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Create features table if it doesn't exist
create table if not exists features (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default features
insert into features (name) values
  ('Speed Regulator'),
  ('Air Condition'),
  ('Reversing Camera'),
  ('Reversing Radar'),
  ('GPS Navigation'),
  ('Park Assist'),
  ('Start and Stop'),
  ('Airbag'),
  ('ABS'),
  ('Computer'),
  ('Rims'),
  ('Electric mirrors'),
  ('Electric windows'),
  ('Bluetooth')
on conflict (name) do nothing;

-- Add feature_id to private_listing_features
alter table private_listing_features 
  add column if not exists feature_id uuid references features(id);

-- Update existing records to link with features
update private_listing_features plf
set feature_id = f.id
from features f
where plf.name = f.name;

-- Make feature_id required after updating existing records
alter table private_listing_features 
  alter column feature_id set not null;

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
          'name', f.name,
          'available', plf.available
        )
        order by f.name
      )
      filter (where f.name is not null)
      from private_listing_features plf
      join features f on f.id = plf.feature_id
      where plf.listing_id = pl.id
    ),
    '[]'::jsonb
  ) as features
from private_listings pl
join brands b on b.id = pl.brand_id;

-- Create RLS policies
create policy "Features are viewable by everyone"
  on features for select
  using (true);

create policy "Anyone can view cars"
  on cars_with_brand for select
  using (true);

create policy "Anyone can view private listings"
  on private_listings_with_brand for select
  using (true);

-- Grant necessary permissions
grant select on features to anon, authenticated;
grant select on cars_with_brand to anon, authenticated;
grant select on private_listings_with_brand to anon, authenticated;

-- Create indexes
create index if not exists idx_private_listing_features_feature_id 
  on private_listing_features(feature_id);

-- Refresh schema cache
notify pgrst, 'reload schema';