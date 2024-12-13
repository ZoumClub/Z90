-- Drop existing constraints
alter table cars drop constraint if exists cars_make_fkey;
alter table private_listings drop constraint if exists private_listings_make_fkey;

-- Update brands table data to ensure consistency
update brands
set name = case name
  when 'Mercedes-Benz' then 'Mercedes'
  else name
end;

-- Update cars and private_listings to match brand names
update cars
set make = (
  select name 
  from brands 
  where brands.id = cars.brand_id
);

update private_listings
set make = (
  select name 
  from brands 
  where brands.id = private_listings.brand_id
);

-- Re-add foreign key constraints
alter table cars add constraint cars_make_fkey
  foreign key (make)
  references brands(name)
  on update cascade
  on delete restrict;

alter table private_listings add constraint private_listings_make_fkey
  foreign key (make)
  references brands(name)
  on update cascade
  on delete restrict;

-- Create function to ensure brand_id and make consistency
create or replace function ensure_brand_consistency()
returns trigger as $$
declare
  v_brand_name text;
begin
  -- Get brand name from brand_id
  select name into v_brand_name
  from brands
  where id = new.brand_id;

  if not found then
    raise exception 'Invalid brand_id';
  end if;

  -- Set make to match brand name
  new.make := v_brand_name;
  
  return new;
end;
$$ language plpgsql;

-- Create triggers
drop trigger if exists ensure_car_brand_consistency on cars;
create trigger ensure_car_brand_consistency
  before insert or update on cars
  for each row
  execute function ensure_brand_consistency();

drop trigger if exists ensure_private_listing_brand_consistency on private_listings;
create trigger ensure_private_listing_brand_consistency
  before insert or update on private_listings
  for each row
  execute function ensure_brand_consistency();