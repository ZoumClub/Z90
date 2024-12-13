-- Drop existing RLS policies
drop policy if exists "Cars are viewable by everyone" on cars;
drop policy if exists "Authenticated users can manage cars" on cars;

-- Create improved RLS policies for cars
create policy "Anyone can view cars"
  on cars for select
  using (true);

create policy "Dealers can manage their own cars"
  on cars for all
  using (
    auth.role() = 'authenticated' and 
    (
      dealer_id = auth.uid()::uuid or
      exists (
        select 1 from profiles
        where id = auth.uid()
        and role = 'admin'
      )
    )
  )
  with check (
    auth.role() = 'authenticated' and 
    (
      dealer_id = auth.uid()::uuid or
      exists (
        select 1 from profiles
        where id = auth.uid()
        and role = 'admin'
      )
    )
  );

-- Refresh schema cache
notify pgrst, 'reload schema';