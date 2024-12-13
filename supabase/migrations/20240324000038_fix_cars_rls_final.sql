-- Drop existing RLS policies
drop policy if exists "Anyone can view cars" on cars;
drop policy if exists "Dealers can manage their own cars" on cars;

-- Create improved RLS policies for cars
create policy "Anyone can view cars"
  on cars for select
  using (true);

create policy "Admins can manage all cars"
  on cars for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Dealers can manage their own cars"
  on cars for all
  using (
    auth.role() = 'authenticated' and 
    dealer_id = auth.uid()::uuid
  )
  with check (
    auth.role() = 'authenticated' and 
    dealer_id = auth.uid()::uuid
  );

-- Create policy for car features
create policy "Anyone can manage car features"
  on car_features for all
  using (true)
  with check (true);

-- Refresh schema cache
notify pgrst, 'reload schema';