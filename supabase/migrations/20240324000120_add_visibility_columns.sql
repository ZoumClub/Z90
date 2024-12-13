-- Add visible column to accessories if it doesn't exist
alter table accessories 
add column if not exists visible boolean not null default true;

-- Add visible column to services if it doesn't exist
alter table services 
add column if not exists visible boolean not null default true;

-- Create indexes for better performance
create index if not exists idx_accessories_visible on accessories(visible);
create index if not exists idx_services_visible on services(visible);

-- Create RLS policies for visibility
create policy "Show only visible accessories on main page"
  on accessories for select
  using (
    visible = true or 
    auth.role() = 'authenticated'
  );

create policy "Show only visible services on main page"
  on services for select
  using (
    visible = true or 
    auth.role() = 'authenticated'
  );

-- Refresh schema cache
notify pgrst, 'reload schema';