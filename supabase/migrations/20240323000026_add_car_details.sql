-- Add technical specifications fields to cars table
alter table cars add column if not exists mileage text;
alter table cars add column if not exists fuel_type text;
alter table cars add column if not exists transmission text;
alter table cars add column if not exists autonomy text;
alter table cars add column if not exists seats integer;
alter table cars add column if not exists body_type text;
alter table cars add column if not exists exterior_color text;
alter table cars add column if not exists interior_color text;
alter table cars add column if not exists number_of_owners integer default 1;
alter table cars add column if not exists number_of_keys text;

-- Create car_features table
create table if not exists car_features (
  id uuid default gen_random_uuid() primary key,
  car_id uuid not null references cars(id) on delete cascade,
  name text not null,
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes
create index if not exists idx_car_features_car_id on car_features(car_id);

-- Enable RLS
alter table car_features enable row level security;

-- Create policies
create policy "Car features are viewable by everyone"
  on car_features for select
  using (true);

create policy "Authenticated users can manage car features"
  on car_features for all
  using (true)
  with check (true);

-- Add some default features to existing cars
insert into car_features (car_id, name, available)
select c.id, f.name, true
from cars c
cross join (
  values 
    ('Speed Regulator'),
    ('Air Condition'),
    ('Reversing Camera'),
    ('Reversing Radar'),
    ('GPS Navigation'),
    ('Park Assist'),
    ('Start and Stop'),
    ('Airbag'),
    ('ABS'),
    ('Computer'),
    ('Rims'),
    ('Electric mirrors'),
    ('Electric windows'),
    ('Bluetooth')
) as f(name);

-- Update existing cars with sample data
update cars set
  mileage = case 
    when condition = 'new' then 'N/A'
    else floor(random() * 50000)::text || ' km'
  end,
  fuel_type = case floor(random() * 3)
    when 0 then 'Petrol'
    when 1 then 'Diesel'
    else 'Electric'
  end,
  transmission = case floor(random() * 2)
    when 0 then 'Automatic'
    else 'Manual'
  end,
  autonomy = case 
    when condition = 'new' then 'N/A'
    else floor(random() * 800 + 200)::text || ' km'
  end,
  seats = floor(random() * 3 + 4),
  body_type = case floor(random() * 4)
    when 0 then 'Sedan'
    when 1 then 'SUV'
    when 2 then 'Coupe'
    else 'Hatchback'
  end,
  exterior_color = case floor(random() * 5)
    when 0 then 'Black'
    when 1 then 'White'
    when 2 then 'Silver'
    when 3 then 'Blue'
    else 'Red'
  end,
  interior_color = case floor(random() * 3)
    when 0 then 'Black'
    when 1 then 'Beige'
    else 'Brown'
  end,
  number_of_keys = floor(random() * 2 + 1)::text;