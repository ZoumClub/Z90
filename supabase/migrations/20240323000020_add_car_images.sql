-- Create car_images table
create table car_images (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for better performance
create index idx_car_images_car_id on car_images(car_id);
create index idx_car_images_display_order on car_images(display_order);

-- Enable RLS
alter table car_images enable row level security;

-- Create policies
create policy "Car images are viewable by everyone"
  on car_images for select
  using (true);

-- Migrate existing car images
insert into car_images (car_id, image_url, display_order)
select id, image, 0
from cars
where image is not null;

-- Add additional sample images for existing cars
insert into car_images (car_id, image_url, display_order)
select 
  c.id,
  unnest(array[
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
    'https://images.unsplash.com/photo-1542362567-b07e54358753',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd'
  ]),
  generate_series(1, 4)
from cars c;