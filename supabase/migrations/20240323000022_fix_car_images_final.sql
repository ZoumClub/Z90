-- Drop existing car_images table
drop table if exists car_images cascade;

-- Create car_images table with proper constraints
create table car_images (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_image_order unique (car_id, display_order)
);

-- Add indexes
create index idx_car_images_car_id on car_images(car_id);
create index idx_car_images_display_order on car_images(display_order);

-- Enable RLS
alter table car_images enable row level security;

-- Create policies
create policy "Allow read access to car images"
  on car_images for select
  using (true);

create policy "Allow all operations for authenticated users"
  on car_images for all
  using (true)
  with check (true);

-- Migrate existing car images
insert into car_images (car_id, image_url, display_order)
select id, image, 0
from cars
where image is not null;

-- Add sample images for each car
insert into car_images (car_id, image_url, display_order)
select 
  c.id,
  image_url,
  row_number() over (partition by c.id order by random())
from cars c
cross join (
  values 
    ('https://images.unsplash.com/photo-1555215695-3004980ad54e'),
    ('https://images.unsplash.com/photo-1552519507-da3b142c6e3d'),
    ('https://images.unsplash.com/photo-1542362567-b07e54358753'),
    ('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'),
    ('https://images.unsplash.com/photo-1609521263047-f8f205293f24')
) as images(image_url)
where not exists (
  select 1 
  from car_images ci 
  where ci.car_id = c.id and ci.image_url = images.image_url
);

-- Create storage bucket for car images if it doesn't exist
insert into storage.buckets (id, name)
values ('car-listings', 'car-listings')
on conflict (id) do nothing;

-- Set up storage policies
create policy "Allow public read access"
  on storage.objects for select
  using (bucket_id = 'car-listings');

create policy "Allow authenticated users to upload"
  on storage.objects for insert
  with check (bucket_id = 'car-listings');