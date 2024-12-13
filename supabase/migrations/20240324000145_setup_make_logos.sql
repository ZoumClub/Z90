-- Create storage bucket for make logos if it doesn't exist
insert into storage.buckets (id, name, public)
values ('make_logos', 'make_logos', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Public read access for make logos"
  on storage.objects for select
  using (bucket_id = 'make_logos');

create policy "Authenticated users can upload make logos"
  on storage.objects for insert
  with check (bucket_id = 'make_logos');

create policy "Authenticated users can delete make logos"
  on storage.objects for delete
  using (bucket_id = 'make_logos');

-- Add make_logo_url column to cars and private_listings
alter table cars add column if not exists make_logo_url text;
alter table private_listings add column if not exists make_logo_url text;

-- Create function to get make logo URL
create or replace function get_make_logo_url(p_make text)
returns text as $$
begin
  case p_make
    when 'BMW' then return 'https://tklblvxgprkvletfrsnn.supabase.co/storage/v1/object/public/make_logos/bmw.png';
    when 'Mercedes' then return 'https://tklblvxgprkvletfrsnn.supabase.co/storage/v1/object/public/make_logos/mercedes.png';
    when 'Audi' then return 'https://tklblvxgprkvletfrsnn.supabase.co/storage/v1/object/public/make_logos/audi.png';
    when 'Toyota' then return 'https://tklblvxgprkvletfrsnn.supabase.co/storage/v1/object/public/make_logos/toyota.png';
    when 'Honda' then return 'https://tklblvxgprkvletfrsnn.supabase.co/storage/v1/object/public/make_logos/honda.png';
    when 'Ford' then return 'https://tklblvxgprkvletfrsnn.supabase.co/storage/v1/object/public/make_logos/ford.png';
    when 'Volkswagen' then return 'https://tklblvxgprkvletfrsnn.supabase.co/storage/v1/object/public/make_logos/volkswagen.png';
    else return null;
  end case;
end;
$$ language plpgsql immutable;

-- Create trigger to automatically set make_logo_url
create or replace function set_make_logo_url()
returns trigger as $$
begin
  new.make_logo_url := get_make_logo_url(new.make);
  return new;
end;
$$ language plpgsql;

create trigger set_car_make_logo
  before insert or update of make on cars
  for each row
  execute function set_make_logo_url();

create trigger set_private_listing_make_logo
  before insert or update of make on private_listings
  for each row
  execute function set_make_logo_url();

-- Update existing records
update cars
set make_logo_url = get_make_logo_url(make)
where make_logo_url is null;

update private_listings
set make_logo_url = get_make_logo_url(make)
where make_logo_url is null;

-- Refresh schema cache
notify pgrst, 'reload schema';