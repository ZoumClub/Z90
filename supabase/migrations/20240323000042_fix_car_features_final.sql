-- Drop existing function and table
drop function if exists manage_car_features(uuid, jsonb);
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

-- Create policies
create policy "Allow read access to car features"
  on car_features for select
  using (true);

create policy "Allow authenticated users to manage car features"
  on car_features for all
  using (true)
  with check (true);

-- Create function to manage car features
create or replace function manage_car_features(
  p_car_id uuid,
  p_features jsonb
) returns void as $$
declare
  v_car_exists boolean;
begin
  -- Verify car exists
  select exists(
    select 1 from cars where id = p_car_id
  ) into v_car_exists;

  if not v_car_exists then
    raise exception 'Car not found';
  end if;

  -- Delete existing features
  delete from car_features where car_id = p_car_id;
  
  -- Insert new features
  insert into car_features (car_id, name, available)
  select 
    p_car_id,
    feature->>'name',
    coalesce((feature->>'available')::boolean, true)
  from jsonb_array_elements(p_features) as feature;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function manage_car_features(uuid, jsonb) to authenticated;

-- Add sample features to existing cars
insert into car_features (car_id, name, available)
select 
  c.id as car_id,
  f.name,
  true as available
from cars c
cross join (
  values 
    ('Speed Regulator'),
    ('Air Condition'),
    ('Reversing Camera'),
    ('Reversing Radar'),
    ('GPS Navigation'),
    ('Park Assist'),
    'Start and Stop'),
    ('Airbag'),
    ('ABS'),
    ('Computer'),
    ('Rims'),
    ('Electric mirrors'),
    ('Electric windows'),
    ('Bluetooth')
) as f(name)
on conflict (car_id, name) do nothing;