-- Add missing columns to cars table if they don't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'cars' and column_name = 'brand') then
    alter table cars add column brand jsonb;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'cars' and column_name = 'features') then
    alter table cars add column features jsonb;
  end if;
end $$;

-- Create or replace function to manage car features with proper schema
create or replace function manage_car_features(
  p_car_id uuid,
  p_features jsonb
) returns void as $$
begin
  -- Update car features
  update cars
  set features = p_features,
      updated_at = now()
  where id = p_car_id;

  if not found then
    raise exception 'Car not found';
  end if;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function manage_car_features(uuid, jsonb) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';