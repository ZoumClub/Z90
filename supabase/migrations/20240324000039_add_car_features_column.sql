-- Add features column to cars table
alter table cars
add column if not exists features jsonb;

-- Create index for better performance
create index if not exists idx_cars_features on cars using gin(features);

-- Create function to validate features
create or replace function validate_car_features(features jsonb)
returns boolean as $$
begin
  -- Check if features is an array
  if not jsonb_typeof(features) = 'array' then
    return false;
  end if;

  -- Check if each feature has required fields
  return not exists (
    select 1
    from jsonb_array_elements(features) as feature
    where not (
      feature ? 'name' and
      feature ? 'available' and
      jsonb_typeof(feature->>'name') = 'string' and
      jsonb_typeof(feature->>'available') = 'boolean'
    )
  );
end;
$$ language plpgsql immutable;

-- Add check constraint
alter table cars
add constraint check_features_format
check (
  features is null or
  validate_car_features(features)
);

-- Create function to manage car features
create or replace function manage_car_features(
  p_car_id uuid,
  p_features jsonb
) returns void as $$
begin
  -- Validate features format
  if not validate_car_features(p_features) then
    raise exception 'Invalid features format';
  end if;

  -- Update car features
  update cars
  set 
    features = p_features,
    updated_at = now()
  where id = p_car_id;

  if not found then
    raise exception 'Car not found';
  end if;
end;
$$ language plpgsql;

-- Grant execute permissions
grant execute on function validate_car_features(jsonb) to authenticated;
grant execute on function manage_car_features(uuid, jsonb) to authenticated;

-- Migrate existing features to new column
with car_feature_json as (
  select 
    car_id,
    jsonb_agg(
      jsonb_build_object(
        'name', name,
        'available', available
      )
    ) as features
  from car_features
  group by car_id
)
update cars c
set features = cf.features
from car_feature_json cf
where c.id = cf.car_id;

-- Refresh schema cache
notify pgrst, 'reload schema';