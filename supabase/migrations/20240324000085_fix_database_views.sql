-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

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
          'name', cf.name,
          'available', cf.available
        )
        order by cf.name
      )
      filter (where cf.name is not null)
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
          'name', plf.name,
          'available', plf.available
        )
        order by plf.name
      )
      filter (where plf.name is not null)
      from private_listing_features plf
      where plf.listing_id = pl.id
    ),
    '[]'::jsonb
  ) as features,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', db.id,
          'amount', db.amount,
          'dealer', jsonb_build_object(
            'id', d.id,
            'name', d.name,
            'phone', d.phone,
            'whatsapp', d.whatsapp
          )
        )
        order by db.amount desc
      )
      filter (where db.id is not null)
      from dealer_bids db
      join dealers d on d.id = db.dealer_id
      where db.listing_id = pl.id
    ),
    '[]'::jsonb
  ) as bids
from private_listings pl
join brands b on b.id = pl.brand_id;

-- Create function to get listing bids
create or replace function get_listing_bids(p_listing_id uuid)
returns jsonb as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', db.id,
        'amount', db.amount,
        'dealer', jsonb_build_object(
          'id', d.id,
          'name', d.name,
          'phone', d.phone,
          'whatsapp', d.whatsapp
        )
      )
      order by db.amount desc
    ),
    '[]'::jsonb
  )
  from dealer_bids db
  join dealers d on d.id = db.dealer_id
  where db.listing_id = p_listing_id;
$$ language sql stable;

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all privileges on all tables in schema public to authenticated;
grant select on cars_with_brand to anon, authenticated;
grant select on private_listings_with_brand to anon, authenticated;
grant execute on function get_listing_bids(uuid) to authenticated;

-- Create indexes for better performance
create index if not exists idx_cars_brand_id on cars(brand_id);
create index if not exists idx_private_listings_brand_id on private_listings(brand_id);
create index if not exists idx_dealer_bids_listing_id on dealer_bids(listing_id);
create index if not exists idx_dealer_bids_dealer_id on dealer_bids(dealer_id);

-- Refresh schema cache
notify pgrst, 'reload schema';