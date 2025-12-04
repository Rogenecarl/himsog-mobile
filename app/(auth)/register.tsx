import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { register } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    register.mutate(data, {
      onSuccess: () => {
        router.replace({
          pathname: '/(auth)/verify-email',
          params: { email: getValues('email') },
        });
      },
    });
  };

  const getErrorMessage = (): string | null => {
    if (!register.error) return null;
    return register.error instanceof Error ? register.error.message : 'Registration failed';
  };

  const errorMessage = getErrorMessage();
  const isEmailExists = errorMessage?.includes('already exists');

  const handleGoToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <ThemedText type="title">Create Account</ThemedText>
          <ThemedText style={styles.subtitle}>Sign up to get started</ThemedText>
        </View>

        <View style={styles.form}>
          {/* Error Alert */}
          {errorMessage && (
            <View style={styles.errorAlert}>
              <View style={styles.errorContent}>
                <IconSymbol name="exclamationmark.circle.fill" size={20} color="#dc2626" />
                <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
              </View>
              {isEmailExists && (
                <Pressable style={styles.errorAction} onPress={handleGoToLogin}>
                  <ThemedText style={styles.errorActionText}>Sign In Instead</ThemedText>
                  <IconSymbol name="chevron.right" size={14} color="#dc2626" />
                </Pressable>
              )}
            </View>
          )}

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, color: colors.text, borderColor: colors.icon },
                    errors.name && styles.inputError,
                  ]}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.icon}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                />
              )}
            />
            {errors.name && <ThemedText style={styles.fieldError}>{errors.name.message}</ThemedText>}
          </View>

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

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
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
                  placeholder="Create a password"
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

          <Pressable
            style={[styles.button, { backgroundColor: colors.tint }, register.isPending && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={register.isPending}>
            {register.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
            )}
          </Pressable>

          <View style={styles.footer}>
            <ThemedText>Already have an account? </ThemedText>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <ThemedText style={{ color: colors.tint }}>Sign In</ThemedText>
              </Pressable>
            </Link>
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
  },
  form: {
    gap: 16,
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
  },
  errorContent: {
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
  errorAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#fecaca',
  },
  errorActionText: {
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
