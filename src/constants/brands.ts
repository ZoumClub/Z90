export const BRAND_NAMES = [
  'BMW',
  'Mercedes',
  'Audi',
  'Toyota',
  'Honda',
  'Ford',
  'Volkswagen'
] as const;

export type BrandName = typeof BRAND_NAMES[number];