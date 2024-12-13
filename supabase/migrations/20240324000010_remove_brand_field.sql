-- Remove brand field and ensure make references brands
alter table cars drop column if exists brand;

-- Add foreign key constraint to make field
alter table cars drop constraint if exists cars_make_fkey;
alter table cars add constraint cars_make_fkey
  foreign key (make)
  references brands(name)
  on update cascade
  on delete restrict;

-- Add the same constraint to private_listings
alter table private_listings drop constraint if exists private_listings_make_fkey;
alter table private_listings add constraint private_listings_make_fkey
  foreign key (make)
  references brands(name)
  on update cascade
  on delete restrict;

-- Create function to get brand name
create or replace function get_brand_name(brand_id uuid)
returns text as $$
  select name from brands where id = brand_id;
$$ language sql stable;

-- Create trigger to automatically set make from brand_id
create or replace function set_make_from_brand()
returns trigger as $$
begin
  new.make := get_brand_name(new.brand_id);
  return new;
end;
$$ language plpgsql;

-- Create triggers for both tables
create trigger set_car_make
  before insert or update on cars
  for each row
  execute function set_make_from_brand();

create trigger set_private_listing_make
  before insert or update on private_listings
  for each row
  execute function set_make_from_brand();