-- Drop existing functions to avoid conflicts
drop function if exists place_dealer_bid(uuid, uuid, numeric);
drop function if exists get_dealer_bid(uuid, uuid);
drop function if exists get_listing_bids(uuid);

-- Create function to get dealer bid
create or replace function get_dealer_bid(
  p_dealer_id uuid,
  p_listing_id uuid
) returns numeric as $$
  select amount
  from dealer_bids
  where dealer_id = p_dealer_id
  and listing_id = p_listing_id;
$$ language sql stable;

-- Create function to get listing bids
create or replace function get_listing_bids(p_listing_id uuid)
returns table (
  dealer_id uuid,
  dealer_name text,
  dealer_phone text,
  dealer_whatsapp text,
  amount numeric
) as $$
  select 
    d.id as dealer_id,
    d.name as dealer_name,
    d.phone as dealer_phone,
    d.whatsapp as dealer_whatsapp,
    db.amount
  from dealer_bids db
  join dealers d on d.id = db.dealer_id
  where db.listing_id = p_listing_id
  order by db.amount desc;
$$ language sql stable;

-- Create function to place or update bid
create or replace function place_dealer_bid(
  p_dealer_id uuid,
  p_listing_id uuid,
  p_amount numeric
) returns void as $$
declare
  v_listing private_listings;
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

  -- Insert or update bid
  insert into dealer_bids (dealer_id, listing_id, amount)
  values (p_dealer_id, p_listing_id, p_amount)
  on conflict (dealer_id, listing_id)
  do update set amount = excluded.amount;
end;
$$ language plpgsql security definer;

-- Create indexes for better performance
create index if not exists idx_dealer_bids_dealer_id on dealer_bids(dealer_id);
create index if not exists idx_dealer_bids_listing_id on dealer_bids(listing_id);
create index if not exists idx_dealer_bids_amount on dealer_bids(amount);

-- Grant execute permissions
grant execute on function get_dealer_bid(uuid, uuid) to authenticated;
grant execute on function get_listing_bids(uuid) to authenticated;
grant execute on function place_dealer_bid(uuid, uuid, numeric) to authenticated;

-- Create RLS policies
create policy "Dealers can view their own bids"
  on dealer_bids for select
  using (dealer_id = auth.uid()::uuid);

create policy "Dealers can place bids"
  on dealer_bids for insert
  with check (dealer_id = auth.uid()::uuid);

create policy "Dealers can update their own bids"
  on dealer_bids for update
  using (dealer_id = auth.uid()::uuid);

-- Refresh schema cache
notify pgrst, 'reload schema';