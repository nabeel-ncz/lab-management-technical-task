import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from '../config/api';

const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (API_CONFIG.ENVIRONMENT === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

const transformDates = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(transformDates);
  }
  
  if (typeof obj === 'object') {
    const transformed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      transformed[key] = transformDates(value);
    }
    return transformed;
  }
  
  return obj;
};

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (API_CONFIG.ENVIRONMENT === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }

    let data = response.data;

    if (data && typeof data === 'object' && 'success' in data) {
      data = data.data || data;
    }

    data = transformDates(data);

    return data;
  },
  (error: AxiosError) => {
    if (API_CONFIG.ENVIRONMENT === 'development') {
      console.error('❌ API Error:', error.response?.status, error.message, error.response?.data);
    }

    let errorMessage: string = ERROR_MESSAGES.UNKNOWN;

    if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      errorMessage = ERROR_MESSAGES.TIMEOUT;
    } else if (!error.response) {
      errorMessage = ERROR_MESSAGES.NETWORK;
    } else {
      const status = error.response.status as keyof typeof ERROR_MESSAGES;
      errorMessage = ERROR_MESSAGES[status] || ERROR_MESSAGES.UNKNOWN;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serverError = error?.response?.data as any;
      if (serverError?.message) {
        errorMessage = serverError.message;
      } else if (serverError?.error) {
        errorMessage = serverError.error;
      }
    }

    const enhancedError = new Error(errorMessage);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (enhancedError as any).originalError = error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (enhancedError as any).status = error.response?.status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (enhancedError as any).data = error.response?.data;

    return Promise.reject(enhancedError);
  }
);

export default httpClient; 