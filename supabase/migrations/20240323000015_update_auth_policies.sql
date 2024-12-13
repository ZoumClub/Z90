-- Drop existing policies
drop policy if exists "Enable all operations for authenticated users" on profiles;

-- Create new, simpler policies
create policy "Allow all operations for own profile"
  on profiles for all
  using (auth.uid() = id);

create policy "Allow select for everyone"
  on profiles for select
  using (true);

-- Ensure indexes exist
create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_username on profiles(username);

-- Ensure RLS is enabled
alter table profiles enable row level security;