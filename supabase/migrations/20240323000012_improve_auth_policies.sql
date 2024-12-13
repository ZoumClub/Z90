-- Drop existing function
drop function if exists confirm_user(uuid);

-- Create improved confirm_user function
create or replace function confirm_user(user_id uuid)
returns void as $$
begin
  -- Update user confirmation status with all necessary fields
  update auth.users
  set 
    email_confirmed_at = now(),
    confirmed_at = now(),
    updated_at = now(),
    raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object(
        'email_validated', true,
        'confirmed_at', extract(epoch from now()),
        'role', 'admin'
      )
  where id = user_id;

  if not found then
    raise exception 'User not found';
  end if;
end;
$$ language plpgsql security definer;

-- Grant execute permissions
grant execute on function confirm_user(uuid) to anon;
grant execute on function confirm_user(uuid) to authenticated;

-- Ensure proper RLS policies
alter table profiles enable row level security;

-- Drop existing policies
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can update their own profile" on profiles;

-- Create new policies
create policy "Admins have full access to profiles"
  on profiles for all
  using (auth.uid() in (
    select id from profiles where role = 'admin'
  ));

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

-- Create trigger to automatically confirm admin users
create or replace function handle_new_admin_user()
returns trigger as $$
begin
  if new.raw_user_meta_data->>'role' = 'admin' then
    update auth.users
    set 
      email_confirmed_at = now(),
      confirmed_at = now()
    where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger
drop trigger if exists on_admin_user_created on auth.users;
create trigger on_admin_user_created
  after insert on auth.users
  for each row
  execute function handle_new_admin_user();