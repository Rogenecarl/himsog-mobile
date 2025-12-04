import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function DashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user, logout, isLoading } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ThemedText style={styles.greeting}>{getGreeting()}</ThemedText>
            <ThemedText type="title" style={styles.userName}>
              {user?.name || 'User'}
            </ThemedText>
          </View>
          <Pressable style={[styles.avatar, { backgroundColor: colors.tint }]}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatarImage} />
            ) : (
              <ThemedText style={styles.avatarText}>{getInitials(user?.name || 'U')}</ThemedText>
            )}
          </Pressable>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colorScheme === 'dark' ? '#1a2634' : '#e8f4fd' }]}>
            <IconSymbol name="heart.fill" size={24} color={colors.tint} />
            <ThemedText style={styles.statValue}>--</ThemedText>
            <ThemedText style={styles.statLabel}>Health Score</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: colorScheme === 'dark' ? '#1a2634' : '#e8f4fd' }]}>
            <IconSymbol name="calendar" size={24} color={colors.tint} />
            <ThemedText style={styles.statValue}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Appointments</ThemedText>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          <View style={styles.actionsGrid}>
            <Pressable style={[styles.actionCard, { borderColor: colors.icon }]}>
              <View style={[styles.actionIcon, { backgroundColor: colors.tint + '20' }]}>
                <IconSymbol name="magnifyingglass" size={24} color={colors.tint} />
              </View>
              <ThemedText style={styles.actionText}>Find Services</ThemedText>
            </Pressable>
            <Pressable style={[styles.actionCard, { borderColor: colors.icon }]}>
              <View style={[styles.actionIcon, { backgroundColor: colors.tint + '20' }]}>
                <IconSymbol name="calendar.badge.plus" size={24} color={colors.tint} />
              </View>
              <ThemedText style={styles.actionText}>Book Now</ThemedText>
            </Pressable>
            <Pressable style={[styles.actionCard, { borderColor: colors.icon }]}>
              <View style={[styles.actionIcon, { backgroundColor: colors.tint + '20' }]}>
                <IconSymbol name="clock" size={24} color={colors.tint} />
              </View>
              <ThemedText style={styles.actionText}>History</ThemedText>
            </Pressable>
            <Pressable style={[styles.actionCard, { borderColor: colors.icon }]}>
              <View style={[styles.actionIcon, { backgroundColor: colors.tint + '20' }]}>
                <IconSymbol name="person" size={24} color={colors.tint} />
              </View>
              <ThemedText style={styles.actionText}>Profile</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Account
          </ThemedText>
          <View style={[styles.infoCard, { backgroundColor: colorScheme === 'dark' ? '#1a2634' : '#f5f5f5' }]}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Email</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.email}</ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.icon + '30' }]} />
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Role</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.role}</ThemedText>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable style={[styles.logoutButton, { borderColor: '#ef4444' }]} onPress={logout}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#ef4444" />
          <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    opacity: 0.7,
  },
  userName: {
    fontSize: 24,
    marginTop: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    opacity: 0.7,
  },
  infoValue: {
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 40,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
