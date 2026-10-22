import { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native';

import { ArrowIcon, ClearIcon, ScaleIcon } from '../components/icons';
import PlatformIcon from '../components/PlatformIcon';
import { DEMO_PHONE } from '../constants/auth';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const PARTNERS = [
  { id: 'blinkit', name: 'Blinkit' },
  { id: 'zepto', name: 'Zepto' },
  { id: 'instamart', name: 'Instamart' },
];

export default function WelcomeScreen({ onGetOtp }) {
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
  };

  const canSubmit = phone.length === 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedStatusBar />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Image
              source={require('../assets/brand/kisse-loon-brand.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.pill}>
              <ScaleIcon width={12} height={11} />
              <Text style={styles.pillText}>India's Smart Price Checker</Text>
            </View>
          </View>

          <View style={styles.headingBlock}>
            <Text style={styles.title}>Welcome to Kisse Loon</Text>
            <Text style={styles.subtitle}>
              Compare prices. Save more. Order{'\n'}smarter across Blinkit, Zepto
              & Instamart.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>MOBILE NUMBER</Text>

            <View style={styles.inputRow}>
              <View style={styles.prefix}>
                <Text style={styles.prefixText}>+91</Text>
                <View style={styles.divider} />
              </View>

              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder="Enter 10-digit number"
                placeholderTextColor="rgba(118,119,125,0.7)"
                keyboardType="number-pad"
                maxLength={10}
                textContentType="telephoneNumber"
                autoComplete="tel"
              />

              {phone.length > 0 && (
                <Pressable
                  style={styles.clearButton}
                  onPress={() => setPhone('')}
                  hitSlop={8}
                  accessibilityLabel="Clear mobile number"
                >
                  <ClearIcon width={15} height={15} />
                </Pressable>
              )}
            </View>

            <Pressable
              style={styles.demoFill}
              onPress={() => setPhone(DEMO_PHONE)}
            >
              <Text style={styles.demoFillText}>
                Use demo number {DEMO_PHONE}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.cta, !canSubmit && styles.ctaDisabled]}
              disabled={!canSubmit}
              onPress={() => {
                Keyboard.dismiss();
                onGetOtp?.(phone);
              }}
            >
              <Text style={styles.ctaText}>Get OTP</Text>
              <ArrowIcon width={12} height={12} />
            </Pressable>
          </View>

          <View style={styles.trustBar}>
            <Text style={styles.trustLabel}>LIVE PRICE SYNC FROM</Text>
            <View style={styles.partners}>
              {PARTNERS.map((partner) => (
                <View key={partner.id} style={styles.partnerChip}>
                  <PlatformIcon platform={partner} size={18} />
                  <Text style={styles.partnerText}>{partner.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.legal}>
            By continuing, you agree to our{' '}
            <Text style={styles.legalLink}>Terms of Service</Text> and{' '}
            <Text style={styles.legalLink}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 12,
  },
  logo: {
    width: 168,
    height: 168,
  },
  pill: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(254,166,25,0.15)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pillText: {
    color: '#684000',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
    lineHeight: 16,
  },
  headingBlock: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 24,
  },
  title: {
    color: '#0b1c30',
    fontSize: 28,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.7,
    lineHeight: 34,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    maxWidth: 280,
    color: '#45464d',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    color: '#45464d',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.6,
    lineHeight: 16,
    marginBottom: 6,
  },
  inputRow: {
    backgroundColor: '#eff4ff',
    borderRadius: 8,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 10,
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
  },
  prefixText: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.14,
    lineHeight: 18,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#c6c6cd',
    marginLeft: 4,
  },
  input: {
    flex: 1,
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.4,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    borderRadius: 9999,
  },
  demoFill: {
    marginTop: -8,
    alignSelf: 'flex-start',
  },
  demoFillText: {
    color: '#855300',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textDecorationLine: 'underline',
  },
  cta: {
    backgroundColor: '#fea619',
    borderRadius: 8,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaDisabled: {
    opacity: 0.55,
  },
  ctaText: {
    color: '#684000',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.14,
    lineHeight: 18,
  },
  trustBar: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  trustLabel: {
    color: '#76777d',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
    lineHeight: 12,
    marginBottom: 8,
  },
  partners: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 4,
    flexWrap: 'wrap',
  },
  partnerChip: {
    backgroundColor: '#eff4ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  partnerText: {
    color: '#0b1c30',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.4,
    lineHeight: 12,
  },
  legal: {
    marginTop: 24,
    paddingHorizontal: 16,
    color: '#45464d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.12,
    lineHeight: 19.5,
    textAlign: 'center',
  },
  legalLink: {
    color: '#0b1c30',
    fontFamily: 'Inter_500Medium',
    textDecorationLine: 'underline',
  },
});
