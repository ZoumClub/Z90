-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Add features column to cars if it doesn't exist
do $$ 
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'cars' and column_name = 'features'
  ) then
    alter table cars add column features jsonb default '[]'::jsonb;
  end if;
end $$;

-- Add features column to private_listings if it doesn't exist
do $$ 
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'private_listings' and column_name = 'features'
  ) then
    alter table private_listings add column features jsonb default '[]'::jsonb;
  end if;
end $$;

-- Create function to validate features
create or replace function validate_features(features jsonb)
returns boolean as $$
begin
  -- Allow null or empty array
  if features is null or features = '[]'::jsonb then
    return true;
  end if;

  -- Check if features is an array
  if jsonb_array_length(features) = 0 then
    return true;
  end if;

  -- Check if each feature has required fields
  return not exists (
    select 1
    from jsonb_array_elements(features) as feature
    where not (
      feature ? 'name' and
      feature ? 'available' and
      (feature->>'name') is not null and
      (feature->>'available') is not null
    )
  );
end;
$$ language plpgsql immutable;

-- Add check constraints
alter table cars drop constraint if exists check_car_features_format;
alter table cars add constraint check_car_features_format
  check (validate_features(features));

alter table private_listings drop constraint if exists check_private_listing_features_format;
alter table private_listings add constraint check_private_listing_features_format
  check (validate_features(features));

-- Create cars_with_brand view
create view cars_with_brand as
select 
  c.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url
from cars c
join brands b on b.id = c.brand_id;

-- Create private_listings_with_brand view
create view private_listings_with_brand as
select 
  pl.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url
from private_listings pl
join brands b on b.id = pl.brand_id;

-- Create indexes for better performance
create index if not exists idx_cars_features on cars using gin(features);
create index if not exists idx_private_listings_features on private_listings using gin(features);

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all privileges on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

-- Grant access to views
grant select on cars_with_brand to anon, authenticated;
grant select on private_listings_with_brand to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';