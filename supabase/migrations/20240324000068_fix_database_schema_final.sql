-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Drop existing tables in correct order
drop table if exists car_features cascade;
drop table if exists private_listing_features cascade;
drop table if exists cars cascade;
drop table if exists private_listings cascade;
drop table if exists brands cascade;

-- Create brands table
create table brands (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  logo_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create cars table
create table cars (
  id uuid default gen_random_uuid() primary key,
  brand_id uuid not null references brands(id) on delete restrict,
  model text not null,
  year integer not null check (year >= 1900 and year <= extract(year from current_date) + 1),
  price numeric not null check (price > 0),
  savings numeric not null check (savings >= 0),
  image text not null,
  video_url text,
  condition text not null check (condition in ('new', 'used')),
  mileage text not null default 'Under 1,000 km',
  fuel_type text not null check (fuel_type in ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
  transmission text not null check (transmission in ('Automatic', 'Manual')),
  body_type text not null check (body_type in ('Sedan', 'SUV', 'Coupe', 'Hatchback', 'Convertible', 'Van')),
  exterior_color text not null check (exterior_color in ('Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green', 'Brown', 'Beige')),
  interior_color text not null check (interior_color in ('Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green', 'Brown', 'Beige')),
  number_of_owners integer not null default 1 check (number_of_owners > 0),
  is_sold boolean not null default false,
  dealer_id uuid references dealers(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create car_features table
create table car_features (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  name text not null,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_feature unique (car_id, name)
);

-- Create private_listings table
create table private_listings (
  id uuid default gen_random_uuid() primary key,
  brand_id uuid not null references brands(id) on delete restrict,
  model text not null,
  year integer not null check (year >= 1900 and year <= extract(year from current_date) + 1),
  price numeric not null check (price > 0),
  image text not null,
  video_url text,
  condition text not null default 'used' check (condition = 'used'),
  mileage text not null default 'Under 1,000 km',
  fuel_type text not null check (fuel_type in ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
  transmission text not null check (transmission in ('Automatic', 'Manual')),
  body_type text not null check (body_type in ('Sedan', 'SUV', 'Coupe', 'Hatchback', 'Convertible', 'Van')),
  exterior_color text not null check (exterior_color in ('Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green', 'Brown', 'Beige')),
  interior_color text not null check (interior_color in ('Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green', 'Brown', 'Beige')),
  number_of_owners integer not null check (number_of_owners > 0),
  client_name text not null check (length(trim(client_name)) >= 2),
  client_phone text not null check (client_phone ~ '^\d{4}$'),
  client_city text not null check (length(trim(client_city)) >= 2),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
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
create index idx_cars_brand_id on cars(brand_id);
create index idx_cars_condition on cars(condition);
create index idx_cars_is_sold on cars(is_sold);
create index idx_cars_dealer_id on cars(dealer_id);
create index idx_car_features_car_id on car_features(car_id);
create index idx_private_listings_brand_id on private_listings(brand_id);
create index idx_private_listings_status on private_listings(status);
create index idx_private_listing_features_listing_id on private_listing_features(listing_id);

-- Enable RLS
alter table brands enable row level security;
alter table cars enable row level security;
alter table car_features enable row level security;
alter table private_listings enable row level security;
alter table private_listing_features enable row level security;

-- Create RLS policies
create policy "Public read access"
  on brands for select
  using (true);

create policy "Public read access"
  on cars for select
  using (true);

create policy "Public read access"
  on car_features for select
  using (true);

create policy "Public read access"
  on private_listings for select
  using (true);

create policy "Public read access"
  on private_listing_features for select
  using (true);

create policy "Authenticated users can manage data"
  on cars for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage data"
  on car_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Anyone can insert private listings"
  on private_listings for insert
  with check (true);

create policy "Authenticated users can update private listings"
  on private_listings for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Insert sample brands
insert into brands (name, logo_url) values
  ('BMW', 'https://images.unsplash.com/photo-1617886903355-9354bb57751f'),
  ('Mercedes', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'),
  ('Audi', 'https://images.unsplash.com/photo-1610768764270-790fbec18178'),
  ('Toyota', 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a'),
  ('Honda', 'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10'),
  ('Ford', 'https://images.unsplash.com/photo-1612825173281-9a193378527e'),
  ('Volkswagen', 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f')
on conflict (name) do nothing;

-- Create function to process private listing
create or replace function process_private_listing(
  p_listing_id uuid,
  p_status text
) returns jsonb as $$
declare
  v_listing private_listings;
  v_car_id uuid;
  v_result jsonb;
begin
  -- Validate status
  if p_status not in ('approved', 'rejected') then
    raise exception 'Invalid status. Must be either approved or rejected.';
  end if;

  -- Get and lock the listing
  select * into v_listing
  from private_listings
  where id = p_listing_id
  for update;

  if not found then
    raise exception 'Listing not found';
  end if;

  if v_listing.status != 'pending' then
    raise exception 'Listing has already been processed';
  end if;

  -- Update listing status
  update private_listings
  set 
    status = p_status,
    updated_at = now()
  where id = p_listing_id;

  -- If approved, create car listing
  if p_status = 'approved' then
    insert into cars (
      brand_id, model, year, price, image,
      video_url, condition, mileage, fuel_type,
      transmission, body_type, exterior_color,
      interior_color, number_of_owners, savings,
      is_sold
    )
    values (
      v_listing.brand_id, v_listing.model,
      v_listing.year, v_listing.price, v_listing.image,
      v_listing.video_url, v_listing.condition, v_listing.mileage,
      v_listing.fuel_type, v_listing.transmission, v_listing.body_type,
      v_listing.exterior_color, v_listing.interior_color,
      v_listing.number_of_owners, floor(v_listing.price * 0.1),
      false
    )
    returning id into v_car_id;

    -- Copy features to car
    insert into car_features (car_id, name, available)
    select v_car_id, plf.name, plf.available
    from private_listing_features plf
    where plf.listing_id = p_listing_id;
  end if;

  -- Prepare result
  v_result := jsonb_build_object(
    'success', true,
    'listing_id', p_listing_id,
    'car_id', v_car_id,
    'status', p_status
  );

  return v_result;
exception
  when others then
    raise exception '%', sqlerrm;
end;
$$ language plpgsql security definer;

-- Grant execute permission
grant execute on function process_private_listing(uuid, text) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';