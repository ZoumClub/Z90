-- Drop existing triggers and functions
drop trigger if exists validate_phone_number_trigger on private_listings;
drop function if exists validate_phone_number();

-- Improve private_listings table
alter table private_listings
  alter column client_name set not null,
  alter column client_phone set not null,
  alter column client_city set not null,
  add constraint check_client_name check (length(trim(client_name)) >= 2),
  add constraint check_client_phone check (client_phone ~ '^\+?[0-9\s-()]{10,}$'),
  add constraint check_client_city check (length(trim(client_city)) >= 2),
  add constraint check_price check (price > 0),
  add constraint check_year check (year >= 1900 and year <= extract(year from current_date) + 1);

-- Create function to automatically set updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_private_listings_updated_at
  before update on private_listings
  for each row
  execute function set_updated_at();

-- Improve indexes for better performance
create index if not exists idx_private_listings_client_phone on private_listings(client_phone);
create index if not exists idx_private_listings_client_city on private_listings(client_city);
create index if not exists idx_private_listings_price on private_listings(price);
create index if not exists idx_private_listings_year on private_listings(year);

-- Update RLS policies
drop policy if exists "Private listings are viewable by everyone" on private_listings;
drop policy if exists "Anyone can insert private listings" on private_listings;
drop policy if exists "Only admins can update private listings" on private_listings;

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
    client_phone ~ '^\+?[0-9\s-()]{10,}$' and
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