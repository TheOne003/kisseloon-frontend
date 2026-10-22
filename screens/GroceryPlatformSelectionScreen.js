import { useMemo, useState } from 'react';
import {
  Image,
  StyleSheet
} from 'react-native';

import {
  BestPriceSealIcon,
  InfoIcon,
  SaveDownIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import { HeaderProfileButton } from '../components/HeaderIconButton';
import PlatformIcon from '../components/PlatformIcon';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

function PlatformRow({ platform, selected, onPress }) {
  return (
    <Pressable
      style={[styles.platformCard, selected && styles.platformCardSelected]}
      onPress={onPress}
    >
      <View style={styles.platformLeft}>
        <PlatformIcon platform={platform} size={44} />
        <View style={styles.platformInfo}>
          <View style={styles.platformNameRow}>
            <Text style={styles.platformName}>{platform.name}</Text>
            {platform.best ? (
              <View style={styles.bestPill}>
                <Text style={styles.bestPillText}>BEST PRICE</Text>
              </View>
            ) : null}
          </View>
          {platform.best ? (
            <View style={styles.saveRow}>
              <SaveDownIcon width={11} height={7} />
              <Text style={styles.saveText}>{platform.saveLabel}</Text>
            </View>
          ) : (
            <Text style={styles.platformSubtitle}>{platform.subtitle}</Text>
          )}
        </View>
      </View>

      <View style={styles.platformRight}>
        <View style={styles.priceBlock}>
          <Text
            style={[
              styles.platformPrice,
              platform.best && styles.platformPriceBest,
            ]}
          >
            ₹{platform.price}
          </Text>
          <Text
            style={[
              styles.priceNote,
              platform.priceNoteTone === 'best' && styles.priceNoteBest,
            ]}
          >
            {platform.priceNote}
          </Text>
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected ? <View style={styles.radioDot} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

export default function GroceryPlatformSelectionScreen({
  selection,
  onBack,
  onProfile,
  onContinue,
}) {
  const [selectedId, setSelectedId] = useState(null);

  const selectedPlatform = useMemo(
    () => selection?.platforms?.find((p) => p.id === selectedId),
    [selection, selectedId]
  );

  if (!selection) return null;

  const canContinue = !!selectedPlatform;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={onBack} />
          <Text style={styles.headerTitle}>Grocery Platform Selection</Text>
        </View>
        <HeaderProfileButton onPress={onProfile} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.thumbWrap}>
            <Image source={selection.image} style={styles.thumbImage} />
            <View style={styles.packTag}>
              <Text style={styles.packTagText}>{selection.packLabel}</Text>
            </View>
          </View>
          <View style={styles.summaryTexts}>
            <View style={styles.selectedPill}>
              <Text style={styles.selectedPillText}>SELECTED PRODUCT</Text>
            </View>
            <Text style={styles.summaryTitle}>{selection.itemTitle}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{selection.packLabel}</Text>
              <View style={styles.metaDot} />
              <Text style={styles.metaText}>{selection.brandLine}</Text>
              <View style={styles.metaDot} />
              <Text style={styles.stockText}>{selection.stockLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.headingBlock}>
          <View style={styles.headingRow}>
            <Text style={styles.heading}>Compare platforms</Text>
            <View style={styles.livePill}>
              <Text style={styles.livePillText}>Live Prices</Text>
            </View>
          </View>
          <Text style={styles.subheading}>Choose where you want to order.</Text>
        </View>

        <View style={styles.platformList}>
          {selection.platforms.map((platform) => (
            <PlatformRow
              key={platform.id}
              platform={platform}
              selected={selectedId === platform.id}
              onPress={() => setSelectedId(platform.id)}
            />
          ))}
        </View>

        <View style={styles.bestCard}>
          <View style={styles.bestLeft}>
            <View style={styles.bestIconWrap}>
              <BestPriceSealIcon width={17} height={16} />
            </View>
            <View>
              <Text style={styles.bestLabel}>BEST AVAILABLE PRICE</Text>
              <Text style={styles.bestSave}>
                You save ₹{selection.saveAmount} vs highest shown price
              </Text>
            </View>
          </View>
          <Text style={styles.bestPrice}>₹{selection.bestPrice}</Text>
        </View>

        <Pressable
          style={[styles.cta, !canContinue && styles.ctaDisabled]}
          disabled={!canContinue}
          onPress={() => onContinue?.(selectedPlatform)}
        >
          <Text style={[styles.ctaText, !canContinue && styles.ctaTextDisabled]}>
            {canContinue
              ? `Continue with ${selectedPlatform.name}`
              : 'Select a platform'}
          </Text>
        </Pressable>

        <View style={styles.noteRow}>
          <InfoIcon width={13} height={13} color="#76777D" />
          <Text style={styles.noteText}>
            Final price & packaging fee may vary at checkout.
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
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    paddingBottom: 28,
    gap: 0,
  },
  summaryCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    height: 104,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumbWrap: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#eff4ff',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  packTag: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  packTagText: {
    color: '#0b1c30',
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'Inter_700Bold',
  },
  summaryTexts: {
    flex: 1,
    justifyContent: 'center',
  },
  selectedPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#dce9ff',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  selectedPillText: {
    color: '#45464d',
    fontSize: 10,
    letterSpacing: 0.5,
    fontFamily: 'Inter_600SemiBold',
  },
  summaryTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 21,
    fontFamily: 'Inter_700Bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  metaText: {
    color: '#76777d',
    fontSize: 12,
    lineHeight: 20,
    fontFamily: 'Inter_500Medium',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c6c6cd',
  },
  stockText: {
    color: '#059669',
    fontSize: 12,
    lineHeight: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  headingBlock: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 2,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heading: {
    color: '#0b1c30',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    fontFamily: 'Inter_700Bold',
  },
  livePill: {
    backgroundColor: 'rgba(254,166,25,0.1)',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  livePillText: {
    color: '#fea619',
    fontSize: 10,
    lineHeight: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  subheading: {
    color: '#45464d',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  platformList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  platformCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    minHeight: 82,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  platformCardSelected: {
    borderWidth: 1.5,
    borderColor: '#059669',
    backgroundColor: '#f3fcf7',
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
    gap: 2,
  },
  platformNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  platformName: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Inter_700Bold',
  },
  bestPill: {
    backgroundColor: 'rgba(111,251,190,0.5)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bestPillText: {
    color: '#005236',
    fontSize: 10,
    letterSpacing: 0.2,
    fontFamily: 'Inter_800ExtraBold',
  },
  platformSubtitle: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  saveText: {
    color: '#059669',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  platformRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  platformPrice: {
    color: '#0b1c30',
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: -0.45,
    fontFamily: 'Inter_700Bold',
  },
  platformPriceBest: {
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: -0.5,
    fontFamily: 'Inter_800ExtraBold',
  },
  priceNote: {
    color: '#76777d',
    fontSize: 10,
    lineHeight: 16,
    fontFamily: 'Inter_500Medium',
  },
  priceNoteBest: {
    color: '#059669',
    fontFamily: 'Inter_700Bold',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e5eeff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: '#059669',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  bestCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: 'rgba(111,251,190,0.2)',
    borderRadius: 16,
    minHeight: 82,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bestLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  bestIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(111,251,190,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bestLabel: {
    color: '#005236',
    fontSize: 10,
    letterSpacing: 0.55,
    fontFamily: 'Inter_700Bold',
  },
  bestSave: {
    marginTop: 2,
    color: '#059669',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Inter_500Medium',
  },
  bestPrice: {
    color: '#002113',
    fontSize: 26,
    lineHeight: 39,
    letterSpacing: -0.65,
    fontFamily: 'Inter_800ExtraBold',
  },
  cta: {
    marginTop: 24,
    marginHorizontal: 16,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#fea619',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: {
    backgroundColor: '#e5eeff',
  },
  ctaText: {
    color: '#684000',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  ctaTextDisabled: {
    color: '#76777d',
  },
  noteRow: {
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  noteText: {
    color: '#76777d',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
});
