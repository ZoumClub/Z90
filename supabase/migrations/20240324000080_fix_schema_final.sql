-- Drop existing views and tables
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;
drop table if exists car_features cascade;
drop table if exists private_listing_features cascade;
drop table if exists features cascade;

-- Create features table
create table features (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create car_features table
create table car_features (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  name text not null,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_feature unique (car_id, name)
);

-- Create private_listing_features table
create table private_listing_features (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid not null references private_listings(id) on delete cascade,
  name text not null,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_listing_feature unique (listing_id, name)
);

-- Insert default features
insert into features (name) values
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
on conflict (name) do nothing;

-- Create cars_with_brand view
create view cars_with_brand as
select 
  c.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'name', cf.name,
          'available', cf.available
        )
        order by cf.name
      )
      filter (where cf.name is not null)
      from car_features cf
      where cf.car_id = c.id
    ),
    '[]'::jsonb
  ) as features
from cars c
join brands b on b.id = c.brand_id;

-- Create private_listings_with_brand view
create view private_listings_with_brand as
select 
  pl.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'name', plf.name,
          'available', plf.available
        )
        order by plf.name
      )
      filter (where plf.name is not null)
      from private_listing_features plf
      where plf.listing_id = pl.id
    ),
    '[]'::jsonb
  ) as features
from private_listings pl
join brands b on b.id = pl.brand_id;

-- Create indexes
create index idx_features_name on features(name);
create index idx_car_features_car_id on car_features(car_id);
create index idx_car_features_name on car_features(name);
create index idx_private_listing_features_listing_id on private_listing_features(listing_id);
create index idx_private_listing_features_name on private_listing_features(name);

-- Enable RLS
alter table features enable row level security;
alter table car_features enable row level security;
alter table private_listing_features enable row level security;

-- Create RLS policies
create policy "Features are viewable by everyone"
  on features for select
  using (true);

create policy "Car features are viewable by everyone"
  on car_features for select
  using (true);

create policy "Private listing features are viewable by everyone"
  on private_listing_features for select
  using (true);

create policy "Authenticated users can manage features"
  on features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage car features"
  on car_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage private listing features"
  on private_listing_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all privileges on all tables in schema public to authenticated;
grant all privileges on all sequences in schema public to authenticated;
grant all privileges on all functions in schema public to authenticated;

grant usage on schema public to anon;
grant select on all tables in schema public to anon;

-- Grant access to views
grant select on cars_with_brand to anon, authenticated;
grant select on private_listings_with_brand to anon, authenticated;

-- Create function to process private listing
create or replace function process_private_listing(
  p_listing_id uuid,
  p_status text
) returns jsonb as $$
declare
  v_listing private_listings;
  v_car_id uuid;
  v_result jsonb;
begin
  -- Validate status
  if p_status not in ('approved', 'rejected') then
    raise exception 'Invalid status. Must be either approved or rejected.';
  end if;

  -- Get and lock the listing
  select * into v_listing
  from private_listings
  where id = p_listing_id
  for update;

  if not found then
    raise exception 'Listing not found';
  end if;

  if v_listing.status != 'pending' then
    raise exception 'Listing has already been processed';
  end if;

  -- Update listing status
  update private_listings
  set 
    status = p_status,
    updated_at = now()
  where id = p_listing_id;

  -- If approved, create car listing
  if p_status = 'approved' then
    insert into cars (
      brand_id, model, year, price, image,
      video_url, condition, mileage, fuel_type,
      transmission, body_type, exterior_color,
      interior_color, number_of_owners, savings,
      is_sold
    )
    values (
      v_listing.brand_id, v_listing.model,
      v_listing.year, v_listing.price, v_listing.image,
      v_listing.video_url, v_listing.condition, v_listing.mileage,
      v_listing.fuel_type, v_listing.transmission, v_listing.body_type,
      v_listing.exterior_color, v_listing.interior_color,
      v_listing.number_of_owners, floor(v_listing.price * 0.1),
      false
    )
    returning id into v_car_id;

    -- Copy features to car
    insert into car_features (car_id, name, available)
    select v_car_id, plf.name, plf.available
    from private_listing_features plf
    where plf.listing_id = p_listing_id;
  end if;

  -- Prepare result
  v_result := jsonb_build_object(
    'success', true,
    'listing_id', p_listing_id,
    'car_id', v_car_id,
    'status', p_status
  );

  return v_result;
exception
  when others then
    raise exception '%', sqlerrm;
end;
$$ language plpgsql security definer;

-- Grant execute permission
grant execute on function process_private_listing(uuid, text) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';