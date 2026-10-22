import { useMemo } from 'react';
import {
  StyleSheet
} from 'react-native';

import {
  ArrowFillCtaIcon,
  BoltIcon,
  CartIcon,
  InfoIcon,
  PiggyBankStrokeIcon,
  SplitArrowsIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import { HeaderProfileButton } from '../components/HeaderIconButton';
import { getCartSummary } from '../constants/demoCart';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const WHY_DIFFERS = [
  'Item prices vary by platform partner',
  'Delivery, platform and packing fees differ by distance',
  'Store coupon availability & surge rates vary',
  'Smart split saves more by ordering food & grocery from their lowest-cost source',
];

function Breakdown({ rows, totalLabel, total, totalSize = 16 }) {
  return (
    <View style={styles.breakdown}>
      {rows.map((row) => (
        <View key={row.label} style={styles.breakdownRow}>
          <Text
            style={[
              styles.breakdownLabel,
              row.accent && styles.accentLabel,
            ]}
          >
            {row.label}
          </Text>
          <Text
            style={[
              styles.breakdownValue,
              row.accent && styles.accentValue,
            ]}
          >
            {row.value}
          </Text>
        </View>
      ))}
      <View style={styles.breakdownDivider} />
      <View style={styles.breakdownRow}>
        <Text style={[styles.combinedLabel, totalSize < 16 && styles.totalLabelSm]}>
          {totalLabel}
        </Text>
        <Text style={[styles.combinedValue, totalSize < 16 && styles.totalValueSm]}>
          ₹{total}
        </Text>
      </View>
    </View>
  );
}

export default function CartPriceComparisonScreen({
  items = [],
  onBack,
  onEditCart,
  onChooseWhereToBuy,
}) {
  const summary = useMemo(() => getCartSummary(items), [items]);

  const itemsSubtotal = summary.foodSubtotal + summary.grocerySubtotal;
  const bestTotal = summary.total || 391;
  const saveAmount = summary.saveAmount || 58;
  const deliveryBest = 45;
  const directTotal = bestTotal + 30;

  const mixLabel =
    summary.foodCount && summary.groceryCount
      ? 'Food + Grocery'
      : summary.foodCount
        ? 'Food'
        : summary.groceryCount
          ? 'Grocery'
          : 'Empty';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={onBack} />
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Cart Price Comparison</Text>
            <Text style={styles.headerSubtitle}>
              Smart Multi-Platform Comparison
            </Text>
          </View>
        </View>
        <HeaderProfileButton />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryStrip}>
          <View style={styles.summaryLeft}>
            <View style={styles.summaryIcon}>
              <CartIcon width={17} height={15} color="#0B1C30" />
            </View>
            <View>
              <Text style={styles.summaryTitle}>Your cart</Text>
              <Text style={styles.summaryMeta}>
                {summary.totalCount} item{summary.totalCount === 1 ? '' : 's'} •{' '}
                {mixLabel}
              </Text>
            </View>
          </View>
          <Pressable style={styles.editBtn} onPress={onEditCart}>
            <Text style={styles.editBtnText}>Edit Cart</Text>
          </Pressable>
        </View>

        <View style={styles.optimizerBanner}>
          <View style={styles.optimizerIcon}>
            <SplitArrowsIcon width={15} height={12} color="#FEA619" />
          </View>
          <View style={styles.optimizerText}>
            <View style={styles.optimizerTitleRow}>
              <Text style={styles.optimizerTitle}>Dual-Basket Optimizer</Text>
              <View style={styles.bestRatePill}>
                <Text style={styles.bestRateText}>BEST RATE</Text>
              </View>
            </View>
            <Text style={styles.optimizerSubtitle}>
              Best available combination across platforms
            </Text>
          </View>
        </View>

        <View style={styles.keyResult}>
          <Text style={styles.keyLabel}>BEST COMBINED RATE</Text>
          <Text style={styles.keyPrice}>₹{bestTotal}</Text>
          <View style={styles.savePill}>
            <PiggyBankStrokeIcon width={13} height={13} color="#059669" />
            <Text style={styles.savePillText}>You save ₹{saveAmount}</Text>
          </View>
          <Text style={styles.keyHint}>vs. highest comparable total</Text>
        </View>

        {/* Best split: Swiggy + Blinkit */}
        <View style={[styles.optionCard, styles.optionCardBest]}>
          <View style={styles.optionTop}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionTitle}>
                Swiggy (Food) + Blinkit (Grocery)
              </Text>
              <View style={styles.bestTotalPill}>
                <Text style={styles.bestTotalText}>BEST TOTAL</Text>
              </View>
            </View>
            <View style={styles.optionPriceBlock}>
              <Text style={styles.optionPriceBest}>₹{bestTotal}</Text>
              <Text style={styles.optionSave}>Save ₹{saveAmount}</Text>
            </View>
          </View>

          <Breakdown
            rows={[
              { label: 'Items', value: `₹${itemsSubtotal || 355}` },
              { label: 'Delivery & Packing', value: `₹${deliveryBest}` },
              {
                label: 'Applied Discounts',
                value: `−₹${saveAmount}`,
                accent: true,
              },
            ]}
            totalLabel="Combined Total"
            total={bestTotal}
          />

          <View style={styles.badgeRow}>
            <View style={styles.etaBadge}>
              <Text style={styles.etaBadgeText}>🍔 Food ~30m</Text>
            </View>
            <View style={styles.etaBadge}>
              <BoltIcon width={10} height={12} color="#45464D" />
              <Text style={styles.etaBadgeText}>Grocery ~11m</Text>
            </View>
          </View>
        </View>

        {/* Swiggy direct */}
        <View style={styles.optionCard}>
          <View style={styles.optionTop}>
            <View style={styles.optionLeft}>
              <View style={styles.titleWithTag}>
                <Text style={styles.optionTitle}>Swiggy</Text>
                <View style={styles.directPill}>
                  <Text style={styles.directPillText}>Direct</Text>
                </View>
              </View>
              <Text style={styles.optionSubtitle}>
                Complete basket via Swiggy Instamart
              </Text>
            </View>
            <View style={styles.optionPriceBlock}>
              <Text style={styles.optionPrice}>₹{directTotal}</Text>
              <Text style={styles.optionMore}>+₹30 more</Text>
            </View>
          </View>

          <Breakdown
            rows={[
              { label: 'Items', value: `₹${itemsSubtotal || 400}` },
              { label: 'Delivery & Packing', value: '₹59' },
              { label: 'Discounts', value: '−₹38', accent: true },
            ]}
            totalLabel="Total"
            total={directTotal}
            totalSize={14}
          />
        </View>

        {/* Zomato incomplete */}
        <View style={[styles.optionCard, styles.optionCardMuted]}>
          <View style={styles.titleWithTag}>
            <Text style={[styles.optionTitle, styles.optionTitleMuted]}>
              Zomato
            </Text>
            <View style={styles.warningPill}>
              <Text style={styles.warningPillText}>Some items unavailable</Text>
            </View>
          </View>
          <Text style={styles.optionSubtitle}>
            2 of 3 items available (Grocery item not serviceable)
          </Text>
          <View style={styles.partialRow}>
            <Text style={styles.partialText}>
              Items ₹365 • Missing Coke (750ml)
            </Text>
            <Text style={styles.viewItems}>View items →</Text>
          </View>
        </View>

        <View style={styles.whyCard}>
          <View style={styles.whyHeader}>
            <InfoIcon width={15} height={15} color="#0B1C30" />
            <Text style={styles.whyTitle}>Why totals differ</Text>
          </View>
          {WHY_DIFFERS.map((line) => (
            <View key={line} style={styles.whyRow}>
              <Text style={styles.whyBullet}>•</Text>
              <Text style={styles.whyText}>{line}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.primaryCta} onPress={onChooseWhereToBuy}>
          <Text style={styles.primaryCtaText}>Choose where to buy</Text>
          <ArrowFillCtaIcon width={13} height={13} color="#131B2E" />
        </Pressable>

        <View style={styles.disclaimer}>
          <InfoIcon width={12} height={12} color="#45464D" />
          <Text style={styles.disclaimerText}>
            Final price may vary at checkout based on live platform surge &
            taxes.
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
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(248,249,255,0.85)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  headerTitles: {
    paddingLeft: 2,
  },
  headerTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  headerSubtitle: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 20,
  },
  summaryStrip: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e5eeff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  summaryMeta: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  editBtn: {
    backgroundColor: 'rgba(254,166,25,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  editBtnText: {
    color: '#855300',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_600SemiBold',
  },
  optimizerBanner: {
    backgroundColor: '#0a1c30',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optimizerIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,166,26,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optimizerText: {
    flex: 1,
  },
  optimizerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  optimizerTitle: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  bestRatePill: {
    backgroundColor: '#002112',
    borderRadius: 999,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  bestRateText: {
    color: '#70fabd',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  optimizerSubtitle: {
    color: '#b2bfd9',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  keyResult: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  keyLabel: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  keyPrice: {
    color: '#0b1c30',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
    fontFamily: 'Inter_800ExtraBold',
  },
  savePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#e8f8f0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  savePillText: {
    color: '#059669',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_700Bold',
  },
  keyHint: {
    color: '#76777d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionCardBest: {
    borderWidth: 1,
    borderColor: '#dce9ff',
  },
  optionCardMuted: {
    backgroundColor: 'rgba(239,244,255,0.7)',
    shadowOpacity: 0,
    elevation: 0,
    gap: 8,
  },
  optionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionLeft: {
    flex: 1,
    gap: 4,
  },
  titleWithTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  optionTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  optionTitleMuted: {
    color: 'rgba(11,28,48,0.8)',
  },
  bestTotalPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff4ff',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  bestTotalText: {
    color: '#059669',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  directPill: {
    backgroundColor: '#e5eeff',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  directPillText: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  warningPill: {
    backgroundColor: '#ffdad6',
    borderRadius: 999,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  warningPillText: {
    color: '#93000a',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_500Medium',
  },
  optionSubtitle: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  optionPriceBlock: {
    alignItems: 'flex-end',
  },
  optionPrice: {
    color: '#0b1c30',
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: -0.2,
    fontFamily: 'Inter_700Bold',
  },
  optionPriceBest: {
    color: '#0b1c30',
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: -0.48,
    fontFamily: 'Inter_800ExtraBold',
  },
  optionSave: {
    marginTop: 2,
    color: '#059669',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_600SemiBold',
  },
  optionMore: {
    marginTop: 2,
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  breakdown: {
    backgroundColor: '#eff4ff',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  breakdownValue: {
    color: '#0b1c30',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_600SemiBold',
  },
  accentLabel: {
    color: '#059669',
    fontFamily: 'Inter_500Medium',
  },
  accentValue: {
    color: '#059669',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#d3e4fe',
  },
  combinedLabel: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  combinedValue: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_700Bold',
  },
  totalLabelSm: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
  },
  totalValueSm: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
    fontFamily: 'Inter_600SemiBold',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#eff4ff',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  etaBadgeText: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  partialRow: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  partialText: {
    flex: 1,
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  viewItems: {
    color: '#0b1c30',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_600SemiBold',
  },
  whyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  whyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  whyTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  whyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  whyBullet: {
    color: '#855300',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  whyText: {
    flex: 1,
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  primaryCta: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fea619',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  primaryCtaText: {
    color: '#131b2e',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_700Bold',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },
  disclaimerText: {
    flex: 1,
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
