import { PostgrestError } from '@supabase/supabase-js';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, defaultMessage: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  if (isPostgrestError(error)) {
    return new AppError(
      getPostgrestErrorMessage(error) || defaultMessage,
      error.code,
      error.details
    );
  }

  return new AppError(defaultMessage);
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return typeof error === 'object' && error !== null && 'code' in error;
}

function getPostgrestErrorMessage(error: PostgrestError): string {
  switch (error.code) {
    case '23503':
      return 'Referenced record not found';
    case '23505':
      return 'Record already exists';
    case '23514':
      return 'Invalid data provided';
    default:
      return error.message;
  }
}