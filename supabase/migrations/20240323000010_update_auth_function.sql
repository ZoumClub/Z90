-- Drop existing function if it exists
drop function if exists confirm_user(uuid);

-- Create a more permissive version of the confirm_user function for demo purposes
create or replace function confirm_user(user_id uuid)
returns void as $$
begin
  -- Update user confirmation status
  update auth.users
  set 
    email_confirmed_at = now(),
    confirmed_at = now(),
    updated_at = now(),
    raw_user_meta_data = raw_user_meta_data || jsonb_build_object('email_validated', true)
  where id = user_id;
end;
$$ language plpgsql security definer;

-- Grant execute permission to the anonymous role for demo purposes
grant execute on function confirm_user(uuid) to anon;
grant execute on function confirm_user(uuid) to authenticated;

-- Create an index on auth.users.id for better performance
create index if not exists idx_auth_users_id on auth.users(id);