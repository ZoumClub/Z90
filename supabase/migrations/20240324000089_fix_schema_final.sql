-- Drop existing views and functions
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;
drop function if exists get_dealer_bid cascade;
drop function if exists get_listing_bids cascade;
drop function if exists place_dealer_bid cascade;

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
        order by cf.name
      )
      filter (where cf.id is not null)
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
        order by plf.name
      )
      filter (where plf.id is not null)
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

-- Create function to get dealer bid
create or replace function get_dealer_bid(
  p_dealer_id uuid,
  p_listing_id uuid
) returns jsonb as $$
  select coalesce(
    jsonb_build_object(
      'id', db.id,
      'amount', db.amount,
      'dealer', jsonb_build_object(
        'id', d.id,
        'name', d.name,
        'phone', d.phone,
        'whatsapp', d.whatsapp
      )
    ),
    null::jsonb
  )
  from dealer_bids db
  join dealers d on d.id = db.dealer_id
  where db.dealer_id = p_dealer_id
  and db.listing_id = p_listing_id;
$$ language sql stable;

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

-- Create function to place or update bid
create or replace function place_dealer_bid(
  p_dealer_id uuid,
  p_listing_id uuid,
  p_amount numeric
) returns jsonb as $$
declare
  v_listing private_listings;
  v_existing_bid dealer_bids;
  v_result jsonb;
begin
  -- Check if listing exists and is approved
  select * into v_listing
  from private_listings
  where id = p_listing_id
  and status = 'approved'
  for update;

  if not found then
    raise exception 'Listing not found or not available for bidding';
  end if;

  -- Check for existing bid
  select * into v_existing_bid
  from dealer_bids
  where dealer_id = p_dealer_id
  and listing_id = p_listing_id;

  if found then
    -- Update existing bid
    update dealer_bids
    set amount = p_amount
    where id = v_existing_bid.id
    returning * into v_existing_bid;

    v_result := jsonb_build_object(
      'success', true,
      'message', 'Bid updated successfully',
      'bid', row_to_json(v_existing_bid)
    );
  else
    -- Insert new bid
    insert into dealer_bids (dealer_id, listing_id, amount)
    values (p_dealer_id, p_listing_id, p_amount)
    returning * into v_existing_bid;

    v_result := jsonb_build_object(
      'success', true,
      'message', 'Bid placed successfully',
      'bid', row_to_json(v_existing_bid)
    );
  end if;

  return v_result;
exception
  when others then
    return jsonb_build_object(
      'success', false,
      'message', SQLERRM
    );
end;
$$ language plpgsql security definer;

-- Create indexes for better performance
create index if not exists idx_cars_brand_id on cars(brand_id);
create index if not exists idx_cars_condition on cars(condition);
create index if not exists idx_cars_is_sold on cars(is_sold);
create index if not exists idx_cars_dealer_id on cars(dealer_id);
create index if not exists idx_car_features_car_id on car_features(car_id);
create index if not exists idx_private_listings_brand_id on private_listings(brand_id);
create index if not exists idx_private_listings_status on private_listings(status);
create index if not exists idx_dealer_bids_dealer_id on dealer_bids(dealer_id);
create index if not exists idx_dealer_bids_listing_id on dealer_bids(listing_id);

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all privileges on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

-- Grant access to views and functions
grant select on cars_with_brand to anon, authenticated;
grant select on private_listings_with_brand to anon, authenticated;
grant execute on function get_dealer_bid(uuid, uuid) to authenticated;
grant execute on function get_listing_bids(uuid) to authenticated;
grant execute on function place_dealer_bid(uuid, uuid, numeric) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';