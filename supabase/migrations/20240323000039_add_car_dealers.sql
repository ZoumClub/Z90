-- Create dealers table
create table dealers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  shop_image text not null,
  address text not null,
  city text not null,
  phone text not null check (phone ~ '^\+?[0-9\s\-()]{10,}$'),
  whatsapp text not null check (whatsapp ~ '^\+?[0-9\s\-()]{10,}$'),
  id_number text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add dealer_id to cars table
alter table cars add column dealer_id uuid references dealers(id);

-- Create index for better performance
create index idx_cars_dealer_id on cars(dealer_id);

-- Enable RLS
alter table dealers enable row level security;

-- Create RLS policies
create policy "Dealers are viewable by everyone"
  on dealers for select
  using (true);

-- Insert sample dealers
insert into dealers (name, shop_image, address, city, phone, whatsapp, id_number) values
  (
    'Premium Auto Gallery',
    'https://images.unsplash.com/photo-1562519819-016930ada31b',
    '123 Luxury Lane',
    'London',
    '+44 20 7123 4567',
    '+44 7700 900123',
    'PAG123456'
  ),
  (
    'Elite Motors',
    'https://images.unsplash.com/photo-1567449303078-57ad995bd329',
    '456 Elite Street',
    'Manchester',
    '+44 161 234 5678',
    '+44 7700 900456',
    'EM789012'
  ),
  (
    'Prestige Cars',
    'https://images.unsplash.com/photo-1579033060982-1bb5b083f4fa',
    '789 Prestige Road',
    'Birmingham',
    '+44 121 345 6789',
    '+44 7700 900789',
    'PC345678'
  );

-- Update existing cars with random dealer assignments
update cars
set dealer_id = subquery.dealer_id
from (
  select id, (
    select id 
    from dealers 
    order by random() 
    limit 1
  ) as dealer_id
  from cars
) as subquery
where cars.id = subquery.id;

-- Make dealer_id required for future entries
alter table cars alter column dealer_id set not null;