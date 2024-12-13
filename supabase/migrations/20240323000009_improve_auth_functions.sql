-- Drop existing function if it exists
drop function if exists confirm_user(uuid);

-- Recreate the function with better security and validation
create or replace function confirm_user(user_id uuid)
returns void as $$
declare
  user_exists boolean;
begin
  -- Check if user exists
  select exists(
    select 1 from auth.users where id = user_id
  ) into user_exists;

  if not user_exists then
    raise exception 'User not found';
  end if;

  -- Update user confirmation status
  update auth.users
  set 
    email_confirmed_at = now(),
    confirmed_at = now(),
    updated_at = now()
  where id = user_id;

  -- Ensure the update was successful
  if not found then
    raise exception 'Failed to confirm user';
  end if;
end;
$$ language plpgsql security definer;

-- Revoke all existing permissions
revoke all on function confirm_user(uuid) from public;
revoke all on function confirm_user(uuid) from anon;
revoke all on function confirm_user(uuid) from authenticated;

-- Grant execute permission only to authenticated users
grant execute on function confirm_user(uuid) to authenticated;

-- Create an index on auth.users.id for better performance
create index if not exists idx_auth_users_id on auth.users(id);