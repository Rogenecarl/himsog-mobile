import { api } from '@/lib/api';
import { getApiError } from '@/lib/api-error';
import type {
  ApiResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  ResetPasswordRequest,
  User,
  UserResponse,
  VerifyEmailRequest,
} from '@/types/auth';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/api/mobile/auth/login', credentials);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Login failed');
    }
    return response.data;
  } catch (error) {
    const apiError = getApiError(error);
    throw new Error(apiError.message);
  }
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await api.post<RegisterResponse>('/api/mobile/auth/register', data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Registration failed');
    }
    return response.data;
  } catch (error) {
    const apiError = getApiError(error);
    throw new Error(apiError.message);
  }
}

export async function verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse> {
  try {
    const response = await api.post<ApiResponse>('/api/mobile/auth/verify-email', data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Verification failed');
    }
    return response.data;
  } catch (error) {
    const apiError = getApiError(error);
    throw new Error(apiError.message);
  }
}

export async function resendOtp(data: ResendOtpRequest): Promise<ApiResponse> {
  try {
    const response = await api.post<ApiResponse>('/api/mobile/auth/resend-otp', data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to resend code');
    }
    return response.data;
  } catch (error) {
    const apiError = getApiError(error);
    throw new Error(apiError.message);
  }
}

export async function getUser(): Promise<User> {
  try {
    const response = await api.get<UserResponse>('/api/mobile/auth/user');
    if (!response.data.success || !response.data.data?.user) {
      throw new Error(response.data.error || 'Failed to get user');
    }
    return response.data.data.user;
  } catch (error) {
    const apiError = getApiError(error);
    throw new Error(apiError.message);
  }
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
  try {
    const response = await api.post<ApiResponse>('/api/mobile/auth/forgot-password', data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to send reset code');
    }
    return response.data;
  } catch (error) {
    const apiError = getApiError(error);
    throw new Error(apiError.message);
  }
}

export async function resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>('/api/mobile/auth/reset-password', data);
  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to reset password');
  }
  return response.data;
}
