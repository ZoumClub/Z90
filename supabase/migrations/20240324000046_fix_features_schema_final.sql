-- Drop existing features-related tables and functions
drop table if exists features cascade;
drop function if exists manage_car_features(uuid, uuid, text[]);
drop function if exists manage_private_listing_features(uuid, uuid, text[]);

-- Create features table with proper structure
create table features (
  id uuid default gen_random_uuid() primary key,
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_feature_name unique (brand_id, name)
);

-- Create car_features junction table
create table car_features (
  car_id uuid not null references cars(id) on delete cascade,
  feature_id uuid not null references features(id) on delete cascade,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (car_id, feature_id)
);

-- Create private_listing_features junction table
create table private_listing_features (
  listing_id uuid not null references private_listings(id) on delete cascade,
  feature_id uuid not null references features(id) on delete cascade,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (listing_id, feature_id)
);

-- Create indexes
create index idx_features_brand_id on features(brand_id);
create index idx_features_name on features(name);
create index idx_car_features_car_id on car_features(car_id);
create index idx_car_features_feature_id on car_features(feature_id);
create index idx_private_listing_features_listing_id on private_listing_features(listing_id);
create index idx_private_listing_features_feature_id on private_listing_features(feature_id);

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

-- Create function to manage car features
create or replace function manage_car_features(
  p_car_id uuid,
  p_brand_id uuid,
  p_feature_names text[]
) returns void as $$
declare
  v_feature_id uuid;
begin
  -- Delete existing features
  delete from car_features where car_id = p_car_id;
  
  -- Insert or get features and link them to the car
  foreach v_feature_name in array p_feature_names loop
    -- Get or create feature
    insert into features (brand_id, name)
    values (p_brand_id, v_feature_name)
    on conflict (brand_id, name) do update set name = excluded.name
    returning id into v_feature_id;

    -- Link feature to car
    insert into car_features (car_id, feature_id)
    values (p_car_id, v_feature_id);
  end loop;
end;
$$ language plpgsql security definer;

-- Create function to manage private listing features
create or replace function manage_private_listing_features(
  p_listing_id uuid,
  p_brand_id uuid,
  p_feature_names text[]
) returns void as $$
declare
  v_feature_id uuid;
begin
  -- Delete existing features
  delete from private_listing_features where listing_id = p_listing_id;
  
  -- Insert or get features and link them to the listing
  foreach v_feature_name in array p_feature_names loop
    -- Get or create feature
    insert into features (brand_id, name)
    values (p_brand_id, v_feature_name)
    on conflict (brand_id, name) do update set name = excluded.name
    returning id into v_feature_id;

    -- Link feature to listing
    insert into private_listing_features (listing_id, feature_id)
    values (p_listing_id, v_feature_id);
  end loop;
end;
$$ language plpgsql security definer;

-- Grant execute permissions
grant execute on function manage_car_features(uuid, uuid, text[]) to authenticated;
grant execute on function manage_private_listing_features(uuid, uuid, text[]) to authenticated;

-- Insert default features for each brand
insert into features (brand_id, name)
select b.id, f.name
from brands b
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
on conflict (brand_id, name) do nothing;

-- Link existing cars to features
insert into car_features (car_id, feature_id)
select c.id, f.id
from cars c
cross join features f
where f.brand_id = c.brand_id
on conflict do nothing;

-- Link existing private listings to features
insert into private_listing_features (listing_id, feature_id)
select pl.id, f.id
from private_listings pl
cross join features f
where f.brand_id = pl.brand_id
and pl.status = 'pending'
on conflict do nothing;

-- Refresh schema cache
notify pgrst, 'reload schema';