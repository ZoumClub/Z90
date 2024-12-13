```sql
-- Drop existing function
drop function if exists process_private_listing(uuid, text);

-- Create improved process_private_listing function
create or replace function process_private_listing(
  p_listing_id uuid,
  p_status text
) returns jsonb as $$
declare
  v_listing private_listings;
  v_result jsonb;
begin
  -- Validate status
  if p_status not in ('approved', 'rejected') then
    return jsonb_build_object(
      'success', false,
      'message', 'Invalid status. Must be either approved or rejected.'
    );
  end if;

  -- Get and lock the listing
  select * into v_listing
  from private_listings
  where id = p_listing_id
  for update;

  if not found then
    return jsonb_build_object(
      'success', false,
      'message', 'Listing not found'
    );
  end if;

  if v_listing.status != 'pending' then
    return jsonb_build_object(
      'success', false,
      'message', 'Listing has already been processed'
    );
  end if;

  -- Update listing status
  update private_listings
  set 
    status = p_status,
    updated_at = now()
  where id = p_listing_id;

  -- Prepare result
  return jsonb_build_object(
    'success', true,
    'listing_id', p_listing_id,
    'status', p_status
  );
exception
  when others then
    return jsonb_build_object(
      'success', false,
      'message', SQLERRM
    );
end;
$$ language plpgsql security definer;

-- Grant execute permission
grant execute on function process_private_listing(uuid, text) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';
```