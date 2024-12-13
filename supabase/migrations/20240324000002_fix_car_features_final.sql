-- Drop existing car_features table and related objects
drop table if exists car_features cascade;
drop function if exists manage_car_features(uuid, text[]);
drop function if exists update_car_features_timestamp();

-- Create car_features table with proper structure
create table car_features (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  name text not null,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_feature unique (car_id, name)
);

-- Create indexes
create index idx_car_features_car_id on car_features(car_id);
create index idx_car_features_name on car_features(name);
create index idx_car_features_available on car_features(available);

-- Enable RLS
alter table car_features enable row level security;

-- Create policies
create policy "Allow read access to car features"
  on car_features for select
  using (true);

create policy "Allow authenticated users to manage car features"
  on car_features for all
  using (true)
  with check (true);

-- Insert default features for existing cars
with default_features as (
  select unnest(array[
    'Speed Regulator',
    'Air Condition',
    'Reversing Camera',
    'Reversing Radar',
    'GPS Navigation',
    'Park Assist',
    'Start and Stop',
    'Airbag',
    'ABS',
    'Computer',
    'Rims',
    'Electric mirrors',
    'Electric windows',
    'Bluetooth'
  ]) as name
)
insert into car_features (car_id, name, available)
select c.id, df.name, true
from cars c
cross join default_features df
on conflict (car_id, name) do nothing;

-- Refresh schema cache
notify pgrst, 'reload schema';