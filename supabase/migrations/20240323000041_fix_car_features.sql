-- Drop existing function if it exists
drop function if exists manage_car_features(uuid, jsonb);

-- Create improved car_features function
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

exception
  when others then
    raise exception 'Failed to manage car features: %', sqlerrm;
end;
$$ language plpgsql security definer;

-- Revoke all existing permissions
revoke all on function manage_car_features(uuid, jsonb) from public;
revoke all on function manage_car_features(uuid, jsonb) from anon;
revoke all on function manage_car_features(uuid, jsonb) from authenticated;

-- Grant execute permission to authenticated users
grant execute on function manage_car_features(uuid, jsonb) to authenticated;

-- Ensure car_features table exists with proper structure
create table if not exists car_features (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  name text not null,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_car_feature unique (car_id, name)
);

-- Create indexes
create index if not exists idx_car_features_car_id on car_features(car_id);
create index if not exists idx_car_features_name on car_features(name);

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