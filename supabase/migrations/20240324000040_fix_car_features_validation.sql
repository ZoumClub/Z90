-- Drop existing function
drop function if exists validate_car_features(jsonb);

-- Create improved function to validate features
create or replace function validate_car_features(features jsonb)
returns boolean as $$
begin
  -- Check if features is an array
  if features is null or jsonb_typeof(features) != 'array' then
    return false;
  end if;

  -- Check if each feature has required fields
  return not exists (
    select 1
    from jsonb_array_elements(features) as feature
    where not (
      feature ? 'name' and
      feature ? 'available' and
      (feature->>'name')::text is not null and
      (feature->>'available')::boolean is not null
    )
  );
end;
$$ language plpgsql immutable;

-- Drop and recreate the check constraint
alter table cars drop constraint if exists check_features_format;
alter table cars add constraint check_features_format
  check (features is null or validate_car_features(features));

-- Grant execute permission
grant execute on function validate_car_features(jsonb) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';