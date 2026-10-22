import { useMemo, useState } from 'react';
import {
  Image,
  StyleSheet
} from 'react-native';

import {
  DealCheckIcon,
  InfoIcon,
  PiggyIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import { HeaderProfileButton } from '../components/HeaderIconButton';
import PlatformIcon from '../components/PlatformIcon';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

function PlatformCard({ platform, selected, onPress }) {
  return (
    <Pressable
      style={[styles.platformCard, selected && styles.platformCardSelected]}
      onPress={onPress}
    >
      <View style={styles.platformLeft}>
        <PlatformIcon platform={platform} size={48} />
        <View style={styles.platformInfo}>
          <View style={styles.platformNameRow}>
            <Text style={styles.platformName}>{platform.name}</Text>
            {platform.best ? (
              <View style={styles.bestPricePill}>
                <Text style={styles.bestPricePillText}>BEST PRICE</Text>
              </View>
            ) : null}
          </View>
          {platform.best ? (
            <Text style={styles.saveVsHighest}>{platform.saveLabel}</Text>
          ) : (
            <View style={styles.timePill}>
              <Text style={styles.timePillText}>{platform.time}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={[styles.platformPrice, selected && styles.platformPriceSelected]}>
        ₹{platform.price}
      </Text>
    </Pressable>
  );
}

export default function PlatformSelectionScreen({
  selection,
  onBack,
  onProfile,
  onContinue,
}) {
  const [selectedId, setSelectedId] = useState(
    selection?.defaultPlatformId || 'instamart'
  );

  const selectedPlatform = useMemo(
    () =>
      selection?.platforms?.find((p) => p.id === selectedId) ||
      selection?.platforms?.[0],
    [selection, selectedId]
  );

  if (!selection) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={onBack} />
          <Text style={styles.headerTitle}>Platform Selection</Text>
        </View>
        <HeaderProfileButton onPress={onProfile} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryImageWrap}>
            <Image source={selection.image} style={styles.summaryImage} />
          </View>
          <View style={styles.summaryTexts}>
            <View style={styles.selectedPill}>
              <Text style={styles.selectedPillText}>SELECTED ITEM</Text>
            </View>
            <Text style={styles.summaryTitle} numberOfLines={2}>
              {selection.itemTitle}
            </Text>
            <Text style={styles.summarySubtitle} numberOfLines={1}>
              {selection.restaurantLine}
            </Text>
          </View>
        </View>

        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Compare platforms</Text>
          <Text style={styles.subheading}>Choose where you want to order.</Text>
        </View>

        <View style={styles.platformList}>
          {selection.platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              selected={selectedId === platform.id}
              onPress={() => setSelectedId(platform.id)}
            />
          ))}
        </View>

        <View style={styles.dealCard}>
          <View style={styles.dealLeft}>
            <View style={styles.dealLabelRow}>
              <DealCheckIcon width={14} height={13} />
              <Text style={styles.dealLabel}>BEST PRICE DEAL</Text>
            </View>
            <View style={styles.dealPriceRow}>
              <Text style={styles.dealPrice}>₹{selection.bestPrice}</Text>
              <Text style={styles.dealStrike}>₹{selection.highestPrice}</Text>
            </View>
          </View>
          <View style={styles.dealRight}>
            <View style={styles.saveBadge}>
              <PiggyIcon width={12} height={11} />
              <Text style={styles.saveBadgeText}>Save ₹{selection.saveAmount}</Text>
            </View>
            <Text style={styles.vsText}>vs highest platform</Text>
          </View>
        </View>

        <Pressable
          style={styles.cta}
          onPress={() => onContinue?.(selectedPlatform)}
        >
          <Text style={styles.ctaText}>
            Continue with {selectedPlatform?.name || 'Instamart'}
          </Text>
        </Pressable>

        <View style={styles.noteRow}>
          <InfoIcon width={14} height={14} />
          <Text style={styles.noteText}>
            Final price may vary at checkout based on taxes &{'\n'}delivery fees.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(248,249,255,0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
    lineHeight: 28,
    letterSpacing: -0.5,
    fontFamily: 'Inter_600SemiBold',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryImageWrap: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: '#e5eeff',
    overflow: 'hidden',
  },
  summaryImage: {
    width: '100%',
    height: '100%',
  },
  summaryTexts: {
    flex: 1,
    gap: 6,
  },
  selectedPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#dce9ff',
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  selectedPillText: {
    color: '#45464d',
    fontSize: 10,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  summaryTitle: {
    color: '#0b1c30',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.5,
    fontFamily: 'Inter_700Bold',
  },
  summarySubtitle: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
  },
  headingBlock: {
    gap: 4,
  },
  heading: {
    color: '#0b1c30',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    fontFamily: 'Inter_700Bold',
  },
  subheading: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
  },
  platformList: {
    gap: 12,
  },
  platformCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  platformCardSelected: {
    backgroundColor: '#eefbf5',
    borderWidth: 1,
    borderColor: 'rgba(0,181,98,0.2)',
  },
  platformLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  platformInfo: {
    flex: 1,
    gap: 4,
  },
  platformNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  platformName: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  bestPricePill: {
    backgroundColor: '#6ffbbe',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bestPricePillText: {
    color: '#002113',
    fontSize: 10,
    letterSpacing: 0.25,
    fontFamily: 'Inter_700Bold',
  },
  timePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8f9ff',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timePillText: {
    color: '#76777d',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  saveVsHighest: {
    color: '#059669',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_600SemiBold',
  },
  platformPrice: {
    color: '#0b1c30',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.15,
    fontFamily: 'Inter_700Bold',
  },
  platformPriceSelected: {
    color: '#059669',
  },
  dealCard: {
    borderWidth: 1,
    borderColor: '#bce8d3',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#e8f8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  dealLeft: {
    flex: 1,
    gap: 4,
    paddingRight: 8,
  },
  dealLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dealLabel: {
    color: '#006644',
    fontSize: 10,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  dealPriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  dealPrice: {
    color: '#0b1c30',
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: -0.75,
    fontFamily: 'Inter_800ExtraBold',
  },
  dealStrike: {
    color: 'rgba(69,70,77,0.7)',
    fontSize: 12,
    lineHeight: 16,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
    marginBottom: 2,
  },
  dealRight: {
    alignItems: 'flex-end',
  },
  saveBadge: {
    backgroundColor: '#059669',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  saveBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  vsText: {
    color: '#006644',
    fontSize: 10,
    marginTop: 3,
    fontFamily: 'Inter_400Regular',
  },
  cta: {
    height: 54,
    backgroundColor: '#fea619',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  ctaText: {
    color: '#2a1700',
    fontSize: 14,
    letterSpacing: 0.14,
    fontFamily: 'Inter_600SemiBold',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  noteText: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
