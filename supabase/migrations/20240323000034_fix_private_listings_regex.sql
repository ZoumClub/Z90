-- Drop existing table
drop table if exists private_listings cascade;

-- Create improved private_listings table with fixed validation
create table private_listings (
  id uuid default gen_random_uuid() primary key,
  brand_id uuid not null references brands(id) on delete restrict,
  make text not null,
  model text not null,
  year integer not null,
  price numeric not null,
  image text not null,
  video_url text,
  condition text not null default 'used',
  mileage text not null,
  fuel_type text not null,
  transmission text not null,
  body_type text not null,
  exterior_color text not null,
  interior_color text not null,
  number_of_owners integer not null,
  client_name text not null,
  client_phone text not null,
  client_city text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Add constraints with fixed validation
  constraint check_year check (year >= 1900 and year <= extract(year from current_date) + 1),
  constraint check_price check (price > 0),
  constraint check_condition check (condition = 'used'),
  constraint check_status check (status in ('pending', 'approved', 'rejected')),
  constraint check_client_name check (length(trim(client_name)) >= 2),
  constraint check_client_phone check (client_phone ~ '^\+?[0-9\s\-()]{10,}$'),
  constraint check_client_city check (length(trim(client_city)) >= 2),
  constraint check_number_of_owners check (number_of_owners > 0)
);

-- Create indexes
create index idx_private_listings_status on private_listings(status);
create index idx_private_listings_brand_id on private_listings(brand_id);
create index idx_private_listings_created_at on private_listings(created_at desc);
create index idx_private_listings_client_phone on private_listings(client_phone);
create index idx_private_listings_client_city on private_listings(client_city);

-- Enable RLS
alter table private_listings enable row level security;

-- Create RLS policies
create policy "Allow read access to private listings"
  on private_listings for select
  using (true);

create policy "Allow insert for everyone"
  on private_listings for insert
  with check (
    condition = 'used' and
    status = 'pending' and
    price > 0 and
    year >= 1900 and
    year <= extract(year from current_date) + 1 and
    length(trim(client_name)) >= 2 and
    client_phone ~ '^\+?[0-9\s\-()]{10,}$' and
    length(trim(client_city)) >= 2
  );

create policy "Allow admin updates"
  on private_listings for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Create function to update updated_at
create or replace function update_private_listings_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_private_listings_timestamp
  before update on private_listings
  for each row
  execute function update_private_listings_timestamp();