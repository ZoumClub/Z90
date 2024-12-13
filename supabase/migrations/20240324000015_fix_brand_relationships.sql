-- Drop existing constraints and triggers
drop trigger if exists ensure_car_brand_consistency on cars;
drop trigger if exists ensure_private_listing_brand_consistency on private_listings;
drop function if exists ensure_brand_consistency();

-- Remove make foreign key constraints
alter table cars drop constraint if exists cars_make_fkey;
alter table private_listings drop constraint if exists private_listings_make_fkey;

-- Modify cars table to only use brand_id
alter table cars
  alter column brand_id set not null,
  alter column make type text;

-- Modify private_listings table to only use brand_id
alter table private_listings
  alter column brand_id set not null,
  alter column make type text;

-- Create function to automatically set make from brand_id
create or replace function set_make_from_brand()
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

-- Create triggers to maintain consistency
create trigger set_car_make
  before insert or update on cars
  for each row
  execute function set_make_from_brand();

create trigger set_private_listing_make
  before insert or update on private_listings
  for each row
  execute function set_make_from_brand();

-- Update existing records to ensure consistency
update cars c
set make = b.name
from brands b
where c.brand_id = b.id;

update private_listings pl
set make = b.name
from brands b
where pl.brand_id = b.id;

-- Create indexes for better performance
create index if not exists idx_cars_brand_id on cars(brand_id);
create index if not exists idx_private_listings_brand_id on private_listings(brand_id);
create index if not exists idx_cars_make on cars(make);
create index if not exists idx_private_listings_make on private_listings(make);