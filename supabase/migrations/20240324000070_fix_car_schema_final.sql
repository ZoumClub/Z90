-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Create trigger function to maintain make field
create or replace function update_car_make()
returns trigger as $$
begin
  new.make := (select name from brands where id = new.brand_id);
  return new;
end;
$$ language plpgsql;

-- Add make column to cars table
alter table cars 
add column if not exists make text;

-- Create trigger to update make
create trigger update_car_make_trigger
  before insert or update of brand_id on cars
  for each row
  execute function update_car_make();

-- Update existing cars
update cars c
set make = b.name
from brands b
where c.brand_id = b.id;

-- Create cars_with_brand view
create or replace view cars_with_brand as
select 
  c.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', cf.id,
          'name', cf.name,
          'available', cf.available
        )
      )
      from car_features cf
      where cf.car_id = c.id
    ),
    '[]'::jsonb
  ) as features
from cars c
join brands b on b.id = c.brand_id;

-- Create private_listings_with_brand view
create or replace view private_listings_with_brand as
select 
  pl.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', plf.id,
          'name', plf.name,
          'available', plf.available
        )
      )
      from private_listing_features plf
      where plf.listing_id = pl.id
    ),
    '[]'::jsonb
  ) as features
from private_listings pl
join brands b on b.id = pl.brand_id;

-- Create indexes for better performance
create index if not exists idx_cars_brand_id on cars(brand_id);
create index if not exists idx_cars_make on cars(make);
create index if not exists idx_private_listings_brand_id on private_listings(brand_id);

-- Enable RLS on views
alter view cars_with_brand owner to authenticated;
alter view private_listings_with_brand owner to authenticated;

-- Create RLS policies for views
create policy "Anyone can view cars"
  on cars_with_brand
  for select
  using (true);

create policy "Anyone can view private listings"
  on private_listings_with_brand
  for select
  using (true);

-- Refresh schema cache
notify pgrst, 'reload schema';