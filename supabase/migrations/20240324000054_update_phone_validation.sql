-- Update phone number validation in private_listings table
alter table private_listings 
  drop constraint if exists private_listings_client_phone_check;

-- Add new constraint for 4-digit phone numbers
alter table private_listings
  add constraint private_listings_client_phone_check 
  check (client_phone ~ '^\d{4}$');

-- Update existing records to keep only last 4 digits
update private_listings
set client_phone = right(regexp_replace(client_phone, '[^0-9]', '', 'g'), 4)
where client_phone !~ '^\d{4}$';

-- Refresh schema cache
notify pgrst, 'reload schema';