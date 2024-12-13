-- Drop existing dealer_bids table and related objects
drop table if exists dealer_bids cascade;
drop function if exists place_dealer_bid(uuid, uuid, numeric, text);

-- Create improved dealer_bids table
create table dealer_bids (
  id uuid default gen_random_uuid() primary key,
  dealer_id uuid not null references dealers(id) on delete cascade,
  listing_id uuid not null references private_listings(id) on delete cascade,
  amount numeric not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_dealer_listing_bid unique (dealer_id, listing_id)
);

-- Create indexes
create index idx_dealer_bids_dealer_id on dealer_bids(dealer_id);
create index idx_dealer_bids_listing_id on dealer_bids(listing_id);
create index idx_dealer_bids_status on dealer_bids(status);
create index idx_dealer_bids_created_at on dealer_bids(created_at desc);

-- Add is_active column to dealers table if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'dealers'
    and column_name = 'is_active'
  ) then
    alter table dealers add column is_active boolean not null default true;
    create index idx_dealers_is_active on dealers(is_active);
  end if;
end $$;

-- Enable RLS
alter table dealer_bids enable row level security;

-- Create policies
create policy "Allow read access to dealer bids"
  on dealer_bids for select
  using (true);

create policy "Allow dealers to place bids"
  on dealer_bids for insert
  with check (
    exists (
      select 1 from dealers
      where id = dealer_id
      and is_active = true
    )
  );

-- Create function to place or update bid
create or replace function place_dealer_bid(
  p_dealer_id uuid,
  p_listing_id uuid,
  p_amount numeric,
  p_notes text default null
) returns jsonb as $$
declare
  v_listing private_listings;
  v_existing_bid dealer_bids;
  v_dealer dealers;
  v_result jsonb;
begin
  -- Check if dealer exists and is active
  select * into v_dealer
  from dealers
  where id = p_dealer_id
  and is_active = true;

  if not found then
    raise exception 'Invalid or inactive dealer';
  end if;

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
    if v_existing_bid.status != 'pending' then
      raise exception 'Cannot update bid with status: %', v_existing_bid.status;
    end if;

    -- Update existing bid
    update dealer_bids set
      amount = p_amount,
      notes = coalesce(p_notes, notes),
      updated_at = now()
    where id = v_existing_bid.id
    returning * into v_existing_bid;

    v_result := jsonb_build_object(
      'success', true,
      'message', 'Bid updated successfully',
      'bid', row_to_json(v_existing_bid)
    );
  else
    -- Insert new bid
    insert into dealer_bids (dealer_id, listing_id, amount, notes)
    values (p_dealer_id, p_listing_id, p_amount, p_notes)
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

-- Grant execute permission to authenticated users
grant execute on function place_dealer_bid(uuid, uuid, numeric, text) to authenticated;

-- Create function to get dealer bids
create or replace function get_dealer_bids(p_dealer_id uuid)
returns table (
  bid_id uuid,
  listing_id uuid,
  amount numeric,
  status text,
  notes text,
  created_at timestamp with time zone,
  listing jsonb
) as $$
begin
  return query
  select 
    db.id as bid_id,
    db.listing_id,
    db.amount,
    db.status,
    db.notes,
    db.created_at,
    row_to_json(pl.*)::jsonb as listing
  from dealer_bids db
  join private_listings pl on pl.id = db.listing_id
  where db.dealer_id = p_dealer_id
  order by db.created_at desc;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function get_dealer_bids(uuid) to authenticated;