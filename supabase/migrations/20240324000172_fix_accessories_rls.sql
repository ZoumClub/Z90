-- Drop existing RLS policies
drop policy if exists "Accessories are viewable by everyone" on accessories;
drop policy if exists "Admins can manage accessories" on accessories;

-- Create new RLS policies
create policy "Public can view visible accessories"
  on accessories for select
  using (
    visible = true
    or
    auth.role() = 'authenticated'
  );

create policy "Authenticated users can manage accessories"
  on accessories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Refresh schema cache
notify pgrst, 'reload schema';