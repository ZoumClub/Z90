-- Create storage buckets if they don't exist
insert into storage.buckets (id, name, public)
values 
  ('car_images', 'car_images', true),
  ('accessories', 'accessories', true),
  ('services', 'services', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Public read access for images"
  on storage.objects for select
  using (bucket_id in ('car_images', 'accessories', 'services'));

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (bucket_id in ('car_images', 'accessories', 'services'));

create policy "Authenticated users can delete images"
  on storage.objects for delete
  using (bucket_id in ('car_images', 'accessories', 'services'));

-- Refresh schema cache
notify pgrst, 'reload schema';