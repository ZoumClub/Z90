-- Drop existing function if it exists
drop function if exists manage_car_features(uuid, text[]);

-- Create improved car_features function
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