-- Add video_url column to cars table
alter table cars add column if not exists video_url text;

-- Create storage bucket for car videos if it doesn't exist
insert into storage.buckets (id, name, public)
values ('car_videos', 'car_videos', true)
on conflict (id) do nothing;

-- Set up storage policies for videos
create policy "Public read access for videos"
  on storage.objects for select
  using (bucket_id = 'car_videos');

create policy "Authenticated users can upload videos"
  on storage.objects for insert
  with check (bucket_id = 'car_videos');

create policy "Authenticated users can update videos"
  on storage.objects for update
  with check (bucket_id = 'car_videos');

create policy "Authenticated users can delete videos"
  on storage.objects for delete
  using (bucket_id = 'car_videos');