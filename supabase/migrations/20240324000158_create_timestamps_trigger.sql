-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger update_services_timestamp
  before update on services
  for each row
  execute function update_updated_at_column();

create trigger update_accessories_timestamp
  before update on accessories
  for each row
  execute function update_updated_at_column();

-- Refresh schema cache
notify pgrst, 'reload schema';