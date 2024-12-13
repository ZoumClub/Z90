-- Add sold status to cars table
alter table cars add column if not exists is_sold boolean default false;

-- Create index for better performance
create index if not exists idx_cars_is_sold on cars(is_sold);