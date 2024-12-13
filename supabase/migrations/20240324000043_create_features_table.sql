-- Create features table
create table features (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
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

create policy "Authenticated users can manage car features"
  on car_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage private listing features"
  on private_listing_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

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
  ('Bluetooth');

-- Create function to manage car features
create or replace function manage_car_features(
  p_car_id uuid,
  p_feature_names text[]
) returns void as $$
begin
  -- Delete existing features
  delete from car_features where car_id = p_car_id;
  
  -- Insert new features
  insert into car_features (car_id, feature_id)
  select p_car_id, f.id
  from features f
  where f.name = any(p_feature_names);
end;
$$ language plpgsql security definer;

-- Create function to manage private listing features
create or replace function manage_private_listing_features(
  p_listing_id uuid,
  p_feature_names text[]
) returns void as $$
begin
  -- Delete existing features
  delete from private_listing_features where listing_id = p_listing_id;
  
  -- Insert new features
  insert into private_listing_features (listing_id, feature_id)
  select p_listing_id, f.id
  from features f
  where f.name = any(p_feature_names);
end;
$$ language plpgsql security definer;

-- Grant execute permissions
grant execute on function manage_car_features(uuid, text[]) to authenticated;
grant execute on function manage_private_listing_features(uuid, text[]) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';