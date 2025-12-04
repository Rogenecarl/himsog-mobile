import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const verifySchema = z.object({
  otp: z.string().length(6, 'Code must be 6 digits'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { verifyEmail, resendOtp } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = (data: VerifyFormData) => {
    if (!email) return;
    verifyEmail.mutate(
      { email, otp: data.otp },
      {
        onSuccess: () => {
          router.replace('/(auth)/login');
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!email) return;
    resendOtp.mutate({ email });
  };

  const getVerifyErrorMessage = (): string | null => {
    if (!verifyEmail.error) return null;
    return verifyEmail.error instanceof Error ? verifyEmail.error.message : 'Verification failed';
  };

  const getResendErrorMessage = (): string | null => {
    if (!resendOtp.error) return null;
    return resendOtp.error instanceof Error ? resendOtp.error.message : 'Failed to resend code';
  };

  const verifyErrorMessage = getVerifyErrorMessage();
  const resendErrorMessage = getResendErrorMessage();

  // Determine error types for verify errors
  const isInvalidCode = verifyErrorMessage?.includes('Invalid or expired');
  const isAlreadyVerifiedFromVerify = verifyErrorMessage?.includes('already verified');

  // Determine error types for resend errors
  const isAlreadyVerifiedFromResend = resendErrorMessage?.includes('already verified');
  const isRateLimited =
    verifyErrorMessage?.includes('Too many requests') || resendErrorMessage?.includes('Too many requests');

  const handleGoToLogin = () => {
    router.replace('/(auth)/login');
  };

  // Get appropriate icon for verify errors
  const getVerifyIcon = () => {
    if (isRateLimited) return 'clock.fill';
    if (isInvalidCode) return 'xmark.circle.fill';
    if (isAlreadyVerifiedFromVerify) return 'checkmark.circle.fill';
    return 'exclamationmark.circle.fill';
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Verify Email</ThemedText>
        <ThemedText style={styles.subtitle}>Enter the 6-digit code sent to {email}</ThemedText>
      </View>

      <View style={styles.form}>
        {/* Verify Error Alert */}
        {verifyErrorMessage && (
          <View style={[styles.alertBox, isAlreadyVerifiedFromVerify ? styles.infoAlert : styles.errorAlert]}>
            <View style={styles.alertContent}>
              <IconSymbol
                name={getVerifyIcon()}
                size={20}
                color={isAlreadyVerifiedFromVerify ? '#2563eb' : '#dc2626'}
              />
              <ThemedText style={isAlreadyVerifiedFromVerify ? styles.infoText : styles.errorText}>
                {verifyErrorMessage}
              </ThemedText>
            </View>
            {(isAlreadyVerifiedFromVerify || isInvalidCode) && (
              <Pressable
                style={[styles.alertAction, isAlreadyVerifiedFromVerify && styles.infoAlertAction]}
                onPress={isAlreadyVerifiedFromVerify ? handleGoToLogin : handleResendOtp}
                disabled={!isAlreadyVerifiedFromVerify && resendOtp.isPending}>
                <ThemedText style={[styles.alertActionText, isAlreadyVerifiedFromVerify && styles.infoActionText]}>
                  {isAlreadyVerifiedFromVerify
                    ? 'Go to Login'
                    : resendOtp.isPending
                      ? 'Sending...'
                      : 'Resend Code'}
                </ThemedText>
                <IconSymbol
                  name={isAlreadyVerifiedFromVerify ? 'chevron.right' : 'arrow.clockwise'}
                  size={14}
                  color={isAlreadyVerifiedFromVerify ? '#2563eb' : '#dc2626'}
                />
              </Pressable>
            )}
          </View>
        )}

        {/* Resend Error Alert */}
        {resendErrorMessage && !verifyErrorMessage && (
          <View style={[styles.alertBox, styles.errorAlert]}>
            <View style={styles.alertContent}>
              <IconSymbol
                name={isRateLimited ? 'clock.fill' : 'exclamationmark.circle.fill'}
                size={20}
                color="#dc2626"
              />
              <ThemedText style={styles.errorText}>{resendErrorMessage}</ThemedText>
            </View>
            {isAlreadyVerifiedFromResend && (
              <Pressable style={styles.alertAction} onPress={handleGoToLogin}>
                <ThemedText style={styles.alertActionText}>Go to Login</ThemedText>
                <IconSymbol name="chevron.right" size={14} color="#dc2626" />
              </Pressable>
            )}
          </View>
        )}

        {/* Success Alert */}
        {resendOtp.isSuccess && !resendErrorMessage && (
          <View style={[styles.alertBox, styles.successAlert]}>
            <View style={styles.alertContent}>
              <IconSymbol name="checkmark.circle.fill" size={20} color="#16a34a" />
              <ThemedText style={styles.successText}>Code sent! Check your email.</ThemedText>
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Verification Code</ThemedText>
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

        <Pressable
          style={[styles.button, { backgroundColor: colors.tint }, verifyEmail.isPending && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={verifyEmail.isPending}>
          {verifyEmail.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Verify</ThemedText>
          )}
        </Pressable>

        <View style={styles.footer}>
          <ThemedText>Didn&apos;t receive a code? </ThemedText>
          <Pressable onPress={handleResendOtp} disabled={resendOtp.isPending}>
            <ThemedText style={{ color: colors.tint }}>{resendOtp.isPending ? 'Sending...' : 'Resend'}</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
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
  infoAlert: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
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
  infoText: {
    flex: 1,
    color: '#2563eb',
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
  infoAlertAction: {
    borderTopColor: '#bfdbfe',
  },
  alertActionText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  infoActionText: {
    color: '#2563eb',
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
