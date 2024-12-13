import { jwtDecode, SignJWT } from 'jose';
import { mockCars, MOCK_ADMIN_CREDENTIALS, Car } from './mockData';

const SECRET_KEY = new TextEncoder().encode('your-secret-key');

class MockApi {
  private cars: Car[] = [...mockCars];

  async login(username: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    if (
      username === MOCK_ADMIN_CREDENTIALS.username &&
      password === MOCK_ADMIN_CREDENTIALS.password
    ) {
      const token = await new SignJWT({
        user: { id: '1', role: 'admin' }
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h')
        .sign(SECRET_KEY);

      return { token };
    }

    throw new Error('Invalid credentials');
  }

  async getCars() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.cars;
  }

  async getCar(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const car = this.cars.find(c => c.id === id);
    if (!car) throw new Error('Car not found');
    return car;
  }

  async createCar(car: Omit<Car, 'id'>) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCar = { ...car, id: crypto.randomUUID() };
    this.cars.push(newCar);
    return newCar;
  }

  async updateCar(id: string, car: Partial<Car>) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.cars.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Car not found');
    
    this.cars[index] = { ...this.cars[index], ...car };
    return this.cars[index];
  }

  async deleteCar(id: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.cars.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Car not found');
    
    this.cars.splice(index, 1);
    return true;
  }
}

export const mockApi = new MockApi();