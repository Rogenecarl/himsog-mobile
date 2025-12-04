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

const verifySchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
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
          router.replace('/(tabs)');
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!email) return;
    resendOtp.mutate({ email });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Verify Email</ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter the 6-digit code sent to {email}
        </ThemedText>
      </View>

      <View style={styles.form}>
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
          {errors.otp && <ThemedText style={styles.error}>{errors.otp.message}</ThemedText>}
        </View>

        {verifyEmail.error && (
          <ThemedText style={styles.error}>
            {verifyEmail.error instanceof Error ? verifyEmail.error.message : 'Verification failed'}
          </ThemedText>
        )}

        <Pressable
          style={[styles.button, { backgroundColor: colors.tint }]}
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
            <ThemedText style={{ color: colors.tint }}>
              {resendOtp.isPending ? 'Sending...' : 'Resend'}
            </ThemedText>
          </Pressable>
        </View>

        {resendOtp.isSuccess && (
          <ThemedText style={styles.success}>Code resent successfully!</ThemedText>
        )}
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
  error: {
    color: '#ef4444',
    fontSize: 12,
  },
  success: {
    color: '#22c55e',
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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
