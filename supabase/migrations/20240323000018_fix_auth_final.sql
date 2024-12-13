-- Drop existing policies and functions
drop policy if exists "Allow all operations" on profiles;

-- Create new policies that allow all operations for development
create policy "Allow insert for all"
  on profiles for insert
  with check (true);

create policy "Allow select for all"
  on profiles for select
  using (true);

create policy "Allow update for all"
  on profiles for update
  using (true);

create policy "Allow delete for all"
  on profiles for delete
  using (true);

-- Ensure RLS is enabled but with permissive policies
alter table profiles enable row level security;

-- Create function to automatically confirm new users
create or replace function auto_confirm_user()
returns trigger as $$
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
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to auto-confirm new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function auto_confirm_user();

-- Reset sequences and clean up any existing data
truncate table profiles restart identity cascade;