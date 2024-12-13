-- First, create the mileage_range type if it doesn't exist
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

-- Add mileage column to cars table if it doesn't exist
do $$ begin
  if not exists (
    select 1 
    from information_schema.columns 
    where table_name = 'cars' and column_name = 'mileage'
  ) then
    alter table cars add column mileage mileage_range default 'Under 1,000 km'::mileage_range not null;
  end if;
end $$;

-- Add mileage column to private_listings table if it doesn't exist
do $$ begin
  if not exists (
    select 1 
    from information_schema.columns 
    where table_name = 'private_listings' and column_name = 'mileage'
  ) then
    alter table private_listings add column mileage mileage_range default 'Under 1,000 km'::mileage_range not null;
  end if;
end $$;

-- Create function to validate mileage
create or replace function validate_mileage(p_mileage text)
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
$$ language plpgsql;

-- Grant execute permission
grant execute on function validate_mileage(text) to authenticated;

-- Create indexes for better performance
create index if not exists idx_cars_mileage on cars(mileage);
create index if not exists idx_private_listings_mileage on private_listings(mileage);

-- Update any existing records with null mileage
update cars 
set mileage = 'Under 1,000 km'::mileage_range 
where mileage is null;

update private_listings 
set mileage = 'Under 1,000 km'::mileage_range 
where mileage is null;

-- Refresh schema cache
notify pgrst, 'reload schema';