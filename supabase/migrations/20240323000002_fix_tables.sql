-- Drop existing tables if they exist
drop table if exists cars cascade;
drop table if exists brands cascade;
drop table if exists profiles cascade;

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  role text check (role in ('admin', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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
  make text not null,
  model text not null,
  year integer not null,
  price numeric not null,
  image text not null,
  savings numeric not null,
  condition text check (condition in ('new', 'used')) not null default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table brands enable row level security;
alter table cars enable row level security;

-- Create RLS policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Brands are viewable by everyone"
  on brands for select
  using (true);

create policy "Cars are viewable by everyone"
  on cars for select
  using (true);

-- Insert sample brands
insert into brands (name, logo_url) values
  ('BMW', 'https://images.unsplash.com/photo-1617886903355-9354bb57751f'),
  ('Mercedes-Benz', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'),
  ('Audi', 'https://images.unsplash.com/photo-1610768764270-790fbec18178'),
  ('Toyota', 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a'),
  ('Honda', 'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10'),
  ('Ford', 'https://images.unsplash.com/photo-1612825173281-9a193378527e'),
  ('Volkswagen', 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f');

-- Insert sample cars
insert into cars (make, model, year, price, image, savings, condition) values
  ('BMW', '3 Series', 2024, 45990, 'https://images.unsplash.com/photo-1555215695-3004980ad54e', 3500, 'new'),
  ('Mercedes-Benz', 'C-Class', 2024, 47990, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8', 4200, 'new'),
  ('Audi', 'A4', 2024, 46590, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6', 3800, 'new'),
  ('BMW', '5 Series', 2022, 35990, 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd', 5500, 'used'),
  ('Mercedes-Benz', 'E-Class', 2021, 38990, 'https://images.unsplash.com/photo-1606220838315-056192d5e927', 6200, 'used'),
  ('Audi', 'A6', 2022, 37590, 'https://images.unsplash.com/photo-1606220838315-056192d5e927', 4800, 'used');