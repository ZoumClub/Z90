-- Drop existing car_features table if it exists
drop table if exists car_features cascade;

-- Create car_features table
create table car_features (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  name text not null,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
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
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Create function to manage car features
create or replace function manage_car_features(
  p_car_id uuid,
  p_features text[]
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
    unnest(p_features),
    true;

exception
  when others then
    raise exception 'Failed to manage car features: %', sqlerrm;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function manage_car_features(uuid, text[]) to authenticated;

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

-- Create trigger to update updated_at
create or replace function update_car_features_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_car_features_timestamp
  before update on car_features
  for each row
  execute function update_car_features_timestamp();