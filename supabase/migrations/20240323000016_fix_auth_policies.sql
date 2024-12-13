-- Drop existing policies
drop policy if exists "Allow all operations for own profile" on profiles;
drop policy if exists "Allow select for everyone" on profiles;

-- Create new policies
create policy "Allow all operations for admins"
  on profiles for all
  using (
    exists (
      select 1
      from auth.users
      where auth.users.id = auth.uid()
      and (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );

create policy "Allow read access for everyone"
  on profiles for select
  using (true);

-- Create function to handle new user creation
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::text, 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Ensure indexes exist
create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_username on profiles(username);
create index if not exists idx_auth_users_meta on auth.users using gin (raw_user_meta_data);

-- Ensure RLS is enabled
alter table profiles enable row level security;