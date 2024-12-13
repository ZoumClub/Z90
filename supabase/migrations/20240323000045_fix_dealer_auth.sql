-- Drop and recreate dealers table with better structure
drop table if exists dealers cascade;

create table dealers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  shop_image text not null,
  address text not null,
  city text not null,
  phone text not null check (phone ~ '^\+?[0-9\s\-()]{10,}$'),
  whatsapp text not null check (whatsapp ~ '^\+?[0-9\s\-()]{10,}$'),
  id_number text not null unique check (length(trim(id_number)) >= 5),
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_dealers_id_number on dealers(id_number);
create index idx_dealers_is_active on dealers(is_active);

-- Enable RLS
alter table dealers enable row level security;

-- Create policies
create policy "Dealers are viewable by everyone"
  on dealers for select
  using (true);

-- Insert sample dealers
insert into dealers (name, shop_image, address, city, phone, whatsapp, id_number) values
  (
    'Premium Auto Gallery',
    'https://images.unsplash.com/photo-1562519819-016930ada31b',
    '123 Luxury Lane',
    'London',
    '+44 20 7123 4567',
    '+44 7700 900123',
    'PAG123456'
  ),
  (
    'Elite Motors',
    'https://images.unsplash.com/photo-1567449303078-57ad995bd329',
    '456 Elite Street',
    'Manchester',
    '+44 161 234 5678',
    '+44 7700 900456',
    'EM789012'
  ),
  (
    'Prestige Cars',
    'https://images.unsplash.com/photo-1579033060982-1bb5b083f4fa',
    '789 Prestige Road',
    'Birmingham',
    '+44 121 345 6789',
    '+44 7700 900789',
    'PC345678'
  );

-- Create function to validate dealer login
create or replace function validate_dealer_login(p_id_number text)
returns jsonb as $$
declare
  v_dealer dealers;
begin
  select * into v_dealer
  from dealers
  where id_number = trim(p_id_number)
  and is_active = true;

  if not found then
    return jsonb_build_object(
      'success', false,
      'message', 'Invalid dealer ID'
    );
  end if;

  return jsonb_build_object(
    'success', true,
    'dealer', row_to_json(v_dealer)
  );
end;
$$ language plpgsql security definer;

-- Grant execute permission to anonymous users
grant execute on function validate_dealer_login(text) to anon;