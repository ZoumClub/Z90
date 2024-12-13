-- Drop existing constraints and triggers
drop trigger if exists maintain_car_brand_consistency on cars;
drop trigger if exists maintain_private_listing_brand_consistency on private_listings;
drop function if exists maintain_brand_consistency();
drop type if exists mileage_range cascade;

-- Create mileage_range type
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

-- Modify cars table
alter table cars
  drop column if exists brand,
  alter column brand_id set not null,
  alter column make type text,
  alter column mileage type mileage_range using 'Under 1,000 km'::mileage_range,
  alter column mileage set not null,
  alter column mileage set default 'Under 1,000 km'::mileage_range;

-- Modify private_listings table
alter table private_listings
  alter column brand_id set not null,
  alter column make type text,
  alter column mileage type mileage_range using 'Under 1,000 km'::mileage_range,
  alter column mileage set not null,
  alter column mileage set default 'Under 1,000 km'::mileage_range;

-- Add foreign key constraints
alter table cars
  add constraint cars_brand_id_fkey 
  foreign key (brand_id) 
  references brands(id) 
  on delete restrict;

alter table private_listings
  add constraint private_listings_brand_id_fkey 
  foreign key (brand_id) 
  references brands(id) 
  on delete restrict;

-- Create function to maintain brand consistency
create or replace function maintain_brand_consistency()
returns trigger as $$
declare
  v_brand_name text;
begin
  -- Get brand name
  select name into v_brand_name
  from brands
  where id = new.brand_id;

  if not found then
    raise exception 'Invalid brand_id';
  end if;

  -- Set make to brand name
  new.make := v_brand_name;
  
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger maintain_car_brand_consistency
  before insert or update on cars
  for each row
  execute function maintain_brand_consistency();

create trigger maintain_private_listing_brand_consistency
  before insert or update on private_listings
  for each row
  execute function maintain_brand_consistency();

-- Update existing records
update cars c
set 
  make = b.name,
  mileage = 'Under 1,000 km'::mileage_range
from brands b
where c.brand_id = b.id;

update private_listings pl
set 
  make = b.name,
  mileage = 'Under 1,000 km'::mileage_range
from brands b
where pl.brand_id = b.id;

-- Create indexes
create index if not exists idx_cars_brand_id on cars(brand_id);
create index if not exists idx_private_listings_brand_id on private_listings(brand_id);
create index if not exists idx_cars_mileage on cars(mileage);
create index if not exists idx_private_listings_mileage on private_listings(mileage);

-- Create function to validate mileage
create or replace function validate_mileage(p_mileage text)
returns mileage_range as $$
begin
  return p_mileage::mileage_range;
exception
  when invalid_text_representation then
    return 'Under 1,000 km'::mileage_range;
end;
$$ language plpgsql;

-- Grant execute permissions
grant execute on function validate_mileage(text) to authenticated;
grant execute on function maintain_brand_consistency() to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';