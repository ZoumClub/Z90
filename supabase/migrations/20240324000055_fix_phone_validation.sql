-- Drop existing phone number constraint
alter table private_listings 
  drop constraint if exists private_listings_client_phone_check;

-- Add new constraint for exactly 4 digits
alter table private_listings
  add constraint private_listings_client_phone_check 
  check (client_phone ~ '^\d{4}$');

-- Update column comment to clarify purpose
comment on column private_listings.client_phone is 'Last 4 digits of phone number used for seller login';

-- Create function to validate phone number format
create or replace function validate_phone_digits(p_phone text)
returns boolean as $$
begin
  return p_phone ~ '^\d{4}$';
end;
$$ language plpgsql immutable;

-- Grant execute permission
grant execute on function validate_phone_digits(text) to authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';