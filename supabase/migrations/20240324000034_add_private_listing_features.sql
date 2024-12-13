-- Create private_listing_features table
create table private_listing_features (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid not null references private_listings(id) on delete cascade,
  name text not null,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_listing_feature unique (listing_id, name)
);

-- Create indexes
create index idx_private_listing_features_listing_id on private_listing_features(listing_id);
create index idx_private_listing_features_name on private_listing_features(name);

-- Enable RLS
alter table private_listing_features enable row level security;

-- Create RLS policies
create policy "Private listing features are viewable by everyone"
  on private_listing_features for select
  using (true);

create policy "Anyone can insert private listing features"
  on private_listing_features for insert
  with check (true);

-- Create function to manage private listing features
create or replace function manage_private_listing_features(
  p_listing_id uuid,
  p_features text[]
) returns void as $$
begin
  -- Delete existing features
  delete from private_listing_features where listing_id = p_listing_id;
  
  -- Insert new features
  insert into private_listing_features (listing_id, name, available)
  select p_listing_id, unnest(p_features), true;
end;
$$ language plpgsql security definer;

-- Grant execute permission
grant execute on function manage_private_listing_features(uuid, text[]) to authenticated;

-- Create function to process private listing with features
create or replace function process_private_listing(
  p_listing_id uuid,
  p_status text,
  p_features text[] default null
) returns jsonb as $$
declare
  v_listing private_listings;
  v_car_id uuid;
  v_result jsonb;
begin
  -- Validate status
  if p_status not in ('approved', 'rejected') then
    raise exception 'Invalid status. Must be either approved or rejected.';
  end if;

  -- Get and lock the listing
  select * into v_listing
  from private_listings
  where id = p_listing_id
  for update;

  if not found then
    raise exception 'Listing not found';
  end if;

  if v_listing.status != 'pending' then
    raise exception 'Listing has already been processed';
  end if;

  -- Update listing status
  update private_listings
  set 
    status = p_status,
    updated_at = now()
  where id = p_listing_id
  returning * into v_listing;

  -- If features are provided, manage them
  if p_features is not null then
    perform manage_private_listing_features(p_listing_id, p_features);
  end if;

  -- If approved, create car listing
  if p_status = 'approved' then
    insert into cars (
      brand_id, make, model, year, price, image,
      video_url, condition, mileage, fuel_type,
      transmission, body_type, exterior_color,
      interior_color, number_of_owners, savings,
      is_sold
    )
    values (
      v_listing.brand_id, v_listing.make, v_listing.model,
      v_listing.year, v_listing.price, v_listing.image,
      v_listing.video_url, v_listing.condition, v_listing.mileage,
      v_listing.fuel_type, v_listing.transmission, v_listing.body_type,
      v_listing.exterior_color, v_listing.interior_color,
      v_listing.number_of_owners, floor(v_listing.price * 0.1),
      false
    )
    returning id into v_car_id;

    -- Copy features to car if they exist
    insert into car_features (car_id, name, available)
    select v_car_id, name, available
    from private_listing_features
    where listing_id = p_listing_id;
  end if;

  -- Prepare result
  v_result := jsonb_build_object(
    'success', true,
    'listing_id', p_listing_id,
    'car_id', v_car_id,
    'status', p_status
  );

  return v_result;
exception
  when others then
    -- Roll back any changes and re-raise the error
    raise exception '%', sqlerrm;
end;
$$ language plpgsql security definer;

-- Grant execute permission
grant execute on function process_private_listing(uuid, text, text[]) to authenticated;