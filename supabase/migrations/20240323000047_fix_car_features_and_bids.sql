-- Drop existing car_features function and recreate with proper structure
drop function if exists manage_car_features(uuid, jsonb[]);

create or replace function manage_car_features(
  p_car_id uuid,
  p_features text[]
) returns void as $$
begin
  -- Delete existing features
  delete from car_features where car_id = p_car_id;
  
  -- Insert new features
  insert into car_features (car_id, name, available)
  select 
    p_car_id,
    feature,
    true
  from unnest(p_features) as feature;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function manage_car_features(uuid, text[]) to authenticated;

-- Add highest_bid column to private_listings
alter table private_listings 
add column if not exists highest_bid numeric;

-- Create function to update highest bid
create or replace function update_highest_bid()
returns trigger as $$
begin
  update private_listings
  set highest_bid = (
    select max(amount)
    from dealer_bids
    where listing_id = NEW.listing_id
    and status = 'pending'
  )
  where id = NEW.listing_id;
  return NEW;
end;
$$ language plpgsql;

-- Create trigger for updating highest bid
drop trigger if exists update_highest_bid_trigger on dealer_bids;
create trigger update_highest_bid_trigger
  after insert or update or delete on dealer_bids
  for each row
  execute function update_highest_bid();