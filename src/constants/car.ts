export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'] as const;
export const TRANSMISSION_TYPES = ['Automatic', 'Manual'] as const;
export const BODY_TYPES = ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Convertible', 'Van'] as const;
export const COLORS = ['Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green', 'Brown', 'Beige'] as const;

export const MILEAGE_RANGES = [
  'Under 1,000 km',
  '1,000 - 5,000 km',
  '5,000 - 10,000 km',
  '10,000 - 20,000 km',
  '20,000 - 30,000 km',
  '30,000 - 50,000 km',
  '50,000 - 75,000 km',
  '75,000 - 100,000 km',
  '100,000 - 150,000 km',
  'Over 150,000 km'
] as const;

export const DEFAULT_FEATURES = [
  'Speed Regulator',
  'Air Condition',
  'Reversing Camera',
  'Reversing Radar',
  'GPS Navigation',
  'Park Assist',
  'Start and Stop',
  'Airbag',
  'ABS',
  'Computer',
  'Rims',
  'Electric mirrors',
  'Electric windows',
  'Bluetooth'
] as const;

export type FuelType = typeof FUEL_TYPES[number];
export type TransmissionType = typeof TRANSMISSION_TYPES[number];
export type BodyType = typeof BODY_TYPES[number];
export type Color = typeof COLORS[number];
export type MileageRange = typeof MILEAGE_RANGES[number];