import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, 'Code must be 6 digits'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { resetPassword, forgotPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!email) return;
    resetPassword.mutate(
      { email, otp: data.otp, password: data.password },
      {
        onSuccess: () => {
          router.replace('/(auth)/login');
        },
      }
    );
  };

  const handleResendCode = () => {
    if (!email) return;
    forgotPassword.mutate({ email });
  };

  const getResetErrorMessage = (): string | null => {
    if (!resetPassword.error) return null;
    return resetPassword.error instanceof Error ? resetPassword.error.message : 'Failed to reset password';
  };

  const getResendErrorMessage = (): string | null => {
    if (!forgotPassword.error) return null;
    return forgotPassword.error instanceof Error ? forgotPassword.error.message : 'Failed to resend code';
  };

  const resetErrorMessage = getResetErrorMessage();
  const resendErrorMessage = getResendErrorMessage();
  const isRateLimited =
    resetErrorMessage?.includes('Too many requests') || resendErrorMessage?.includes('Too many requests');
  const isInvalidCode = resetErrorMessage?.includes('Invalid or expired');

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <ThemedText type="title">Reset Password</ThemedText>
          <ThemedText style={styles.subtitle}>
            Enter the 6-digit code sent to {email} and your new password
          </ThemedText>
        </View>

        <View style={styles.form}>
          {/* Reset Error Alert */}
          {resetErrorMessage && (
            <View style={[styles.alertBox, styles.errorAlert]}>
              <View style={styles.alertContent}>
                <IconSymbol
                  name={isRateLimited ? 'clock.fill' : isInvalidCode ? 'xmark.circle.fill' : 'exclamationmark.circle.fill'}
                  size={20}
                  color="#dc2626"
                />
                <ThemedText style={styles.errorText}>{resetErrorMessage}</ThemedText>
              </View>
              {isInvalidCode && (
                <Pressable style={styles.alertAction} onPress={handleResendCode} disabled={forgotPassword.isPending}>
                  <ThemedText style={styles.alertActionText}>
                    {forgotPassword.isPending ? 'Sending...' : 'Request New Code'}
                  </ThemedText>
                  <IconSymbol name="arrow.clockwise" size={14} color="#dc2626" />
                </Pressable>
              )}
            </View>
          )}

          {/* Resend Error Alert */}
          {resendErrorMessage && !resetErrorMessage && (
            <View style={[styles.alertBox, styles.errorAlert]}>
              <View style={styles.alertContent}>
                <IconSymbol
                  name={isRateLimited ? 'clock.fill' : 'exclamationmark.circle.fill'}
                  size={20}
                  color="#dc2626"
                />
                <ThemedText style={styles.errorText}>{resendErrorMessage}</ThemedText>
              </View>
            </View>
          )}

          {/* Success Alert - Code Resent */}
          {forgotPassword.isSuccess && !resendErrorMessage && (
            <View style={[styles.alertBox, styles.successAlert]}>
              <View style={styles.alertContent}>
                <IconSymbol name="checkmark.circle.fill" size={20} color="#16a34a" />
                <ThemedText style={styles.successText}>New code sent! Check your email.</ThemedText>
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Reset Code</ThemedText>
            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.otpInput,
                    { backgroundColor: colors.background, color: colors.text, borderColor: colors.icon },
                    errors.otp && styles.inputError,
                  ]}
                  placeholder="000000"
                  placeholderTextColor={colors.icon}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                />
              )}
            />
            {errors.otp && <ThemedText style={styles.fieldError}>{errors.otp.message}</ThemedText>}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>New Password</ThemedText>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, color: colors.text, borderColor: colors.icon },
                    errors.password && styles.inputError,
                  ]}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.icon}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  autoComplete="new-password"
                />
              )}
            />
            {errors.password && <ThemedText style={styles.fieldError}>{errors.password.message}</ThemedText>}
            <View style={styles.passwordHint}>
              <ThemedText style={styles.hintText}>
                Password must be 8+ characters with uppercase, lowercase, and number
              </ThemedText>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Confirm Password</ThemedText>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, color: colors.text, borderColor: colors.icon },
                    errors.confirmPassword && styles.inputError,
                  ]}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.icon}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  autoComplete="new-password"
                />
              )}
            />
            {errors.confirmPassword && (
              <ThemedText style={styles.fieldError}>{errors.confirmPassword.message}</ThemedText>
            )}
          </View>

          <Pressable
            style={[styles.button, { backgroundColor: colors.tint }, resetPassword.isPending && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={resetPassword.isPending}>
            {resetPassword.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Reset Password</ThemedText>
            )}
          </Pressable>

          <View style={styles.footer}>
            <ThemedText>Didn&apos;t receive a code? </ThemedText>
            <Pressable onPress={handleResendCode} disabled={forgotPassword.isPending}>
              <ThemedText style={{ color: colors.tint }}>
                {forgotPassword.isPending ? 'Sending...' : 'Resend'}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  alertBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  successAlert: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  errorText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 14,
    lineHeight: 20,
  },
  successText: {
    flex: 1,
    color: '#16a34a',
    fontSize: 14,
    lineHeight: 20,
  },
  alertAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#fecaca',
  },
  alertActionText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  passwordHint: {
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    opacity: 0.6,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});
