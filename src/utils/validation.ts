export function validatePrice(price: number): boolean {
  return !isNaN(price) && price > 0;
}

export function validateYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return !isNaN(year) && year >= 1900 && year <= currentYear + 1;
}

export function validatePhoneNumber(phone: string): boolean {
  return /^\+?[\d\s-()]{10,}$/.test(phone);
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validateCity(city: string): boolean {
  return city.trim().length >= 2;
}

export function validateNumberOfOwners(owners: number): boolean {
  return !isNaN(owners) && owners > 0;
}