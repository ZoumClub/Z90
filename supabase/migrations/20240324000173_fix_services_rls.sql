```sql
-- Drop existing RLS policies
drop policy if exists "Services are viewable by everyone" on main_services;
drop policy if exists "Admins can manage services" on main_services;

-- Create new RLS policies
create policy "Public can view visible services"
  on main_services for select
  using (
    visible = true
    or
    auth.role() = 'authenticated'
  );

create policy "Authenticated users can manage services"
  on main_services for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Refresh schema cache
notify pgrst, 'reload schema';
```