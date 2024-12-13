-- Drop existing constraints
alter table cars drop constraint if exists check_mileage_range;
alter table private_listings drop constraint if exists check_mileage_range;

-- Create type for mileage ranges
do $$ begin
  create type mileage_range as enum (
    'Under 1,000 km',
    '1,000 - 5,000 km',
    '5,000 - 10,000 km',
    '10,000 - 20,000 km',
    '20,000 - 30,000 km',
    '30,000 - 50,000 km',
    '50,000 - 75,000 km',
    '75,000 - 100,000 km',
    '100,000 - 150,000 km',
    'Over 150,000 km'
  );
exception
  when duplicate_object then null;
end $$;

-- Update columns to use the new type
alter table cars 
  alter column mileage type mileage_range 
  using mileage::mileage_range;

alter table private_listings 
  alter column mileage type mileage_range 
  using mileage::mileage_range;

-- Set default values for empty mileage
update cars 
set mileage = 'Under 1,000 km'::mileage_range 
where mileage is null;

update private_listings 
set mileage = 'Under 1,000 km'::mileage_range 
where mileage is null;

-- Make mileage required
alter table cars 
  alter column mileage set not null;

alter table private_listings 
  alter column mileage set not null;

-- Create function to validate mileage range
create or replace function validate_mileage_range(p_mileage text)
returns mileage_range as $$
begin
  return p_mileage::mileage_range;
exception
  when invalid_text_representation then
    raise exception 'Invalid mileage range. Please select a valid range.';
end;
$$ language plpgsql;

-- Grant execute permission
grant execute on function validate_mileage_range(text) to authenticated;