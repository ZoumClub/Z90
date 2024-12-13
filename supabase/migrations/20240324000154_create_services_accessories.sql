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

-- Insert sample services
insert into services (name, description, price, image, category, duration) values
  ('Full Service', 'Complete car service including oil change, filters, and inspection', 299.99, 'https://images.unsplash.com/photo-1625047509168-a7026f36de04', 'Maintenance', '3-4 hours'),
  ('Wheel Alignment', 'Professional wheel alignment service', 89.99, 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60', 'Maintenance', '1 hour'),
  ('Paint Protection', 'Ceramic coating paint protection service', 599.99, 'https://images.unsplash.com/photo-1621963417481-fb4984a4b9a4', 'Customization', '1-2 days'),
  ('Interior Detailing', 'Complete interior cleaning and detailing service', 199.99, 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9', 'Cleaning', '4-5 hours'),
  ('Engine Diagnostics', 'Full engine diagnostic scan and report', 99.99, 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97', 'Inspection', '1 hour'),
  ('Window Tinting', 'Professional window tinting service', 299.99, 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d', 'Customization', '2-3 hours');

-- Insert sample accessories
insert into accessories (name, description, price, image, category) values
  ('Premium Floor Mats', 'High-quality all-weather floor mats with custom fit', 89.99, 'https://images.unsplash.com/photo-1618483117616-d61d8e620544', 'Interior'),
  ('LED Light Kit', 'Complete interior LED lighting upgrade kit', 149.99, 'https://images.unsplash.com/photo-1621361365424-06f0c1376df6', 'Interior'),
  ('Dash Camera', 'HD dash camera with night vision and GPS', 199.99, 'https://images.unsplash.com/photo-1621266876144-1a58791196b0', 'Electronics'),
  ('Roof Rack', 'Universal roof rack system for extra storage', 299.99, 'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e', 'Exterior'),
  ('Performance Air Filter', 'High-flow air filter for better performance', 59.99, 'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e', 'Performance'),
  ('Seat Covers', 'Premium leather seat covers with custom fit', 199.99, 'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e', 'Interior');

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger update_services_timestamp
  before update on services
  for each row
  execute function update_updated_at_column();

create trigger update_accessories_timestamp
  before update on accessories
  for each row
  execute function update_updated_at_column();

-- Grant permissions
grant select on services to anon, authenticated;
grant select on accessories to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';