-- Drop existing views if they exist
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Create makes table if it doesn't exist
create table if not exists makes (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  logo_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add make_id to cars if it doesn't exist
alter table cars 
  add column if not exists make_id uuid references makes(id),
  add column if not exists make text not null;

-- Add make_id to private_listings if it doesn't exist
alter table private_listings 
  add column if not exists make_id uuid references makes(id),
  add column if not exists make text not null;

-- Enable RLS
alter table makes enable row level security;

-- Create RLS policies
create policy "Makes are viewable by everyone"
  on makes for select
  using (true);

-- Insert default makes
insert into makes (name, logo_url) values
  ('BMW', 'https://images.unsplash.com/photo-1617886903355-9354bb57751f'),
  ('Mercedes', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'),
  ('Audi', 'https://images.unsplash.com/photo-1610768764270-790fbec18178'),
  ('Toyota', 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a'),
  ('Honda', 'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10'),
  ('Ford', 'https://images.unsplash.com/photo-1612825173281-9a193378527e'),
  ('Volkswagen', 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f')
on conflict (name) do nothing;

-- Create function to get make_id from name
create or replace function get_make_id(p_make text)
returns uuid as $$
  select id from makes where name = p_make;
$$ language sql stable;

-- Create trigger to automatically set make_id
create or replace function set_make_id()
returns trigger as $$
begin
  new.make_id := get_make_id(new.make);
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger set_car_make_id
  before insert or update of make on cars
  for each row
  execute function set_make_id();

create trigger set_private_listing_make_id
  before insert or update of make on private_listings
  for each row
  execute function set_make_id();

-- Create indexes
create index idx_makes_name on makes(name);
create index idx_cars_make_id on cars(make_id);
create index idx_private_listings_make_id on private_listings(make_id);

-- Grant permissions
grant select on makes to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';