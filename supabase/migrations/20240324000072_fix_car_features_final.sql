-- Drop existing views and tables
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;
drop table if exists car_features cascade;
drop table if exists private_listing_features cascade;

-- Create car_features table
create table car_features (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  name text not null,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_feature unique (car_id, name)
);

-- Create private_listing_features table
create table private_listing_features (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid not null references private_listings(id) on delete cascade,
  name text not null,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_listing_feature unique (listing_id, name)
);

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
      )
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

-- Create indexes
create index idx_car_features_car_id on car_features(car_id);
create index idx_private_listing_features_listing_id on private_listing_features(listing_id);

-- Enable RLS
alter table car_features enable row level security;
alter table private_listing_features enable row level security;

-- Create RLS policies
create policy "Car features are viewable by everyone"
  on car_features for select
  using (true);

create policy "Private listing features are viewable by everyone"
  on private_listing_features for select
  using (true);

create policy "Authenticated users can manage car features"
  on car_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage private listing features"
  on private_listing_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Insert default features for existing cars
insert into car_features (car_id, name)
select c.id, f.name
from cars c
cross join (
  values 
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
) as f(name)
on conflict (car_id, name) do nothing;

-- Refresh schema cache
notify pgrst, 'reload schema';