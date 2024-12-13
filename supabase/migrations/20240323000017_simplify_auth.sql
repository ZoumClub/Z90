-- Drop existing policies and triggers
drop policy if exists "Allow all operations for admins" on profiles;
drop policy if exists "Allow read access for everyone" on profiles;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

-- Create simplified policies
create policy "Allow all operations"
  on profiles for all
  using (true)
  with check (true);

-- Create indexes
create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_username on profiles(username);

-- Ensure RLS is enabled but with permissive policies for development
alter table profiles enable row level security;

-- Reset sequences and clean up any existing data
truncate table profiles restart identity cascade;