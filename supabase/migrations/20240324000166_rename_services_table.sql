-- Drop existing views if any
drop view if exists public_services cascade;

-- Rename services table to main_services
alter table if exists services rename to main_services;

-- Rename indexes
alter index if exists idx_services_category rename to idx_main_services_category;
alter index if exists idx_services_available rename to idx_main_services_available;
alter index if exists idx_services_visible rename to idx_main_services_visible;

-- Drop old trigger
drop trigger if exists update_services_timestamp on main_services;

-- Create new trigger
create trigger update_main_services_timestamp
  before update on main_services
  for each row
  execute function update_updated_at_column();

-- Drop old RLS policies
drop policy if exists "Services are viewable by everyone" on main_services;

-- Create new RLS policies
create policy "Main services are viewable by everyone"
  on main_services for select
  using (visible = true);

-- Grant permissions
grant select on main_services to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';