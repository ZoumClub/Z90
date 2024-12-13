-- Drop existing tables in correct order
drop table if exists car_images cascade;
drop table if exists car_features cascade;
drop table if exists cars cascade;
drop table if exists private_listings cascade;
drop table if exists brands cascade;
drop type if exists mileage_range cascade;

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
  make text not null,
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

-- Create car_images table
create table car_images (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  image_url text not null,
  display_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_image_order unique (car_id, display_order)
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
  make text not null,
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
  client_phone text not null check (client_phone ~ '^\+?[0-9\s-()]{10,}$'),
  client_city text not null check (length(trim(client_city)) >= 2),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_brands_name on brands(name);
create index idx_cars_brand_id on cars(brand_id);
create index idx_cars_make on cars(make);
create index idx_cars_condition on cars(condition);
create index idx_cars_mileage on cars(mileage);
create index idx_cars_price on cars(price);
create index idx_cars_is_sold on cars(is_sold);
create index idx_cars_dealer_id on cars(dealer_id);
create index idx_car_images_car_id on car_images(car_id);
create index idx_car_features_car_id on car_features(car_id);
create index idx_private_listings_brand_id on private_listings(brand_id);
create index idx_private_listings_status on private_listings(status);

-- Create function to maintain brand consistency
create or replace function maintain_brand_consistency()
returns trigger as $$
declare
  v_brand_name text;
begin
  select name into v_brand_name
  from brands
  where id = new.brand_id;

  if not found then
    raise exception 'Invalid brand_id';
  end if;

  new.make := v_brand_name;
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger maintain_car_brand_consistency
  before insert or update on cars
  for each row
  execute function maintain_brand_consistency();

create trigger maintain_private_listing_brand_consistency
  before insert or update on private_listings
  for each row
  execute function maintain_brand_consistency();

-- Insert sample brands
insert into brands (name, logo_url) values
  ('BMW', 'https://images.unsplash.com/photo-1617886903355-9354bb57751f'),
  ('Mercedes', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'),
  ('Audi', 'https://images.unsplash.com/photo-1610768764270-790fbec18178'),
  ('Toyota', 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a'),
  ('Honda', 'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10'),
  ('Ford', 'https://images.unsplash.com/photo-1612825173281-9a193378527e'),
  ('Volkswagen', 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f');

-- Enable RLS
alter table brands enable row level security;
alter table cars enable row level security;
alter table car_images enable row level security;
alter table car_features enable row level security;
alter table private_listings enable row level security;

-- Create RLS policies
create policy "Public read access"
  on brands for select using (true);

create policy "Public read access"
  on cars for select using (true);

create policy "Public read access"
  on car_images for select using (true);

create policy "Public read access"
  on car_features for select using (true);

create policy "Public read access"
  on private_listings for select using (true);

create policy "Authenticated users can manage data"
  on cars for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage data"
  on car_images for all
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

-- Refresh schema cache
notify pgrst, 'reload schema';