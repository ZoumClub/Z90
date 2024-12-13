export function formatPrice(price) {
  return `£${price.toLocaleString()}`;
}

export function validateService(service) {
  const errors = [];

  if (!service.name?.trim()) {
    errors.push('Name is required');
  }

  if (!service.description?.trim()) {
    errors.push('Description is required');
  }

  if (!service.price || service.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!service.image?.trim()) {
    errors.push('Image is required');
  }

  if (!service.category?.trim()) {
    errors.push('Category is required');
  }

  if (!service.duration?.trim()) {
    errors.push('Duration is required');
  }

  return errors;
}