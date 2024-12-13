-- Drop existing tables in correct order
drop table if exists car_images cascade;
drop table if exists car_features cascade;
drop table if exists cars cascade;
drop table if exists private_listings cascade;
drop table if exists brands cascade;

-- Create brands table with proper structure
create table brands (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  logo_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for better performance
create index idx_brands_name on brands(name);

-- Enable RLS
alter table brands enable row level security;

-- Create RLS policies
create policy "Brands are viewable by everyone"
  on brands for select
  using (true);

create policy "Authenticated users can manage brands"
  on brands for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Insert sample brands
insert into brands (name, logo_url) values
  ('BMW', 'https://images.unsplash.com/photo-1617886903355-9354bb57751f'),
  ('Mercedes', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'),
  ('Audi', 'https://images.unsplash.com/photo-1610768764270-790fbec18178'),
  ('Toyota', 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a'),
  ('Honda', 'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10'),
  ('Ford', 'https://images.unsplash.com/photo-1612825173281-9a193378527e'),
  ('Volkswagen', 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f');

-- Create function to get brand details
create or replace function get_brand_details(p_brand_id uuid)
returns jsonb as $$
  select jsonb_build_object(
    'id', id,
    'name', name,
    'logo_url', logo_url
  )
  from brands
  where id = p_brand_id;
$$ language sql stable;

-- Grant execute permissions
grant execute on function get_brand_details(uuid) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';