-- Create car_images table if it doesn't exist
create table if not exists car_images (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_image_order unique (car_id, display_order)
);

-- Create indexes
create index if not exists idx_car_images_car_id on car_images(car_id);
create index if not exists idx_car_images_display_order on car_images(display_order);

-- Enable RLS
alter table car_images enable row level security;

-- Create policies
create policy "Public read access"
  on car_images for select
  using (true);

create policy "Authenticated users can manage images"
  on car_images for all
  using (true)
  with check (true);

-- Create storage bucket for car images
insert into storage.buckets (id, name, public)
values ('car_images', 'car_images', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'car_images');

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (bucket_id = 'car_images');

create policy "Authenticated users can update"
  on storage.objects for update
  with check (bucket_id = 'car_images');

create policy "Authenticated users can delete"
  on storage.objects for delete
  using (bucket_id = 'car_images');