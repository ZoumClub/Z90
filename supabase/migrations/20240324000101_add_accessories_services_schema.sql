```sql
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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_accessories_category on accessories(category);
create index idx_accessories_in_stock on accessories(in_stock);
create index idx_services_category on services(category);
create index idx_services_available on services(available);

-- Enable RLS
alter table accessories enable row level security;
alter table services enable row level security;

-- Create RLS policies
create policy "Anyone can view accessories"
  on accessories for select
  using (true);

create policy "Anyone can view services"
  on services for select
  using (true);

create policy "Admins can manage accessories"
  on accessories for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Admins can manage services"
  on services for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Insert sample accessories
insert into accessories (name, description, price, image, category) values
  ('Premium Floor Mats', 'High-quality all-weather floor mats with custom fit', 89.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Interior'),
  ('LED Light Kit', 'Complete interior LED lighting upgrade kit', 149.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Interior'),
  ('Dash Camera', 'HD dash camera with night vision and GPS', 199.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Electronics'),
  ('Roof Rack', 'Universal roof rack system for extra storage', 299.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Exterior'),
  ('Performance Air Filter', 'High-flow air filter for better performance', 59.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Performance'),
  ('Seat Covers', 'Premium leather seat covers with custom fit', 199.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Interior'),
  ('Window Tint Kit', 'Professional grade window tinting kit', 149.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Exterior'),
  ('Car Cover', 'All-weather car cover with soft interior lining', 129.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Exterior'),
  ('Bluetooth Adapter', 'Universal Bluetooth audio adapter', 39.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Electronics');

-- Insert sample services
insert into services (name, description, price, image, category, duration) values
  ('Full Service', 'Complete car service including oil change, filters, and inspection', 299.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Maintenance', '3-4 hours'),
  ('Wheel Alignment', 'Professional wheel alignment service', 89.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Maintenance', '1 hour'),
  ('Paint Protection', 'Ceramic coating paint protection service', 599.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Customization', '1-2 days'),
  ('Interior Detailing', 'Complete interior cleaning and detailing service', 199.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Cleaning', '4-5 hours'),
  ('Engine Diagnostics', 'Full engine diagnostic scan and report', 99.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Inspection', '1 hour'),
  ('Window Tinting', 'Professional window tinting service', 299.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Customization', '2-3 hours'),
  ('AC Service', 'Air conditioning system service and recharge', 149.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Maintenance', '1-2 hours'),
  ('Brake Service', 'Complete brake system inspection and service', 249.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Maintenance', '2-3 hours'),
  ('Extended Warranty', '2-year extended warranty coverage', 999.99, 'https://images.unsplash.com/photo-1600661653561-629509216228', 'Warranty', 'Instant');

-- Create trigger to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_accessories_timestamp
  before update on accessories
  for each row
  execute function update_updated_at_column();

create trigger update_services_timestamp
  before update on services
  for each row
  execute function update_updated_at_column();

-- Refresh schema cache
notify pgrst, 'reload schema';
```