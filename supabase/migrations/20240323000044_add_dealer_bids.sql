-- Create dealer_bids table
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
create index idx_dealer_bids_amount on dealer_bids(amount);

-- Enable RLS
alter table dealer_bids enable row level security;

-- Create policies
create policy "Dealers can view their own bids"
  on dealer_bids for select
  using (dealer_id = auth.uid()::uuid);

create policy "Dealers can insert bids"
  on dealer_bids for insert
  with check (dealer_id = auth.uid()::uuid);

create policy "Dealers can update their pending bids"
  on dealer_bids for update
  using (dealer_id = auth.uid()::uuid and status = 'pending');

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
    -- Update existing bid if it's still pending
    if v_existing_bid.status = 'pending' then
      update dealer_bids
      set 
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
      raise exception 'Cannot update bid with status: %', v_existing_bid.status;
    end if;
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