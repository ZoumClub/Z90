-- Drop existing constraints and triggers
drop trigger if exists set_car_make on cars;
drop trigger if exists set_private_listing_make on private_listings;
drop function if exists set_make_from_brand();

-- Modify tables to ensure brand_id is the single source of truth
alter table cars
  drop constraint if exists cars_make_fkey,
  alter column brand_id set not null,
  alter column make drop not null;

alter table private_listings
  drop constraint if exists private_listings_make_fkey,
  alter column brand_id set not null,
  alter column make drop not null;

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
set make = b.name
from brands b
where c.brand_id = b.id;

update private_listings pl
set make = b.name
from brands b
where pl.brand_id = b.id;

-- Create indexes
create index if not exists idx_cars_brand_id on cars(brand_id);
create index if not exists idx_private_listings_brand_id on private_listings(brand_id);
create index if not exists idx_cars_make on cars(make);
create index if not exists idx_private_listings_make on private_listings(make);

-- Refresh schema cache
notify pgrst, 'reload schema';