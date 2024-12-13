-- Add visible column to accessories
alter table accessories
add column visible boolean not null default true;

-- Add visible column to services
alter table services
add column visible boolean not null default true;

-- Create indexes for better performance
create index idx_accessories_visible on accessories(visible);
create index idx_services_visible on services(visible);

-- Update views to only show visible items on the main page
create or replace view public_accessories as
select * from accessories where visible = true;

create or replace view public_services as
select * from services where visible = true;

-- Grant permissions
grant select on public_accessories to anon, authenticated;
grant select on public_services to anon, authenticated;

-- Refresh schema cache
notify pgrst, 'reload schema';