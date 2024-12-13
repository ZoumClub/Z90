-- Drop existing tables if they exist
drop table if exists services cascade;
drop table if exists accessories cascade;

-- Create services table
create table services (
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

-- Create accessories table
create table accessories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price numeric not null check (price >= 0),
  image text not null,
  category text not null check (category in (
    'Interior',
    'Exterior',
    'Electronics',
    'Performance',
    'Safety',
    'Comfort',
    'Maintenance',
    'Other'
  )),
  in_stock boolean not null default true,
  visible boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_services_category on services(category);
create index idx_services_available on services(available);
create index idx_services_visible on services(visible);
create index idx_accessories_category on accessories(category);
create index idx_accessories_in_stock on accessories(in_stock);
create index idx_accessories_visible on accessories(visible);

-- Enable RLS
alter table services enable row level security;
alter table accessories enable row level security;

-- Create RLS policies
create policy "Services are viewable by everyone"
  on services for select
  using (visible = true);

create policy "Accessories are viewable by everyone"
  on accessories for select
  using (visible = true);

-- Grant permissions
grant select on services to anon, authenticated;
grant select on accessories to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';