-- Drop existing policies and functions
drop policy if exists "Admins have full access to profiles" on profiles;
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop function if exists confirm_user(uuid);
drop function if exists handle_new_admin_user();
drop trigger if exists on_admin_user_created on auth.users;

-- Create a simpler confirm_user function
create or replace function confirm_user(user_id uuid)
returns void as $$
begin
  update auth.users
  set 
    email_confirmed_at = now(),
    confirmed_at = now(),
    updated_at = now(),
    raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object(
        'email_validated', true,
        'confirmed_at', extract(epoch from now())
      )
  where id = user_id;
end;
$$ language plpgsql security definer;

-- Grant execute permissions
grant execute on function confirm_user(uuid) to anon;
grant execute on function confirm_user(uuid) to authenticated;

-- Create simpler, non-recursive policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Admins can insert profiles"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Admins can delete profiles"
  on profiles for delete
  using (auth.uid() = id);

-- Create index for better performance
create index if not exists idx_profiles_role on profiles(role);