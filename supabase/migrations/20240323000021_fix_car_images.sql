-- Drop and recreate car_images table
drop table if exists car_images cascade;

create table car_images (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_image_order unique (car_id, display_order)
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

create policy "Admins can manage car images"
  on car_images for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Migrate existing car images
insert into car_images (car_id, image_url, display_order)
select id, image, 0
from cars
where image is not null;

-- Add sample additional images for each car
with sample_images as (
  select 
    c.id as car_id,
    case 
      when c.make = 'BMW' then array[
        'https://images.unsplash.com/photo-1555215695-3004980ad54e',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
        'https://images.unsplash.com/photo-1542362567-b07e54358753'
      ]
      when c.make = 'Mercedes-Benz' then array[
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24',
        'https://images.unsplash.com/photo-1606220838315-056192d5e927'
      ]
      when c.make = 'Audi' then array[
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
        'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a'
      ]
      else array[
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd',
        'https://images.unsplash.com/photo-1542332213-31f87348057f',
        'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35'
      ]
    end as images
  from cars c
)
insert into car_images (car_id, image_url, display_order)
select 
  car_id,
  unnest(images),
  generate_series(1, array_length(images, 1))
from sample_images;