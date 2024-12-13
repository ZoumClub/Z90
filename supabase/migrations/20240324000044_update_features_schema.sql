-- Drop existing features-related tables and functions
drop table if exists private_listing_features cascade;
drop table if exists car_features cascade;
drop table if exists features cascade;
drop function if exists manage_car_features(uuid, text[]);
drop function if exists manage_private_listing_features(uuid, text[]);

-- Create features table
create table features (
  id uuid default gen_random_uuid() primary key,
  brand_id uuid not null references brands(id) on delete cascade,
  car_id uuid references cars(id) on delete cascade,
  private_listing_id uuid references private_listings(id) on delete cascade,
  name text not null,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint features_owner_check check (
    (car_id is not null and private_listing_id is null) or
    (car_id is null and private_listing_id is not null)
  ),
  constraint unique_feature unique (coalesce(car_id, private_listing_id), name)
);

-- Create indexes
create index idx_features_brand_id on features(brand_id);
create index idx_features_car_id on features(car_id);
create index idx_features_private_listing_id on features(private_listing_id);
create index idx_features_name on features(name);

-- Enable RLS
alter table features enable row level security;

-- Create RLS policies
create policy "Features are viewable by everyone"
  on features for select
  using (true);

create policy "Authenticated users can manage features"
  on features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Create function to manage car features
create or replace function manage_car_features(
  p_car_id uuid,
  p_brand_id uuid,
  p_feature_names text[]
) returns void as $$
begin
  -- Delete existing features
  delete from features where car_id = p_car_id;
  
  -- Insert new features
  insert into features (brand_id, car_id, name)
  select p_brand_id, p_car_id, unnest(p_feature_names);
end;
$$ language plpgsql security definer;

-- Create function to manage private listing features
create or replace function manage_private_listing_features(
  p_listing_id uuid,
  p_brand_id uuid,
  p_feature_names text[]
) returns void as $$
begin
  -- Delete existing features
  delete from features where private_listing_id = p_listing_id;
  
  -- Insert new features
  insert into features (brand_id, private_listing_id, name)
  select p_brand_id, p_listing_id, unnest(p_feature_names);
end;
$$ language plpgsql security definer;

-- Grant execute permissions
grant execute on function manage_car_features(uuid, uuid, text[]) to authenticated;
grant execute on function manage_private_listing_features(uuid, uuid, text[]) to authenticated;

-- Insert default features for existing cars
insert into features (brand_id, car_id, name)
select c.brand_id, c.id, f.name
from cars c
cross join (
  values 
    ('Speed Regulator'),
    ('Air Condition'),
    ('Reversing Camera'),
    ('Reversing Radar'),
    ('GPS Navigation'),
    ('Park Assist'),
    ('Start and Stop'),
    ('Airbag'),
    ('ABS'),
    ('Computer'),
    ('Rims'),
    ('Electric mirrors'),
    ('Electric windows'),
    ('Bluetooth')
) as f(name)
on conflict do nothing;

-- Insert default features for existing private listings
insert into features (brand_id, private_listing_id, name)
select pl.brand_id, pl.id, f.name
from private_listings pl
cross join (
  values 
    ('Speed Regulator'),
    ('Air Condition'),
    ('Reversing Camera'),
    ('Reversing Radar'),
    ('GPS Navigation'),
    ('Park Assist'),
    ('Start and Stop'),
    ('Airbag'),
    ('ABS'),
    ('Computer'),
    ('Rims'),
    ('Electric mirrors'),
    ('Electric windows'),
    ('Bluetooth')
) as f(name)
where pl.status = 'pending'
on conflict do nothing;

-- Refresh schema cache
notify pgrst, 'reload schema';