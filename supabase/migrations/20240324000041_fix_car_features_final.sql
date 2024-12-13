-- Drop existing functions and constraints
drop function if exists validate_car_features(jsonb);
drop function if exists manage_car_features(uuid, jsonb);
alter table cars drop constraint if exists check_features_format;

-- Create type for car feature
create type car_feature as (
  name text,
  available boolean
);

-- Create improved function to validate features
create or replace function validate_car_features(features jsonb)
returns boolean as $$
begin
  -- Allow null features
  if features is null then
    return true;
  end if;

  -- Check if features is an array
  if jsonb_typeof(features) != 'array' then
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
$$ language plpgsql security definer;

-- Add check constraint
alter table cars add constraint check_features_format
  check (validate_car_features(features));

-- Create index for better performance
create index if not exists idx_cars_features on cars using gin(features);

-- Grant execute permissions
grant execute on function validate_car_features(jsonb) to authenticated;
grant execute on function manage_car_features(uuid, jsonb) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';