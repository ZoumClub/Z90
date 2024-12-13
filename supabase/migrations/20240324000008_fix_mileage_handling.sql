-- Drop existing mileage_range type and recreate with proper values
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
update cars set mileage = 'Under 1,000 km' where mileage = 'N/A' or mileage is null;
alter table cars alter column mileage type mileage_range using mileage::mileage_range;
alter table cars alter column mileage set not null;

-- Update private_listings table
alter table private_listings alter column mileage type text;
update private_listings set mileage = 'Under 1,000 km' where mileage = 'N/A' or mileage is null;
alter table private_listings alter column mileage type mileage_range using mileage::mileage_range;
alter table private_listings alter column mileage set not null;

-- Create function to handle mileage validation
create or replace function validate_mileage_range(p_mileage text)
returns mileage_range as $$
begin
  if p_mileage = 'N/A' then
    return 'Under 1,000 km'::mileage_range;
  end if;
  return p_mileage::mileage_range;
exception
  when invalid_text_representation then
    return 'Under 1,000 km'::mileage_range;
end;
$$ language plpgsql;

-- Grant execute permission
grant execute on function validate_mileage_range(text) to authenticated;