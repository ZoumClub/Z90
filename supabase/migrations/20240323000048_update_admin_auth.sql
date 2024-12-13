-- Add admin_password to profiles table
alter table profiles add column if not exists admin_password text;

-- Create function to validate admin login
create or replace function validate_admin_login(p_admin_id uuid)
returns jsonb as $$
declare
  v_profile profiles;
begin
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

-- Create policy for admin authentication
create policy "Allow admin authentication"
  on profiles for select
  using (
    id = auth.uid()
    and role = 'admin'
  );