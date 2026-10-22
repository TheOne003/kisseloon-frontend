import { useMemo, useState } from 'react';
import {
  StyleSheet
} from 'react-native';

import Svg, { Path } from 'react-native-svg';
import {
  ArrowFillCtaIcon,
  BagIcon,
  BoltIcon,
  ClockIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import { HeaderProfileButton } from '../components/HeaderIconButton';
import PlatformIcon from '../components/PlatformIcon';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

function CheckMarkIcon({ width = 11, height = 8, color = '#FFFFFF' }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 11 8" fill="none">
      <Path
        d="M1 4L4 7L10 1"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlatformCard({ platform, selected, onPress }) {
  if (platform.incomplete) {
    return (
      <View style={[styles.platformCard, styles.platformCardIncomplete]}>
        <View style={styles.platformLeft}>
          <View style={styles.iconDisabledWrap}>
            <PlatformIcon platform={platform} size={40} borderWidth={0} />
          </View>
          <View style={styles.platformInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.platformNameMuted}>{platform.name}</Text>
              <View style={styles.incompletePill}>
                <Text style={styles.incompletePillText}>{platform.readyLabel}</Text>
              </View>
            </View>
            <Text style={styles.incompleteSubtitle}>{platform.subtitle}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      style={[styles.platformCard, selected && styles.platformCardSelected]}
      onPress={onPress}
    >
      {platform.best ? (
        <View style={styles.bestTotalTag}>
          <Text style={styles.bestTotalTagText}>★ BEST TOTAL</Text>
        </View>
      ) : null}

      <View style={styles.platformRow}>
        <View style={styles.platformLeft}>
          <PlatformIcon platform={platform} size={48} borderWidth={0} />
          <View style={styles.platformInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.platformName}>{platform.name}</Text>
              <View style={styles.readyPill}>
                <Text style={styles.readyPillText}>{platform.readyLabel}</Text>
              </View>
            </View>
            <View style={styles.etaRow}>
              {platform.etaTone === 'best' ? (
                <BoltIcon width={9} height={12} color="#059669" />
              ) : (
                <ClockIcon width={12} height={12} color="#45464D" />
              )}
              <Text
                style={[
                  styles.etaText,
                  platform.etaTone === 'best' && styles.etaTextBest,
                ]}
              >
                {platform.eta}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.platformRight}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalPrice}>₹{platform.total}</Text>
          {platform.saveLabel ? (
            <View style={styles.savePill}>
              <Text style={styles.savePillText}>{platform.saveLabel}</Text>
            </View>
          ) : null}
          {platform.moreLabel ? (
            <Text style={styles.moreLabel}>{platform.moreLabel}</Text>
          ) : null}
          <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected ? <CheckMarkIcon /> : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function CartPlatformSelectionScreen({
  selection,
  onBack,
  onContinue,
}) {
  const [selectedId, setSelectedId] = useState(
    selection?.defaultPlatformId ||
      selection?.platforms?.find((p) => p.selectable !== false)?.id ||
      null
  );

  const selectedPlatform = useMemo(
    () =>
      selection?.platforms?.find(
        (p) => p.id === selectedId && p.selectable !== false
      ) || selection?.platforms?.find((p) => p.selectable !== false),
    [selection, selectedId]
  );

  if (!selection) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={onBack} />
          <View>
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
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryTitleRow}>
              <BagIcon width={12} height={15} color="#684000" />
              <Text style={styles.summaryTitle}>Your optimized cart</Text>
            </View>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>
                {selection.itemCount} items
              </Text>
            </View>
          </View>
          <Text style={styles.itemLine} numberOfLines={2}>
            {selection.itemLine}
          </Text>
          <View style={styles.rateBanner}>
            <Text style={styles.rateBannerLabel}>Best combined rate found:</Text>
            <Text style={styles.rateBannerPrice}>
              {selection.bestCombinedRate != null
                ? `₹${selection.bestCombinedRate}`
                : '—'}
            </Text>
          </View>
        </View>

        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Choose your platform</Text>
          <Text style={styles.subheading}>Select your preferred platform</Text>
        </View>

        <View style={styles.platformList}>
          {selection.platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              selected={selectedId === platform.id}
              onPress={() => {
                if (platform.selectable === false) return;
                setSelectedId(platform.id);
              }}
            />
          ))}
        </View>

        <View style={styles.lowestBanner}>
          <View>
            <Text style={styles.lowestLabel}>LOWEST VALID TOTAL</Text>
            <View style={styles.lowestPriceRow}>
              <Text style={styles.lowestPrice}>
                {selectedPlatform?.total != null
                  ? `₹${selectedPlatform.total}`
                  : selection.bestCombinedRate != null
                    ? `₹${selection.bestCombinedRate}`
                    : '—'}
              </Text>
              <Text style={styles.lowestVia}>
                via {selectedPlatform?.name || 'unavailable'}
              </Text>
            </View>
          </View>
          <View style={styles.lowestSavePill}>
            <Text style={styles.lowestSaveText}>
              {selectedPlatform?.best
                ? `${selectedPlatform.saveLabel} total`
                : selectedPlatform?.moreLabel || 'Compare totals'}
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.cta, !selectedPlatform && styles.ctaDisabled]}
          disabled={!selectedPlatform}
          onPress={() => {
            if (!selectedPlatform) return;
            onContinue?.(selectedPlatform);
          }}
        >
          <Text style={styles.ctaText}>
            {selectedPlatform?.name
              ? `Continue with ${selectedPlatform.name}`
              : 'No complete platform available'}
          </Text>
          <ArrowFillCtaIcon width={13} height={13} color="#684000" />
        </Pressable>

        <Text style={styles.disclaimer}>
          ⓘ Final price may vary at checkout.
        </Text>
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
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  countPill: {
    backgroundColor: '#dce9ff',
    borderRadius: 999,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  countPillText: {
    color: '#0b1c30',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  itemLine: {
    color: '#76777d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  rateBanner: {
    backgroundColor: '#0a1c30',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateBannerLabel: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  rateBannerPrice: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_700Bold',
  },
  headingBlock: {
    marginTop: 20,
    marginBottom: 12,
    gap: 4,
  },
  heading: {
    color: '#0b1c30',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontFamily: 'Inter_700Bold',
  },
  subheading: {
    color: '#76777d',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  platformList: {
    gap: 12,
  },
  platformCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'visible',
  },
  platformCardSelected: {
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  platformCardIncomplete: {
    backgroundColor: '#eff4ff',
    opacity: 0.9,
    shadowOpacity: 0,
    elevation: 0,
  },
  bestTotalTag: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#fea619',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  bestTotalTagText: {
    color: '#684000',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  platformLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  iconDisabledWrap: {
    opacity: 0.55,
  },
  platformInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  platformName: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_700Bold',
  },
  platformNameMuted: {
    color: '#45464d',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  readyPill: {
    backgroundColor: '#dce9ff',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  readyPillText: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 16.5,
    fontFamily: 'Inter_500Medium',
  },
  incompletePill: {
    backgroundColor: 'rgba(255,218,214,0.6)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  incompletePillText: {
    color: '#ba1a1a',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  incompleteSubtitle: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  etaText: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  etaTextBest: {
    color: '#059669',
  },
  platformRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  totalLabel: {
    color: '#76777d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  totalPrice: {
    color: '#0b1c30',
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'Inter_800ExtraBold',
  },
  savePill: {
    backgroundColor: 'rgba(111,251,190,0.3)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  savePillText: {
    color: '#059669',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  moreLabel: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#dce9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: '#fea619',
  },
  lowestBanner: {
    marginTop: 12,
    backgroundColor: '#131b2e',
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
  lowestLabel: {
    color: '#7c839b',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontFamily: 'Inter_600SemiBold',
  },
  lowestPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  lowestPrice: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 36,
    fontFamily: 'Inter_800ExtraBold',
  },
  lowestVia: {
    color: '#7c839b',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  lowestSavePill: {
    backgroundColor: '#fea619',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lowestSaveText: {
    color: '#684000',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_700Bold',
  },
  cta: {
    marginTop: 20,
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
  ctaDisabled: {
    opacity: 0.45,
  },
  ctaText: {
    color: '#684000',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_700Bold',
  },
  disclaimer: {
    marginTop: 8,
    textAlign: 'center',
    color: '#76777d',
    fontSize: 10,
    lineHeight: 16.5,
    fontFamily: 'Inter_400Regular',
  },
});
