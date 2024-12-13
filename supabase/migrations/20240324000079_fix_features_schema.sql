-- Drop existing views and tables
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;
drop table if exists car_features cascade;
drop table if exists private_listing_features cascade;
drop table if exists features cascade;

-- Create features table
create table features (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create car_features table
create table car_features (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  feature_id uuid not null references features(id) on delete cascade,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_feature unique (car_id, feature_id)
);

-- Create private_listing_features table
create table private_listing_features (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid not null references private_listings(id) on delete cascade,
  feature_id uuid not null references features(id) on delete cascade,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_listing_feature unique (listing_id, feature_id)
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
          'name', f.name,
          'available', cf.available
        )
        order by f.name
      )
      filter (where f.name is not null)
      from car_features cf
      join features f on f.id = cf.feature_id
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

-- Create indexes
create index idx_features_name on features(name);
create index idx_car_features_car_id on car_features(car_id);
create index idx_car_features_feature_id on car_features(feature_id);
create index idx_private_listing_features_listing_id on private_listing_features(listing_id);
create index idx_private_listing_features_feature_id on private_listing_features(feature_id);

-- Enable RLS
alter table features enable row level security;
alter table car_features enable row level security;
alter table private_listing_features enable row level security;

-- Create RLS policies
create policy "Features are viewable by everyone"
  on features for select
  using (true);

create policy "Car features are viewable by everyone"
  on car_features for select
  using (true);

create policy "Private listing features are viewable by everyone"
  on private_listing_features for select
  using (true);

create policy "Authenticated users can manage features"
  on features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage car features"
  on car_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage private listing features"
  on private_listing_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Grant necessary permissions
grant select on features to anon, authenticated;
grant select on cars_with_brand to anon, authenticated;
grant select on private_listings_with_brand to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';