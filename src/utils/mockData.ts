import { v4 as uuidv4 } from 'uuid';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  savings: number;
}

export const mockCars: Car[] = [
  {
    id: uuidv4(),
    make: 'BMW',
    model: '3 Series',
    year: 2024,
    price: 45990,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80',
    savings: 3500,
  },
  {
    id: uuidv4(),
    make: 'Mercedes',
    model: 'C-Class',
    year: 2024,
    price: 47990,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80',
    savings: 4200,
  },
  {
    id: uuidv4(),
    make: 'Audi',
    model: 'A4',
    year: 2024,
    price: 46590,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80',
    savings: 3800,
  },
];

export const MOCK_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};