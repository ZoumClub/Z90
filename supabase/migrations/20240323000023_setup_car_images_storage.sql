-- Create car_images table if it doesn't exist
create table if not exists car_images (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_image_order unique (car_id, display_order)
);

-- Create storage bucket for car listings if it doesn't exist
insert into storage.buckets (id, name, public)
values ('car-listings', 'car-listings', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'car-listings');

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (bucket_id = 'car-listings');

create policy "Authenticated users can update"
  on storage.objects for update
  with check (bucket_id = 'car-listings');

create policy "Authenticated users can delete"
  on storage.objects for delete
  using (bucket_id = 'car-listings');

-- Create folders in the bucket
insert into storage.objects (bucket_id, name, owner, metadata)
values 
  ('car-listings', 'Photos/', auth.uid(), '{"mimetype": "application/x-directory"}'),
  ('car-listings', 'Thumbnails/', auth.uid(), '{"mimetype": "application/x-directory"}')
on conflict (bucket_id, name) do nothing;