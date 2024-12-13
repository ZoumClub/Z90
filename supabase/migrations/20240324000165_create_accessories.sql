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
create index idx_accessories_category on accessories(category);
create index idx_accessories_in_stock on accessories(in_stock);
create index idx_accessories_visible on accessories(visible);

-- Create trigger
create trigger update_accessories_timestamp
  before update on accessories
  for each row
  execute function update_updated_at_column();

-- Enable RLS
alter table accessories enable row level security;

-- Create RLS policies
create policy "Accessories are viewable by everyone"
  on accessories for select
  using (visible = true);

-- Insert sample accessories
insert into accessories (name, description, price, image, category) values
  ('Premium Floor Mats', 'High-quality all-weather floor mats with custom fit', 89.99, 'https://images.unsplash.com/photo-1618483117616-d61d8e620544', 'Interior'),
  ('LED Light Kit', 'Complete interior LED lighting upgrade kit', 149.99, 'https://images.unsplash.com/photo-1621361365424-06f0c1376df6', 'Interior'),
  ('Dash Camera', 'HD dash camera with night vision and GPS', 199.99, 'https://images.unsplash.com/photo-1621266876144-1a58791196b0', 'Electronics'),
  ('Roof Rack', 'Universal roof rack system for extra storage', 299.99, 'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e', 'Exterior'),
  ('Performance Air Filter', 'High-flow air filter for better performance', 59.99, 'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e', 'Performance'),
  ('Seat Covers', 'Premium leather seat covers with custom fit', 199.99, 'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e', 'Interior');

-- Grant permissions
grant select on accessories to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';