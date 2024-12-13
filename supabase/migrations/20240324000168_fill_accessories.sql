-- Insert sample accessories with high-quality images and realistic data
insert into accessories (
  name,
  description,
  price,
  image,
  category,
  in_stock,
  visible
) values
  (
    'Premium All-Weather Floor Mats',
    'Custom-fit all-weather floor mats with raised edges and anti-slip backing. Provides complete floor protection in all weather conditions.',
    89.99,
    'https://images.unsplash.com/photo-1618483117616-d61d8e620544',
    'Interior',
    true,
    true
  ),
  (
    'Advanced LED Interior Lighting Kit',
    'Complete interior LED upgrade kit with smartphone control. Includes footwell lighting, ambient lighting, and trunk light.',
    149.99,
    'https://images.unsplash.com/photo-1621361365424-06f0c1376df6',
    'Interior',
    true,
    true
  ),
  (
    '4K Dash Camera with GPS',
    'Ultra HD dash camera with night vision, GPS tracking, and parking mode. Includes 32GB memory card and hardwiring kit.',
    199.99,
    'https://images.unsplash.com/photo-1621266876144-1a58791196b0',
    'Electronics',
    true,
    true
  ),
  (
    'Aerodynamic Roof Rack System',
    'Universal aerodynamic roof rack with quick-mount system. Includes crossbars and wind deflector.',
    299.99,
    'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e',
    'Exterior',
    true,
    true
  ),
  (
    'High-Performance Air Filter',
    'Washable high-flow air filter for improved engine performance. Includes cleaning kit and installation guide.',
    59.99,
    'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e',
    'Performance',
    true,
    true
  ),
  (
    'Premium Leather Seat Covers',
    'Custom-fit leather seat covers with memory foam padding. Available in multiple colors with airbag compatibility.',
    199.99,
    'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e',
    'Interior',
    true,
    true
  ),
  (
    'Wireless Phone Charger Mount',
    'Fast wireless charging mount with automatic clamping and air vent mounting. Compatible with all Qi-enabled devices.',
    79.99,
    'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e',
    'Electronics',
    true,
    true
  ),
  (
    'Advanced Security System',
    'Two-way paging car alarm system with GPS tracking and smartphone integration. Includes professional installation.',
    399.99,
    'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e',
    'Safety',
    true,
    true
  ),
  (
    'Sport Pedal Kit',
    'Aluminum sport pedal set with rubber inserts. Includes accelerator, brake, and clutch covers.',
    89.99,
    'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e',
    'Performance',
    true,
    true
  ),
  (
    'Trunk Organizer Deluxe',
    'Collapsible trunk organizer with multiple compartments and non-slip base. Includes removable cooler bag.',
    49.99,
    'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e',
    'Interior',
    true,
    true
  ),
  (
    'Rain Repellent Windshield Treatment',
    'Professional-grade hydrophobic glass treatment kit. Includes applicator and microfiber cloths.',
    29.99,
    'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e',
    'Maintenance',
    true,
    true
  ),
  (
    'LED Headlight Upgrade Kit',
    'Complete LED headlight conversion kit with 6000K color temperature. Includes CANbus adapters and installation hardware.',
    249.99,
    'https://images.unsplash.com/photo-1621266875124-f2cd2a4e8a0e',
    'Exterior',
    true,
    true
  );

-- Refresh schema cache
notify pgrst, 'reload schema';