/**
 * API Error Handler - Maps error messages to HTTP status codes
 */

const ERROR_STATUS_MAP: Record<string, number> = {
  'Blog not found': 404,
  'Project not found': 404,
  'Slug already exists': 400,
  'Slug already exists for this locale': 400,
  'Invalid slug format': 400,
  'Title is required': 400,
  'Content is required': 400,
  'Invalid status': 400,
};

const DEFAULT_STATUS = 500;

/**
 * Get HTTP status code from error message
 * @param error - Error instance or error message string
 * @returns HTTP status code
 */
export function getErrorStatus(error: unknown): number {
  if (error instanceof Error) {
    return ERROR_STATUS_MAP[error.message] || DEFAULT_STATUS;
  }
  if (typeof error === 'string') {
    return ERROR_STATUS_MAP[error] || DEFAULT_STATUS;
  }
  return DEFAULT_STATUS;
}

/**
 * Get error message from error instance
 * @param error - Error instance or unknown
 * @param defaultMessage - Default message if error is not an Error instance
 * @returns Error message string
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string = 'An error occurred',
): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
}
