-- Drop existing policies
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Admins can insert profiles" on profiles;
drop policy if exists "Admins can delete profiles" on profiles;

-- Create simplified policies
create policy "Enable all operations for authenticated users"
  on profiles for all
  using (auth.uid() = id);

-- Create index for better performance
create index if not exists idx_profiles_role on profiles(role);

-- Ensure RLS is enabled
alter table profiles enable row level security;