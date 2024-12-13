export const IMAGE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['image/jpeg', 'image/png', 'image/gif'],
  bucket: 'car_images'
} as const;

export const ERROR_MESSAGES = {
  invalidType: 'Please upload an image file (JPEG, PNG, or GIF)',
  tooLarge: 'Image size should be less than 5MB',
  uploadFailed: 'Failed to upload image. Please try again.',
  deleteFailed: 'Failed to delete image. Please try again.'
} as const;