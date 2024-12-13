-- Drop existing car_images table if it exists
drop table if exists car_images cascade;

-- Create car_images table with proper structure
create table car_images (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_image_order unique (car_id, display_order)
);

-- Create indexes
create index idx_car_images_car_id on car_images(car_id);
create index idx_car_images_display_order on car_images(display_order);

-- Enable RLS
alter table car_images enable row level security;

-- Create policies
create policy "Allow read access to car images"
  on car_images for select
  using (true);

create policy "Allow authenticated users to manage car images"
  on car_images for all
  using (true)
  with check (true);

-- Create function to manage car images
create or replace function manage_car_images(
  p_car_id uuid,
  p_images jsonb
) returns void as $$
begin
  -- Delete existing images
  delete from car_images where car_id = p_car_id;
  
  -- Insert new images
  insert into car_images (car_id, image_url, display_order)
  select 
    p_car_id,
    (image->>'url')::text,
    (image->>'display_order')::int
  from jsonb_array_elements(p_images) as image;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function manage_car_images(uuid, jsonb) to authenticated;

-- Create storage buckets if they don't exist
insert into storage.buckets (id, name, public)
values 
  ('car_images', 'car_images', true),
  ('car_videos', 'car_videos', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Public read access for images"
  on storage.objects for select
  using (bucket_id = 'car_images');

create policy "Public read access for videos"
  on storage.objects for select
  using (bucket_id = 'car_videos');

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (bucket_id = 'car_images');

create policy "Authenticated users can upload videos"
  on storage.objects for insert
  with check (bucket_id = 'car_videos');

create policy "Authenticated users can delete images"
  on storage.objects for delete
  using (bucket_id = 'car_images');

create policy "Authenticated users can delete videos"
  on storage.objects for delete
  using (bucket_id = 'car_videos');