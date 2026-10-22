import { useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
} from 'react-native';

import {
  ProfileAddressIcon,
  ProfileBellIcon,
  ProfileChevronIcon,
  ProfileDocIcon,
  ProfileHistoryIcon,
  ProfileLogoutIcon,
  ProfilePhoneLockIcon,
  ProfileUserIcon,
  VerifiedBadgeIcon,
} from '../components/icons';
import LogoutConfirmSheet from '../components/LogoutConfirmSheet';
import ScreenHeader from '../components/ScreenHeader';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

function MenuRow({
  icon,
  title,
  subtitle,
  trailing,
  onPress,
  danger = false,
  colors,
}) {
  return (
    <Pressable
      style={[styles.menuRow, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View
        style={[
          styles.menuIconWrap,
          { backgroundColor: colors.surfaceMuted },
          danger && { backgroundColor: colors.dangerSoft },
        ]}
      >
        {icon}
      </View>
      <View style={styles.menuText}>
        <Text
          style={[
            styles.menuTitle,
            { color: colors.text },
            danger && { color: colors.danger },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.menuSubtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      <ProfileChevronIcon
        width={7}
        height={10}
        color={danger ? colors.danger : colors.textMuted}
      />
    </Pressable>
  );
}

export default function ProfileScreen({
  name = 'Aarav Kumar',
  initials = 'AK',
  phone = '+91 98765 43210',
  email = 'aarav@example.com',
  onBack,
  onPersonalInfo,
  onAddresses,
  onOrderHistory,
  onNotifications,
  onTerms,
  onLogout,
}) {
  const { colors } = useTheme();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const iconColor = colors.text;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ThemedStatusBar />

      <ScreenHeader title="Profile" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.surface,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View
            style={[styles.avatar, { backgroundColor: colors.surfaceSoft }]}
          >
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {initials}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {name}
              </Text>
              <VerifiedBadgeIcon width={15} height={14} />
            </View>
            <View style={styles.phoneRow}>
              <ProfilePhoneLockIcon width={9} height={12} color={iconColor} />
              <Text style={[styles.phoneText, { color: colors.textSecondary }]}>
                {phone}
              </Text>
            </View>
            <Text style={[styles.emailText, { color: colors.textMuted }]}>
              {email}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Account
        </Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <MenuRow
            colors={colors}
            icon={<ProfileUserIcon width={13} height={13} color={iconColor} />}
            title="Personal Information"
            subtitle="Name, email and mobile number"
            onPress={onPersonalInfo}
          />
          <MenuRow
            colors={colors}
            icon={
              <ProfileAddressIcon width={13} height={16} color={iconColor} />
            }
            title="Addresses"
            subtitle="Manage your delivery addresses"
            onPress={onAddresses}
          />
          <MenuRow
            colors={colors}
            icon={
              <ProfileHistoryIcon width={15} height={15} color={iconColor} />
            }
            title="Order History"
            subtitle="View your previous orders and savings"
            onPress={onOrderHistory}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Preferences
        </Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <MenuRow
            colors={colors}
            icon={<ProfileBellIcon width={13} height={16} color={iconColor} />}
            title="Notifications"
            subtitle="Manage alerts and updates"
            onPress={onNotifications}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <MenuRow
            colors={colors}
            icon={<ProfileDocIcon width={13} height={16} color={iconColor} />}
            title="Terms & Conditions"
            subtitle="Read Kisse Loon terms"
            onPress={onTerms}
          />
        </View>

        <Pressable
          style={styles.logoutCard}
          onPress={() => setLogoutVisible(true)}
          android_ripple={{ color: 'rgba(186, 26, 26, 0.12)' }}
        >
          <View style={styles.logoutLeft}>
            <View style={styles.logoutIconWrap}>
              <ProfileLogoutIcon width={15} height={15} color={colors.danger} />
            </View>
            <Text style={[styles.logoutText, { color: colors.danger }]}>
              Log out
            </Text>
          </View>
          <ProfileChevronIcon width={7} height={10} color={colors.danger} />
        </Pressable>

        <View style={styles.brandBlock}>
          <Image
            source={require('../assets/brand/kisse-loon-brand.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={[styles.brandTagline, { color: colors.textMuted }]}>
            Compare more. Save more.
          </Text>
          <Text style={[styles.brandVersion, { color: colors.textFaint }]}>
            v2.4.1 (Build 890)
          </Text>
        </View>
      </ScrollView>

      <LogoutConfirmSheet
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={() => onLogout?.()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
  },
  profileCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 24,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontFamily: 'Inter_700Bold',
  },
  userInfo: {
    flex: 1,
    gap: 2,
    paddingRight: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
    fontFamily: 'Inter_700Bold',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  emailText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
    fontFamily: 'Inter_600SemiBold',
    paddingHorizontal: 4,
    paddingBottom: 4,
    marginTop: 4,
  },
  sectionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.15,
    fontFamily: 'Inter_700Bold',
  },
  menuSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  logoutCard: {
    borderRadius: 12,
    minHeight: 60,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffdad6',
    overflow: 'hidden',
    // Soft iOS shadow only — Android elevation on tinted cards looks bloated.
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
      },
      android: {
        elevation: 0,
      },
    }),
    marginTop: 4,
  },
  logoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  logoutIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffe4e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.15,
    fontFamily: 'Inter_700Bold',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  brandBlock: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 8,
  },
  brandLogo: {
    width: 112,
    height: 112,
  },
  brandTagline: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.3,
    fontFamily: 'Inter_600SemiBold',
  },
  brandVersion: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
});
