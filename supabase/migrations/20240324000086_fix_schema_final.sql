-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Create materialized view for cars with brand info
create materialized view cars_with_brand as
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

-- Create materialized view for private listings with brand info
create materialized view private_listings_with_brand as
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

-- Create indexes on materialized views
create unique index idx_cars_with_brand_id on cars_with_brand(id);
create index idx_cars_with_brand_brand_id on cars_with_brand(brand_id);
create index idx_cars_with_brand_condition on cars_with_brand(condition);
create index idx_cars_with_brand_is_sold on cars_with_brand(is_sold);

create unique index idx_private_listings_with_brand_id on private_listings_with_brand(id);
create index idx_private_listings_with_brand_brand_id on private_listings_with_brand(brand_id);
create index idx_private_listings_with_brand_status on private_listings_with_brand(status);

-- Create function to refresh materialized views
create or replace function refresh_materialized_views()
returns void as $$
begin
  refresh materialized view concurrently cars_with_brand;
  refresh materialized view concurrently private_listings_with_brand;
end;
$$ language plpgsql;

-- Create triggers to refresh views when data changes
create or replace function refresh_views_on_change()
returns trigger as $$
begin
  perform refresh_materialized_views();
  return null;
end;
$$ language plpgsql;

create trigger refresh_cars_view
after insert or update or delete on cars
for each statement execute function refresh_views_on_change();

create trigger refresh_private_listings_view
after insert or update or delete on private_listings
for each statement execute function refresh_views_on_change();

create trigger refresh_dealer_bids_view
after insert or update or delete on dealer_bids
for each statement execute function refresh_views_on_change();

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all privileges on all tables in schema public to authenticated;
grant select on cars_with_brand to anon, authenticated;
grant select on private_listings_with_brand to anon, authenticated;
grant execute on function refresh_materialized_views() to authenticated;

-- Do initial refresh of materialized views
select refresh_materialized_views();

-- Refresh schema cache
notify pgrst, 'reload schema';