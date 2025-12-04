import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { forgotPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        router.push({
          pathname: '/(auth)/reset-password',
          params: { email: getValues('email') },
        });
      },
    });
  };

  const getErrorMessage = (): string | null => {
    if (!forgotPassword.error) return null;
    return forgotPassword.error instanceof Error ? forgotPassword.error.message : 'Failed to send reset code';
  };

  const errorMessage = getErrorMessage();
  const isRateLimited = errorMessage?.includes('Too many requests');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Forgot Password</ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter your email and we&apos;ll send you a code to reset your password
        </ThemedText>
      </View>

      <View style={styles.form}>
        {/* Error Alert */}
        {errorMessage && (
          <View style={[styles.alertBox, styles.errorAlert]}>
            <View style={styles.alertContent}>
              <IconSymbol
                name={isRateLimited ? 'clock.fill' : 'exclamationmark.circle.fill'}
                size={20}
                color="#dc2626"
              />
              <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.background, color: colors.text, borderColor: colors.icon },
                  errors.email && styles.inputError,
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.icon}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />
          {errors.email && <ThemedText style={styles.fieldError}>{errors.email.message}</ThemedText>}
        </View>

        <Pressable
          style={[styles.button, { backgroundColor: colors.tint }, forgotPassword.isPending && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={forgotPassword.isPending}>
          {forgotPassword.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Send Reset Code</ThemedText>
          )}
        </Pressable>

        <View style={styles.footer}>
          <ThemedText>Remember your password? </ThemedText>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <ThemedText style={{ color: colors.tint }}>Sign In</ThemedText>
            </Pressable>
          </Link>
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
