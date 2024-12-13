export interface Make {
  name: string;
  logo_url: string;
}

export const MAKES: Make[] = [
  {
    name: 'BMW',
    logo_url: 'https://images.unsplash.com/photo-1617886903355-9354bb57751f'
  },
  {
    name: 'Mercedes',
    logo_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'
  },
  {
    name: 'Audi',
    logo_url: 'https://images.unsplash.com/photo-1610768764270-790fbec18178'
  },
  {
    name: 'Toyota',
    logo_url: 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a'
  },
  {
    name: 'Honda',
    logo_url: 'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10'
  },
  {
    name: 'Ford',
    logo_url: 'https://images.unsplash.com/photo-1612825173281-9a193378527e'
  },
  {
    name: 'Volkswagen',
    logo_url: 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f'
  }
];

export function getMakeLogo(make: string): string {
  const makeObj = MAKES.find(m => m.name === make);
  return makeObj?.logo_url || '';
}