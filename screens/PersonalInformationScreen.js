import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native';

import {
  CheckCircleIcon,
  ClearIcon,
  EmailOutlineIcon,
  InfoIcon,
  LockIcon,
  MobileFieldIcon,
  ProfileUserIcon,
  SaveDiskIcon,
  SealCheckIcon,
  VerifiedCheckIcon,
} from '../components/icons';
import ScreenHeader from '../components/ScreenHeader';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'AK';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function FieldLabel({ children, right }) {
  return (
    <View style={styles.labelRow}>
      <Text style={styles.label}>{children}</Text>
      {right || <View />}
    </View>
  );
}

function InputRow({
  icon,
  trailing,
  locked = false,
  children,
}) {
  return (
    <View style={[styles.inputCard, locked && styles.inputCardLocked]}>
      <View style={styles.iconSlot}>{icon}</View>
      <View style={styles.inputSlot}>{children}</View>
      {trailing ? <View style={styles.trailingSlot}>{trailing}</View> : null}
    </View>
  );
}

export default function PersonalInformationScreen({
  initialName = 'Sushant',
  initialEmail = 'sushant@example.com',
  phone = '+91 98765 43210',
  onBack,
  onSave,
}) {
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const dirty = useMemo(
    () =>
      fullName.trim() !== initialName.trim() ||
      email.trim() !== initialEmail.trim(),
    [email, fullName, initialEmail, initialName]
  );

  const canSave =
    dirty && fullName.trim().length > 0 && email.trim().includes('@');

  const initials = getInitials(fullName || initialName);

  const handleSave = () => {
    if (!canSave) return;
    onSave?.({
      name: fullName.trim(),
      email: email.trim(),
      phone,
    });
  };

  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ThemedStatusBar />

      <ScreenHeader title="Profile" onBack={onBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.identityCard}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.sealBadge}>
                <SealCheckIcon width={12} height={12} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.identityText}>
              <Text style={styles.identityTitle}>Your personal details</Text>
              <Text style={styles.identitySubtitle}>
                Keep your information up to date.
              </Text>
              <View style={styles.memberPill}>
                <View style={styles.memberDot} />
                <Text style={styles.memberText}>Kisse Loon Member</Text>
              </View>
            </View>
          </View>

          <View style={styles.formBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Basic information</Text>
              {dirty ? (
                <View style={styles.unsavedPill}>
                  <Text style={styles.unsavedText}>Unsaved changes</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.fields}>
              <View style={styles.field}>
                <FieldLabel>Full name</FieldLabel>
                <InputRow
                  icon={
                    <ProfileUserIcon width={14} height={14} color="#76777D" />
                  }
                  trailing={
                    fullName.length > 0 ? (
                      <Pressable
                        style={styles.clearBtn}
                        onPress={() => setFullName('')}
                        hitSlop={8}
                      >
                        <ClearIcon width={15} height={15} />
                      </Pressable>
                    ) : null
                  }
                >
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter full name"
                    placeholderTextColor="#76777D"
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </InputRow>
              </View>

              <View style={styles.field}>
                <FieldLabel
                  right={
                    <View style={styles.verifiedRow}>
                      <VerifiedCheckIcon width={9} height={7} color="#059669" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  }
                >
                  Mobile number
                </FieldLabel>
                <InputRow
                  locked
                  icon={
                    <MobileFieldIcon width={12} height={16} color="#76777D" />
                  }
                  trailing={<LockIcon width={12} height={16} />}
                >
                  <Text style={styles.lockedValue} numberOfLines={1}>
                    {phone}
                  </Text>
                </InputRow>
                <View style={styles.helperRow}>
                  <InfoIcon width={13} height={13} color="#45464D" />
                  <Text style={styles.helperText}>
                    Verified mobile number cannot be changed here.
                  </Text>
                </View>
              </View>

              <View style={styles.field}>
                <FieldLabel>Email address</FieldLabel>
                <InputRow
                  icon={
                    <EmailOutlineIcon width={16} height={13} color="#76777D" />
                  }
                  trailing={
                    email.includes('@') ? (
                      <CheckCircleIcon width={17} height={17} color="#33C773" />
                    ) : null
                  }
                >
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email address"
                    placeholderTextColor="#76777D"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                  />
                </InputRow>
              </View>
            </View>

            <View style={styles.actionBlock}>
              <Pressable
                style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={!canSave}
              >
                <SaveDiskIcon width={15} height={15} color="#684000" />
                <Text style={styles.saveBtnText}>Save changes</Text>
              </Pressable>
              <Text style={styles.footerNote}>
                Changes reflect instantly across Kisse Loon savings feeds.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 20,
  },
  identityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#131b2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    fontFamily: 'Inter_700Bold',
  },
  sealBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fea619',
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: {
    flex: 1,
    minWidth: 0,
  },
  identityTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
    fontFamily: 'Inter_600SemiBold',
  },
  identitySubtitle: {
    marginTop: 1,
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16.5,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  memberPill: {
    marginTop: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e5eeff',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  memberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4edea3',
  },
  memberText: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  formBlock: {
    gap: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
    fontFamily: 'Inter_600SemiBold',
  },
  unsavedPill: {
    backgroundColor: '#ffddb8',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unsavedText: {
    color: '#2a1700',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  fields: {
    gap: 12,
    width: '100%',
  },
  field: {
    gap: 6,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 16,
  },
  label: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_600SemiBold',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  verifiedText: {
    color: '#059669',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  inputCard: {
    width: '100%',
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputCardLocked: {
    backgroundColor: '#eff4ff',
    shadowOpacity: 0,
    elevation: 0,
  },
  iconSlot: {
    width: 24,
    height: 24,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputSlot: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    justifyContent: 'center',
  },
  trailingSlot: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    color: '#0b1c30',
    fontSize: 16,
    letterSpacing: -0.16,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  lockedValue: {
    color: '#45464d',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.16,
    fontFamily: 'Inter_400Regular',
  },
  clearBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  helperText: {
    flex: 1,
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  actionBlock: {
    gap: 8,
    paddingTop: 0,
  },
  saveBtn: {
    height: 54,
    borderRadius: 12,
    backgroundColor: '#fea619',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  saveBtnDisabled: {
    opacity: 0.55,
  },
  saveBtnText: {
    color: '#684000',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
    fontFamily: 'Inter_600SemiBold',
  },
  footerNote: {
    textAlign: 'center',
    color: '#76777d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
});
