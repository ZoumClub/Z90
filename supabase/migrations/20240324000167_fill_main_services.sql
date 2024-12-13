-- Insert sample services with high-quality images and realistic data
insert into main_services (
  name,
  description,
  price,
  image,
  category,
  duration,
  available,
  visible
) values
  (
    'Full Vehicle Service',
    'Comprehensive service package including oil change, all filters replacement, brake inspection, tire rotation, and 50-point safety check. Includes detailed report.',
    299.99,
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04',
    'Maintenance',
    '3-4 hours',
    true,
    true
  ),
  (
    'Professional Wheel Alignment',
    'Computer-assisted 4-wheel alignment service with detailed before/after measurements. Includes road test and tire pressure adjustment.',
    89.99,
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60',
    'Maintenance',
    '1 hour',
    true,
    true
  ),
  (
    'Ceramic Paint Protection',
    'Premium ceramic coating application providing up to 5 years of paint protection. Includes paint correction, deep cleaning, and UV protection.',
    599.99,
    'https://images.unsplash.com/photo-1621963417481-fb4984a4b9a4',
    'Customization',
    '1-2 days',
    true,
    true
  ),
  (
    'Premium Interior Detailing',
    'Complete interior restoration including steam cleaning, leather conditioning, sanitization, and protection. Includes air freshener system.',
    199.99,
    'https://images.unsplash.com/photo-1607860108855-64acf2078ed9',
    'Cleaning',
    '4-5 hours',
    true,
    true
  ),
  (
    'Advanced Engine Diagnostics',
    'Comprehensive engine diagnostic scan with advanced OBD-II testing. Includes detailed report and repair recommendations.',
    99.99,
    'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97',
    'Inspection',
    '1 hour',
    true,
    true
  ),
  (
    'Professional Window Tinting',
    'Premium ceramic window tint installation with lifetime warranty. Includes UV protection and heat rejection properties.',
    299.99,
    'https://images.unsplash.com/photo-1619725002198-6a689b72f41d',
    'Customization',
    '2-3 hours',
    true,
    true
  ),
  (
    'Brake System Service',
    'Complete brake system inspection and service including pad replacement, rotor resurfacing, and fluid flush.',
    249.99,
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
    'Maintenance',
    '2-3 hours',
    true,
    true
  ),
  (
    'AC System Service',
    'Full air conditioning system service including refrigerant recharge, leak detection, and system performance test.',
    149.99,
    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98',
    'Maintenance',
    '1-2 hours',
    true,
    true
  ),
  (
    'Annual Vehicle Inspection',
    'Comprehensive vehicle inspection covering all major systems. Includes detailed report and maintenance recommendations.',
    79.99,
    'https://images.unsplash.com/photo-1486262322291-6f204be73e67',
    'Inspection',
    '1 hour',
    true,
    true
  ),
  (
    'Extended Warranty Package',
    'Comprehensive 2-year extended warranty coverage for major vehicle systems. Includes 24/7 roadside assistance.',
    999.99,
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
    'Warranty',
    'Instant',
    true,
    true
  ),
  (
    'Performance Tuning',
    'Professional ECU remapping and performance optimization. Includes before/after dyno testing.',
    399.99,
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
    'Customization',
    '3-4 hours',
    true,
    true
  ),
  (
    'Exterior Detail Package',
    'Complete exterior detailing including clay bar treatment, machine polish, and paint sealant application.',
    249.99,
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785',
    'Cleaning',
    '5-6 hours',
    true,
    true
  );

-- Refresh schema cache
notify pgrst, 'reload schema';