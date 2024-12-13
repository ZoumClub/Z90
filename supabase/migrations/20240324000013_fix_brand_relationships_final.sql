-- Drop existing constraints and triggers
drop trigger if exists ensure_car_brand_consistency on cars;
drop trigger if exists ensure_private_listing_brand_consistency on private_listings;
drop function if exists ensure_brand_consistency();

-- Modify cars table
alter table cars
  drop constraint if exists cars_make_fkey,
  drop constraint if exists cars_brand_id_fkey,
  alter column make type text,
  alter column brand_id type uuid;

-- Modify private_listings table
alter table private_listings
  drop constraint if exists private_listings_make_fkey,
  drop constraint if exists private_listings_brand_id_fkey,
  alter column make type text,
  alter column brand_id type uuid;

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

-- Create improved brand consistency function
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
create trigger ensure_car_brand_consistency
  before insert or update on cars
  for each row
  execute function ensure_brand_consistency();

create trigger ensure_private_listing_brand_consistency
  before insert or update on private_listings
  for each row
  execute function ensure_brand_consistency();

-- Create function to get brand details
create or replace function get_brand_details(p_brand_id uuid)
returns jsonb as $$
  select jsonb_build_object(
    'id', id,
    'name', name,
    'logo_url', logo_url
  )
  from brands
  where id = p_brand_id;
$$ language sql stable;

-- Grant execute permissions
grant execute on function ensure_brand_consistency() to authenticated;
grant execute on function get_brand_details(uuid) to authenticated;

-- Update existing data to ensure consistency
update cars c
set make = b.name
from brands b
where c.brand_id = b.id;

update private_listings pl
set make = b.name
from brands b
where pl.brand_id = b.id;