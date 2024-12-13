-- Drop existing mileage_range type and recreate with proper validation
drop type if exists mileage_range cascade;

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

-- Update cars table
alter table cars alter column mileage type text;
update cars set mileage = 'Under 1,000 km' where mileage is null or mileage = '';
alter table cars alter column mileage type mileage_range using mileage::mileage_range;
alter table cars alter column mileage set default 'Under 1,000 km'::mileage_range;
alter table cars alter column mileage set not null;

-- Update private_listings table
alter table private_listings alter column mileage type text;
update private_listings set mileage = 'Under 1,000 km' where mileage is null or mileage = '';
alter table private_listings alter column mileage type mileage_range using mileage::mileage_range;
alter table private_listings alter column mileage set default 'Under 1,000 km'::mileage_range;
alter table private_listings alter column mileage set not null;

-- Create improved validation function
create or replace function validate_mileage_range(p_mileage text)
returns mileage_range as $$
begin
  if p_mileage is null or p_mileage = '' then
    return 'Under 1,000 km'::mileage_range;
  end if;
  
  return p_mileage::mileage_range;
exception
  when invalid_text_representation then
    return 'Under 1,000 km'::mileage_range;
end;
$$ language plpgsql security definer;

-- Grant execute permission
grant execute on function validate_mileage_range(text) to authenticated;

-- Create trigger function to ensure valid mileage
create or replace function ensure_valid_mileage()
returns trigger as $$
begin
  if new.mileage is null then
    new.mileage = 'Under 1,000 km'::mileage_range;
  end if;
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger ensure_car_mileage
  before insert or update on cars
  for each row
  execute function ensure_valid_mileage();

create trigger ensure_private_listing_mileage
  before insert or update on private_listings
  for each row
  execute function ensure_valid_mileage();