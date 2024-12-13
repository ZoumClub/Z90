-- Create admin user
insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) values (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test@zooom.vip',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}',
  false,
  'authenticated'
);

-- Create admin profile
insert into profiles (
  id,
  username,
  role
)
select 
  id,
  email as username,
  'admin' as role
from auth.users
where email = 'test@zooom.vip';

-- Grant necessary permissions
grant usage on schema auth to postgres;
grant all on auth.users to postgres;
grant all on auth.refresh_tokens to postgres;

-- Refresh schema cache
notify pgrst, 'reload schema';