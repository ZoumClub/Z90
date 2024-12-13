-- Drop existing function if it exists
drop function if exists confirm_user(uuid);

-- Create a more reliable version of the confirm_user function
create or replace function confirm_user(user_id uuid)
returns void as $$
begin
  -- Update user confirmation status
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

  -- Ensure the update was successful
  if not found then
    raise exception 'Failed to confirm user';
  end if;
end;
$$ language plpgsql security definer;

-- Grant execute permission to both anonymous and authenticated roles
grant execute on function confirm_user(uuid) to anon;
grant execute on function confirm_user(uuid) to authenticated;

-- Create an index on auth.users.id if it doesn't exist
create index if not exists idx_auth_users_id on auth.users(id);

-- Ensure admin policies are in place
create policy if not exists "Admins can do all operations"
  on profiles
  using (role = 'admin');

-- Update existing profiles table permissions
alter table profiles enable row level security;