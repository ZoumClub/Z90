-- Drop existing views
drop view if exists cars_with_brand cascade;
drop view if exists private_listings_with_brand cascade;

-- Create dealer_bids table if it doesn't exist
create table if not exists dealer_bids (
  id uuid default gen_random_uuid() primary key,
  dealer_id uuid not null references dealers(id) on delete cascade,
  listing_id uuid not null references private_listings(id) on delete cascade,
  amount numeric not null check (amount > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_dealer_listing_bid unique (dealer_id, listing_id)
);

-- Create indexes
create index if not exists idx_dealer_bids_dealer_id on dealer_bids(dealer_id);
create index if not exists idx_dealer_bids_listing_id on dealer_bids(listing_id);
create index if not exists idx_dealer_bids_amount on dealer_bids(amount);

-- Enable RLS
alter table dealer_bids enable row level security;

-- Create RLS policies
create policy "Dealers can view their own bids"
  on dealer_bids for select
  using (dealer_id = auth.uid()::uuid);

create policy "Anyone can view bids for their listings"
  on dealer_bids for select
  using (
    listing_id in (
      select id from private_listings
      where client_phone = current_setting('request.jwt.claims')::json->>'phone'
    )
  );

create policy "Dealers can place bids"
  on dealer_bids for insert
  with check (dealer_id = auth.uid()::uuid);

-- Create private_listings_with_brand view
create view private_listings_with_brand as
select 
  pl.*,
  b.name as brand_name,
  b.logo_url as brand_logo_url,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'name', f.name,
          'available', plf.available
        )
        order by f.name
      )
      filter (where f.name is not null)
      from private_listing_features plf
      join features f on f.id = plf.feature_id
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

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all privileges on all tables in schema public to authenticated;
grant execute on function place_dealer_bid(uuid, uuid, numeric) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';