import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { removeToken, setToken } from '@/lib/auth';
import * as authService from '@/services/auth-service';
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendOtpRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '@/types/auth';

const AUTH_QUERY_KEY = ['auth', 'user'] as const;

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.getUser,
    retry: false,
    enabled: true,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (response) => {
      if (response.data) {
        await setToken(response.data.token);
        queryClient.setQueryData(AUTH_QUERY_KEY, response.data.user);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: (data: ResendOtpRequest) => authService.resendOtp(data),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });

  const logout = async () => {
    await removeToken();
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
    login: loginMutation,
    register: registerMutation,
    verifyEmail: verifyEmailMutation,
    resendOtp: resendOtpMutation,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
    logout,
  };
}
