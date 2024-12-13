-- Drop existing views and tables
drop view if exists cars_with_make cascade;
drop view if exists private_listings_with_make cascade;
drop table if exists main_services cascade;

-- Create main_services table
create table main_services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price numeric not null check (price >= 0),
  image text not null,
  category text not null check (category in (
    'Maintenance',
    'Repair',
    'Inspection',
    'Customization',
    'Cleaning',
    'Insurance',
    'Warranty',
    'Other'
  )),
  duration text not null,
  available boolean not null default true,
  visible boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_main_services_category on main_services(category);
create index idx_main_services_available on main_services(available);
create index idx_main_services_visible on main_services(visible);

-- Enable RLS
alter table main_services enable row level security;

-- Create RLS policies
create policy "Public can view visible services"
  on main_services for select
  using (
    visible = true
    or
    auth.role() = 'authenticated'
  );

create policy "Authenticated users can manage services"
  on main_services for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Grant permissions
grant select on main_services to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';