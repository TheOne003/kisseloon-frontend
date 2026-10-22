import { useState } from 'react';
import {
  StyleSheet
} from 'react-native';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  HelpLockIcon,
  MessageSquareIcon,
  ShieldAlertIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const FAQS = [
  {
    id: 'not-received',
    question: "Didn't receive the OTP?",
    answer:
      "Ensure your network connection is stable. Please wait at least 30 seconds before tapping 'Resend OTP'. We also recommend checking your SMS spam folder as security filters can sometimes misroute secure messages.",
  },
  {
    id: 'expired',
    question: 'OTP expired?',
    answer:
      'Each OTP is valid for a limited time. Tap Resend OTP to get a fresh code, then enter it promptly before it expires.',
  },
  {
    id: 'wrong-number',
    question: 'Getting wrong number?',
    answer:
      'Tap Change on the verification screen and re-enter your 10-digit mobile number carefully. OTPs are always sent to the number you submitted.',
  },
  {
    id: 'whatsapp-call',
    question: 'WhatsApp or Call OTP',
    answer:
      'If SMS is delayed, use Get OTP via WhatsApp or Call on the verification screen for an alternate delivery route.',
  },
];

export default function OtpHelpScreen({ onBack, onContactSupport }) {
  const [openId, setOpenId] = useState('not-received');

  const toggleFaq = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>OTP Help</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>SECURE ASSISTANCE PORTAL</Text>
          </View>
        </View>

        <View style={styles.introCard}>
          <View style={styles.iconWrap}>
            <ShieldAlertIcon width={32} height={32} />
          </View>
          <Text style={styles.introTitle}>Having trouble signing in?</Text>
          <Text style={styles.introBody}>
            Verify your secure route details and find quick answers to OTP
            issues below.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>

        <View style={styles.faqDeck}>
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <View key={faq.id} style={styles.faqCard}>
                <Pressable
                  style={styles.faqHeader}
                  onPress={() => toggleFaq(faq.id)}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  {isOpen ? (
                    <ChevronUpIcon width={16} height={16} />
                  ) : (
                    <ChevronDownIcon width={16} height={16} />
                  )}
                </Pressable>
                {isOpen && (
                  <View style={styles.faqAnswerWrap}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusLabel}>AGGREGATOR STATUS</Text>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Fully Operational</Text>
            </View>
          </View>
          <Text style={styles.statusBody}>
            OTP servers are currently synchronized across checkout routes for
            Blinkit, Zepto, and Instamart.
          </Text>
        </View>

        <View style={styles.helpBanner}>
          <Text style={styles.helpTitle}>Still need help?</Text>
          <Text style={styles.helpBody}>
            Our instant support agents are available to route you past any
            verification block manually.
          </Text>
          <Pressable style={styles.supportButton} onPress={onContactSupport}>
            <Text style={styles.supportButtonText}>
              Chat with Customer Support
            </Text>
            <MessageSquareIcon width={14} height={14} />
          </Pressable>
        </View>

        <View style={styles.trustRow}>
          <HelpLockIcon width={11} height={14} />
          <Text style={styles.trustText}>
            256-bit encrypted checkout routing • Zero spam
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248,249,255,0.92)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 24,
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 20,
  },
  badgeRow: {
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dce9ff',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fea619',
  },
  badgeText: {
    color: '#0b1c30',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
    lineHeight: 12,
  },
  introCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff9ed',
    borderWidth: 1,
    borderColor: '#ffe6c2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitle: {
    color: '#0b1c30',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    lineHeight: 24,
    textAlign: 'center',
  },
  introBody: {
    color: '#45464d',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 280,
  },
  sectionLabel: {
    color: '#45464d',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingLeft: 4,
    paddingTop: 4,
  },
  faqDeck: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    lineHeight: 20,
  },
  faqAnswerWrap: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecf5',
  },
  faqAnswer: {
    color: '#45464d',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  statusLabel: {
    color: '#45464d',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4edea3',
  },
  statusText: {
    color: '#059669',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  statusBody: {
    color: '#45464d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  helpBanner: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#ffebb7',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  helpTitle: {
    color: '#855300',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  helpBody: {
    color: '#45464d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
    marginTop: 4,
  },
  supportButton: {
    backgroundColor: '#fea619',
    borderRadius: 10,
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
  supportButtonText: {
    color: '#684000',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  trustText: {
    color: '#45464d',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.4,
    lineHeight: 12,
  },
});
