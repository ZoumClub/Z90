-- Update existing cars to use km ranges
update cars
set mileage = case
  when mileage is null or mileage = '' then 'Under 1,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 1000 then 'Under 1,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 5000 then '1,000 - 5,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 10000 then '5,000 - 10,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 20000 then '10,000 - 20,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 30000 then '20,000 - 30,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 50000 then '30,000 - 50,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 75000 then '50,000 - 75,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 100000 then '75,000 - 100,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 150000 then '100,000 - 150,000 km'
  else 'Over 150,000 km'
end;

-- Update private listings to use km ranges
update private_listings
set mileage = case
  when mileage is null or mileage = '' then 'Under 1,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 1000 then 'Under 1,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 5000 then '1,000 - 5,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 10000 then '5,000 - 10,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 20000 then '10,000 - 20,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 30000 then '20,000 - 30,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 50000 then '30,000 - 50,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 75000 then '50,000 - 75,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 100000 then '75,000 - 100,000 km'
  when cast(regexp_replace(mileage, '[^0-9]', '', 'g') as integer) < 150000 then '100,000 - 150,000 km'
  else 'Over 150,000 km'
end;

-- Add check constraint to ensure valid mileage ranges
alter table cars drop constraint if exists check_mileage_range;
alter table cars add constraint check_mileage_range check (
  mileage in (
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
  )
);

alter table private_listings drop constraint if exists check_mileage_range;
alter table private_listings add constraint check_mileage_range check (
  mileage in (
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
  )
);