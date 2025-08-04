export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  HEADERS: {
    'Content-Type': 'application/json',
  },
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development'
} as const;

export const ERROR_MESSAGES = {
  400: 'Bad Request - Please check your input',
  401: 'Unauthorized - Please login again',
  403: 'Forbidden - You do not have permission',
  404: 'Resource not found',
  422: 'Validation error - Please check your input',
  500: 'Server error - Please try again later',
  503: 'Service unavailable - Please try again later',
  NETWORK: 'Network error - Please check your connection',
  TIMEOUT: 'Request timeout - Please try again',
  UNKNOWN: 'An unexpected error occurred'
} as const; 