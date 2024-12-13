-- Drop existing car_features table if it exists
drop table if exists car_features cascade;

-- Create car_features table
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

-- Enable RLS
alter table car_features enable row level security;

-- Create RLS policies
create policy "Car features are viewable by everyone"
  on car_features for select
  using (true);

create policy "Authenticated users can manage car features"
  on car_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Refresh schema cache
notify pgrst, 'reload schema';