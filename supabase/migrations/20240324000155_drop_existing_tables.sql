-- Drop existing tables if they exist
drop table if exists services cascade;
drop table if exists accessories cascade;

-- Drop existing triggers if they exist
drop trigger if exists update_services_timestamp on services;
drop trigger if exists update_accessories_timestamp on accessories;
drop function if exists update_updated_at_column();

-- Refresh schema cache
notify pgrst, 'reload schema';