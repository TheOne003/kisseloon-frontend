import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  LockIcon,
  ShieldIcon,
  VerifyArrowIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import PlatformIcon from '../components/PlatformIcon';
import { DEMO_OTP, isDemoOtp, maskEmail } from '../constants/auth';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const OTP_LENGTH = 6;

const FEED = [
  { id: 'blinkit', name: 'Blinkit', time: '11 mins' },
  { id: 'zepto', name: 'Zepto', time: '9 mins' },
  { id: 'instamart', name: 'Instamart', time: '14 mins' },
];

export default function OtpScreen({
  email,
  onBack,
  onChangeEmail,
  onVerify,
  onHelp,
}) {
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const verifyYRef = useRef(0);
  const verifyTimerRef = useRef(null);

  const scrollVerifyIntoView = useCallback(() => {
    const y = Math.max(0, verifyYRef.current - 24);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y, animated: true });
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 280);
    return () => {
      clearTimeout(timer);
      if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event) => {
      const height = event?.endCoordinates?.height ?? 0;
      setKeyboardHeight(height);
      // Keep Verify CTA above the keyboard.
      setTimeout(scrollVerifyIntoView, Platform.OS === 'ios' ? 40 : 80);
    };
    const onHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollVerifyIntoView]);

  const handleOtpChange = (value) => {
    if (verifying) return;
    setError('');
    setInfo('');
    setOtp(value.replace(/\D/g, '').slice(0, OTP_LENGTH));
  };

  const handleVerify = () => {
    if (verifying) return;
    if (!isDemoOtp(otp)) {
      setError(`Invalid OTP. Use demo code ${DEMO_OTP}`);
      return;
    }
    setError('');
    setVerifying(true);
    Keyboard.dismiss();
    // Short beat so Verify → Home transition feels intentional.
    verifyTimerRef.current = setTimeout(() => {
      onVerify?.(otp);
    }, 420);
  };

  const handleResend = () => {
    setOtp('');
    setError('');
    setInfo(`Demo OTP resent: ${DEMO_OTP}`);
    inputRef.current?.focus();
  };

  const fillDemoOtp = () => {
    setError('');
    setInfo('');
    setOtp(DEMO_OTP);
  };

  const canVerify = otp.length === OTP_LENGTH;
  const activeIndex = Math.min(otp.length, OTP_LENGTH - 1);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>Verify Otp</Text>
        <Pressable
          style={styles.helpButton}
          onPress={onHelp}
          accessibilityLabel="Help"
        >
          <Text style={styles.helpText}>?</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom:
                28 + (keyboardHeight > 0 ? Math.max(keyboardHeight * 0.15, 20) : 0) +
                insets.bottom,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.stepBlock}>
            <View style={styles.stepPill}>
              <View style={styles.stepDot} />
              <Text style={styles.stepText}>STEP 2 OF 2 • SECURE VERIFICATION</Text>
            </View>

            <Image
              source={require('../assets/brand/kisse-loon-brand.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headingBlock}>
            <Text style={styles.title}>Enter your OTP</Text>
            <Text style={styles.subtitle}>We sent a 6-digit code to</Text>
            <View style={styles.phoneRow}>
              <Text style={styles.phoneText}>{maskEmail(email)}</Text>
              <Pressable onPress={onChangeEmail} hitSlop={8}>
                <Text style={styles.changeText}>Change</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={styles.otpSection}
            onPress={() => inputRef.current?.focus()}
          >
            <View style={styles.otpRow}>
              {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                const digit = otp[index] ?? '';
                const isActive = index === activeIndex && otp.length < OTP_LENGTH;
                const isFilled = Boolean(digit);
                const isNextEmpty =
                  index === otp.length && otp.length < OTP_LENGTH;

                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      isNextEmpty && styles.otpBoxHighlight,
                      isActive && styles.otpBoxActive,
                      isFilled && styles.otpBoxFilled,
                    ]}
                  >
                    <Text style={styles.otpDigit}>{digit}</Text>
                  </View>
                );
              })}
            </View>

            <TextInput
              ref={inputRef}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              style={styles.hiddenInput}
              caretHidden
            />

            <View style={styles.feedbackRow}>
              <View style={styles.feedbackLeft}>
                <LockIcon width={9} height={12} />
                <Text style={styles.feedbackLeftText}>
                  Check your inbox for the code
                </Text>
              </View>
              <Text style={styles.feedbackRight}>
                {otp.length} of {OTP_LENGTH} entered
              </Text>
            </View>

            <Pressable style={styles.demoHint} onPress={fillDemoOtp}>
              <Text style={styles.demoHintText}>
                Demo OTP: {DEMO_OTP} (tap to fill)
              </Text>
            </Pressable>

            {!!error && <Text style={styles.errorText}>{error}</Text>}
            {!!info && <Text style={styles.infoText}>{info}</Text>}
          </Pressable>

          <View
            onLayout={(event) => {
              verifyYRef.current = event.nativeEvent.layout.y;
            }}
          >
            <Pressable
              style={[
                styles.cta,
                (!canVerify || verifying) && styles.ctaDisabled,
              ]}
              disabled={!canVerify || verifying}
              onPress={handleVerify}
            >
              {verifying ? (
                <>
                  <ActivityIndicator color="#684000" size="small" />
                  <Text style={styles.ctaText}>Signing you in…</Text>
                </>
              ) : (
                <>
                  <Text style={styles.ctaText}>Verify & Sign In</Text>
                  <VerifyArrowIcon width={13} height={13} />
                </>
              )}
            </Pressable>
          </View>

          <View style={styles.resendBlock}>
            <View style={styles.resendRow}>
              <Text style={styles.resendPrompt}>Didn't receive the code?</Text>
              <Pressable hitSlop={6} onPress={handleResend}>
                <Text style={styles.resendLink}>Resend OTP</Text>
              </Pressable>
            </View>
            <View style={styles.altChannel}>
              <Text style={styles.altChannelText}>
                Check your inbox or spam folder
              </Text>
            </View>
          </View>

          <View style={styles.feedCard}>
            <View style={styles.feedHeader}>
              <Text style={styles.feedLabel}>LIVE COMPARISON FEED</Text>
              <View style={styles.syncRow}>
                <View style={styles.syncDot} />
                <Text style={styles.syncText}>Synchronized</Text>
              </View>
            </View>
            <View style={styles.feedBody}>
              {FEED.map((item, index) => (
                <View key={item.id} style={styles.feedItemWrap}>
                  {index > 0 && <View style={styles.feedDivider} />}
                  <View style={styles.feedItem}>
                    <PlatformIcon platform={item} size={20} />
                    <View>
                      <Text style={styles.feedName}>{item.name}</Text>
                      <Text style={styles.feedTime}>{item.time}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.trustRow}>
            <ShieldIcon width={11} height={13} />
            <Text style={styles.trustText}>
              256-bit encrypted checkout routing • Zero spam
            </Text>
          </View>
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
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(248,249,255,0.92)',
  },
  headerTitle: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 24,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  helpText: {
    color: '#fa8c1a',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  stepBlock: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dce9ff',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: '#fea619',
  },
  stepText: {
    color: '#0b1c30',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
    lineHeight: 12,
  },
  logo: {
    width: 96,
    height: 96,
  },
  headingBlock: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    color: '#0b1c30',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.48,
    lineHeight: 32,
    marginBottom: 4,
  },
  subtitle: {
    color: '#45464d',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  phoneRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneText: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.4,
    lineHeight: 24,
  },
  changeText: {
    color: '#855300',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.24,
    lineHeight: 16,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(133,83,0,0.5)',
  },
  otpSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  otpBoxFilled: {
    backgroundColor: '#fff',
  },
  otpBoxHighlight: {
    backgroundColor: '#eff4ff',
  },
  otpBoxActive: {
    borderWidth: 1.5,
    borderColor: '#fea619',
  },
  otpDigit: {
    color: '#0b1c30',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.48,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  feedbackLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  feedbackLeftText: {
    color: '#45464d',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.4,
    lineHeight: 12,
  },
  feedbackRight: {
    color: '#855300',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.4,
    lineHeight: 12,
  },
  demoHint: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  demoHintText: {
    color: '#855300',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textDecorationLine: 'underline',
  },
  errorText: {
    marginTop: 8,
    color: '#e11d48',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  infoText: {
    marginTop: 8,
    color: '#059669',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  cta: {
    marginHorizontal: 16,
    backgroundColor: '#fea619',
    borderRadius: 12,
    minHeight: 48,
    paddingVertical: 12,
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
    opacity: 0.9,
  },
  ctaText: {
    color: '#684000',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    lineHeight: 24,
  },
  resendBlock: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  resendPrompt: {
    color: '#45464d',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  resendLink: {
    color: '#855300',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.14,
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
  altChannel: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  altChannelText: {
    color: 'rgba(69,70,77,0.7)',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.4,
    lineHeight: 12,
  },
  feedCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  feedLabel: {
    color: '#45464d',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
    lineHeight: 12,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 9999,
    backgroundColor: '#4edea3',
  },
  syncText: {
    color: '#059669',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.4,
    lineHeight: 12,
  },
  feedBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  feedItemWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#dce9ff',
  },
  feedItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  feedName: {
    color: '#0b1c30',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.24,
    lineHeight: 16,
  },
  feedTime: {
    color: '#45464d',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.4,
    lineHeight: 12,
  },
  trustRow: {
    marginTop: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  trustText: {
    color: 'rgba(69,70,77,0.8)',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.4,
    lineHeight: 12,
  },
});
