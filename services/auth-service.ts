import { api } from '@/lib/api';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  User,
  VerifyEmailRequest,
} from '@/types/auth';

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/mobile/auth/login', credentials);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>('/api/mobile/auth/register', data);
  if (!response.data.success) {
    throw new Error(response.data.error || 'Registration failed');
  }
  return response.data;
}

export async function verifyEmail(data: VerifyEmailRequest): Promise<void> {
  await api.post('/api/mobile/auth/verify-email', data);
}

export async function resendOtp(data: ResendOtpRequest): Promise<void> {
  await api.post('/api/mobile/auth/resend-otp', data);
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/api/mobile/auth/me');
  return response.data;
}
