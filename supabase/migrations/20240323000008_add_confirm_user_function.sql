-- Function to confirm a user (for demo purposes only)
create or replace function confirm_user(user_id uuid)
returns void as $$
begin
  update auth.users
  set email_confirmed_at = now(),
      confirmed_at = now()
  where id = user_id;
end;
$$ language plpgsql security definer;

-- Grant execute permission to the anonymous role
grant execute on function confirm_user(uuid) to anon;