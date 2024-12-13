-- Drop and recreate private_listings table with better constraints
drop table if exists private_listings cascade;

create table private_listings (
  id uuid default gen_random_uuid() primary key,
  brand_id uuid not null references brands(id) on delete restrict,
  make text not null,
  model text not null,
  year integer not null check (year >= 1900),
  price numeric not null check (price > 0),
  image text not null,
  video_url text,
  condition text not null default 'used' check (condition = 'used'),
  mileage text not null,
  fuel_type text not null,
  transmission text not null,
  body_type text not null,
  exterior_color text not null,
  interior_color text not null,
  number_of_owners integer not null check (number_of_owners > 0),
  client_name text not null check (length(client_name) >= 2),
  client_phone text not null,
  client_city text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_private_listings_status on private_listings(status);
create index idx_private_listings_brand_id on private_listings(brand_id);
create index idx_private_listings_created_at on private_listings(created_at desc);

-- Enable RLS
alter table private_listings enable row level security;

-- Create policies with better security
create policy "Private listings are viewable by everyone"
  on private_listings for select
  using (true);

create policy "Anyone can insert private listings"
  on private_listings for insert
  with check (
    condition = 'used' and
    status = 'pending'
  );

create policy "Only admins can update private listings"
  on private_listings for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Create trigger to update updated_at
create trigger set_private_listings_updated_at
  before update on private_listings
  for each row
  execute function update_updated_at_column();

-- Create function to validate phone numbers
create or replace function validate_phone_number()
returns trigger as $$
begin
  if not new.client_phone ~ '^\+?[0-9\s-()]{10,}$' then
    raise exception 'Invalid phone number format';
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger for phone number validation
create trigger validate_phone_number_trigger
  before insert or update on private_listings
  for each row
  execute function validate_phone_number();