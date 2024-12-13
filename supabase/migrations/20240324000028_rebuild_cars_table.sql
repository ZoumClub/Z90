-- Drop existing tables and types
drop table if exists car_images cascade;
drop table if exists car_features cascade;
drop table if exists cars cascade;
drop type if exists mileage_range cascade;

-- Create mileage_range type
create type mileage_range as enum (
  'Under 1,000 km',
  '1,000 - 5,000 km',
  '5,000 - 10,000 km',
  '10,000 - 20,000 km',
  '20,000 - 30,000 km',
  '30,000 - 50,000 km',
  '50,000 - 75,000 km',
  '75,000 - 100,000 km',
  '100,000 - 150,000 km',
  'Over 150,000 km'
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
  mileage mileage_range not null default 'Under 1,000 km'::mileage_range,
  fuel_type text not null check (fuel_type in ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
  transmission text not null check (transmission in ('Automatic', 'Manual')),
  body_type text not null check (body_type in ('Sedan', 'SUV', 'Coupe', 'Hatchback', 'Convertible', 'Van')),
  exterior_color text not null check (exterior_color in ('Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green', 'Brown', 'Beige')),
  interior_color text not null check (interior_color in ('Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green', 'Brown', 'Beige')),
  number_of_owners integer not null default 1 check (number_of_owners > 0),
  is_sold boolean not null default false,
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

-- Create indexes
create index idx_cars_brand_id on cars(brand_id);
create index idx_cars_make on cars(make);
create index idx_cars_condition on cars(condition);
create index idx_cars_mileage on cars(mileage);
create index idx_cars_price on cars(price);
create index idx_cars_is_sold on cars(is_sold);
create index idx_car_images_car_id on car_images(car_id);
create index idx_car_features_car_id on car_features(car_id);

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

-- Create trigger for brand consistency
create trigger maintain_car_brand_consistency
  before insert or update on cars
  for each row
  execute function maintain_brand_consistency();

-- Create function to manage car features
create or replace function manage_car_features(
  p_car_id uuid,
  p_features text[]
)
returns void as $$
begin
  delete from car_features where car_id = p_car_id;
  
  insert into car_features (car_id, name, available)
  select p_car_id, unnest(p_features), true;
end;
$$ language plpgsql;

-- Create function to manage car images
create or replace function manage_car_images(
  p_car_id uuid,
  p_images jsonb
)
returns void as $$
begin
  delete from car_images where car_id = p_car_id;
  
  insert into car_images (car_id, image_url, display_order)
  select 
    p_car_id,
    (image->>'url')::text,
    (image->>'display_order')::integer
  from jsonb_array_elements(p_images) as image;
end;
$$ language plpgsql;

-- Grant execute permissions
grant execute on function maintain_brand_consistency() to authenticated;
grant execute on function manage_car_features(uuid, text[]) to authenticated;
grant execute on function manage_car_images(uuid, jsonb) to authenticated;

-- Enable RLS
alter table cars enable row level security;
alter table car_images enable row level security;
alter table car_features enable row level security;

-- Create RLS policies
create policy "Cars are viewable by everyone"
  on cars for select
  using (true);

create policy "Car images are viewable by everyone"
  on car_images for select
  using (true);

create policy "Car features are viewable by everyone"
  on car_features for select
  using (true);

create policy "Authenticated users can manage cars"
  on cars for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage car images"
  on car_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage car features"
  on car_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Refresh schema cache
notify pgrst, 'reload schema';