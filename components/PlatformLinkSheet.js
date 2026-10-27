import { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import BottomSheet from './BottomSheet';
import PlatformIcon from './PlatformIcon';
import { ArrowIcon, ClearIcon } from './icons';
import { DEMO_OTP, DEMO_PHONE, isDemoOtp, maskPhone } from '../constants/auth';
import { Pressable, Text, TextInput, View } from '../theme/themed';

const OTP_LENGTH = 6;

export default function PlatformLinkSheet({
  visible,
  platform,
  onClose,
  onLinked,
}) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const otpRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setStep('phone');
      setPhone('');
      setOtp('');
      setError('');
    }
  }, [visible, platform?.id]);

  const canSend = phone.length === 10;
  const canVerify = otp.length === OTP_LENGTH;

  const handlePhoneChange = (value) => {
    setError('');
    setPhone(value.replace(/\D/g, '').slice(0, 10));
  };

  const handleSendOtp = () => {
    if (!canSend) return;
    setStep('otp');
    setOtp('');
    setError('');
    setTimeout(() => otpRef.current?.focus(), 120);
  };

  const handleVerify = () => {
    if (!isDemoOtp(otp)) {
      setError(`Invalid OTP. Use demo code ${DEMO_OTP}`);
      return;
    }
    Keyboard.dismiss();
    onLinked?.({
      id: platform.id,
      phone,
      status: 'connected',
    });
  };

  if (!platform) return null;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      maxHeight="88%"
      avoidKeyboard
    >
      <View style={styles.header}>
        <PlatformIcon platform={platform} size={step === 'otp' ? 36 : 48} />
        <Text style={styles.title}>
          {step === 'otp' ? 'Enter OTP' : `Connect ${platform.name}`}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'phone'
            ? `Mobile number linked to your ${platform.name} account`
            : `Code sent to ${maskPhone(phone)}`}
        </Text>
      </View>

      {step === 'phone' ? (
        <>
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
            {phone.length > 0 ? (
              <Pressable
                style={styles.clearButton}
                onPress={() => setPhone('')}
                hitSlop={8}
              >
                <ClearIcon width={15} height={15} />
              </Pressable>
            ) : null}
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
            style={[styles.cta, !canSend && styles.ctaDisabled]}
            disabled={!canSend}
            onPress={handleSendOtp}
          >
            <Text style={styles.ctaText}>Get OTP</Text>
            <ArrowIcon width={12} height={12} />
          </Pressable>
        </>
      ) : (
        <>
          <Pressable
            style={styles.otpWrap}
            onPress={() => otpRef.current?.focus()}
          >
            <View style={styles.otpRow}>
              {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                const digit = otp[index] ?? '';
                const isNext = index === otp.length;
                return (
                  <View
                    key={index}
                    style={[styles.otpBox, isNext && styles.otpBoxActive]}
                  >
                    <Text style={styles.otpDigit}>{digit}</Text>
                  </View>
                );
              })}
            </View>
            <TextInput
              ref={otpRef}
              value={otp}
              onChangeText={(value) => {
                setError('');
                setOtp(value.replace(/\D/g, '').slice(0, OTP_LENGTH));
              }}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              style={styles.hiddenInput}
              caretHidden
            />
          </Pressable>

          <Pressable
            style={styles.demoFill}
            onPress={() => {
              setError('');
              setOtp(DEMO_OTP);
            }}
          >
            <Text style={styles.demoFillText}>
              Demo OTP: {DEMO_OTP} (tap to fill)
            </Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.cta, !canVerify && styles.ctaDisabled]}
            disabled={!canVerify}
            onPress={handleVerify}
          >
            <Text style={styles.ctaText}>Verify & Connect</Text>
            <ArrowIcon width={12} height={12} />
          </Pressable>

          <Pressable
            style={styles.change}
            onPress={() => {
              setStep('phone');
              setOtp('');
              setError('');
            }}
          >
            <Text style={styles.changeText}>Change number</Text>
          </Pressable>
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  title: {
    color: '#0b1c30',
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#76777d',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
    textAlign: 'center',
  },
  label: {
    color: '#45464d',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.6,
    marginBottom: 8,
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
    gap: 8,
    paddingRight: 10,
  },
  prefixText: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#c6c6cd',
  },
  input: {
    flex: 1,
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  demoFill: {
    marginTop: 10,
    marginBottom: 12,
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
  },
  ctaDisabled: {
    opacity: 0.55,
  },
  ctaText: {
    color: '#684000',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  otpWrap: {
    marginBottom: 4,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxActive: {
    backgroundColor: '#fff4df',
  },
  otpDigit: {
    color: '#0b1c30',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  error: {
    color: '#ba1a1a',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 10,
  },
  change: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  changeText: {
    color: '#855300',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    textDecorationLine: 'underline',
  },
});
