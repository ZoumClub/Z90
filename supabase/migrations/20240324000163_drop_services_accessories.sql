-- Drop existing tables and triggers
drop table if exists services cascade;
drop table if exists accessories cascade;
drop trigger if exists update_services_timestamp on services;
drop trigger if exists update_accessories_timestamp on accessories;
drop function if exists update_updated_at_column() cascade;

-- Refresh schema cache
notify pgrst, 'reload schema';