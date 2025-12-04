import axios from 'axios';

export interface ApiError {
  message: string;
  status: number;
}

export function getApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return { message, status };
  }

  if (error instanceof Error) {
    return { message: error.message, status: 500 };
  }

  return { message: 'An unexpected error occurred', status: 500 };
}
