-- Drop existing admin auth related objects
drop function if exists validate_admin_login(uuid);

-- Create simplified admin validation function
create or replace function validate_admin_login(p_admin_id uuid)
returns jsonb as $$
declare
  v_profile profiles;
begin
  -- Check if admin exists
  select * into v_profile
  from profiles
  where id = p_admin_id
  and role = 'admin';

  if not found then
    return jsonb_build_object(
      'success', false,
      'message', 'Invalid admin ID'
    );
  end if;

  return jsonb_build_object(
    'success', true,
    'profile', row_to_json(v_profile)
  );
end;
$$ language plpgsql security definer;

-- Grant execute permission to anonymous users
grant execute on function validate_admin_login(uuid) to anon;

-- Create policy for admin access
create policy "Allow admin access"
  on profiles for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );