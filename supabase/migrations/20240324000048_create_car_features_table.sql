-- Create car_features table
create table car_features (
  id uuid default gen_random_uuid() primary key,
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  description text,
  category text not null check (category in (
    'Comfort',
    'Safety',
    'Technology',
    'Performance',
    'Exterior',
    'Interior'
  )),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_brand_feature unique (brand_id, name)
);

-- Create car_feature_availability junction table
create table car_feature_availability (
  car_id uuid not null references cars(id) on delete cascade,
  feature_id uuid not null references car_features(id) on delete cascade,
  available boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (car_id, feature_id)
);

-- Create indexes
create index idx_car_features_brand_id on car_features(brand_id);
create index idx_car_features_category on car_features(category);
create index idx_car_feature_availability_car_id on car_feature_availability(car_id);
create index idx_car_feature_availability_feature_id on car_feature_availability(feature_id);

-- Enable RLS
alter table car_features enable row level security;
alter table car_feature_availability enable row level security;

-- Create RLS policies
create policy "Car features are viewable by everyone"
  on car_features for select
  using (true);

create policy "Car feature availability is viewable by everyone"
  on car_feature_availability for select
  using (true);

create policy "Authenticated users can manage car features"
  on car_features for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage car feature availability"
  on car_feature_availability for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Insert default features for each brand
insert into car_features (brand_id, name, category, description)
select 
  b.id as brand_id,
  f.name,
  f.category,
  f.description
from brands b
cross join (
  values 
    ('Speed Regulator', 'Performance', 'Maintains a constant speed while driving'),
    ('Air Condition', 'Comfort', 'Climate control system'),
    ('Reversing Camera', 'Safety', 'Camera assistance when reversing'),
    ('Reversing Radar', 'Safety', 'Proximity sensors for parking assistance'),
    ('GPS Navigation', 'Technology', 'Built-in navigation system'),
    ('Park Assist', 'Technology', 'Automated parking assistance'),
    ('Start and Stop', 'Performance', 'Automatic engine start/stop at idle'),
    ('Airbag', 'Safety', 'Safety airbag system'),
    ('ABS', 'Safety', 'Anti-lock braking system'),
    ('Computer', 'Technology', 'On-board computer system'),
    ('Rims', 'Exterior', 'Alloy wheel rims'),
    ('Electric mirrors', 'Exterior', 'Power-adjustable side mirrors'),
    ('Electric windows', 'Interior', 'Power windows'),
    ('Bluetooth', 'Technology', 'Bluetooth connectivity')
) as f(name, category, description)
on conflict (brand_id, name) do nothing;

-- Create function to manage car features
create or replace function manage_car_features(
  p_car_id uuid,
  p_feature_names text[]
) returns void as $$
declare
  v_brand_id uuid;
begin
  -- Get brand_id from car
  select brand_id into v_brand_id
  from cars
  where id = p_car_id;

  if not found then
    raise exception 'Car not found';
  end if;

  -- Delete existing feature availability entries
  delete from car_feature_availability where car_id = p_car_id;
  
  -- Insert new feature availability entries
  insert into car_feature_availability (car_id, feature_id)
  select p_car_id, cf.id
  from car_features cf
  where cf.brand_id = v_brand_id
  and cf.name = any(p_feature_names);
end;
$$ language plpgsql security definer;

-- Grant execute permission
grant execute on function manage_car_features(uuid, text[]) to authenticated;

-- Create trigger to update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_car_features_timestamp
  before update on car_features
  for each row
  execute function update_updated_at();

-- Refresh schema cache
notify pgrst, 'reload schema';