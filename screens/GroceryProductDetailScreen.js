import { useMemo, useState } from 'react';
import {
  Image,
  StyleSheet
} from 'react-native';

import {
  ArrowFillCtaIcon,
  CartPlusIcon,
  CheckSelectedIcon,
  ClockIcon,
  DealCheckIcon,
  InfoIcon,
  PiggyBankStrokeIcon,
} from '../components/icons';
import {
  HeaderCartButton,
  HeaderProfileButton,
} from '../components/HeaderIconButton';
import PlatformIcon from '../components/PlatformIcon';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

function PlatformRow({ platform, selected, onPress }) {
  return (
    <Pressable
      style={[styles.platformRow, selected && styles.platformRowSelected]}
      onPress={() => onPress?.(platform)}
    >
      {platform.best ? (
        <View style={styles.bestPriceBadge}>
          <PiggyBankStrokeIcon width={10} height={10} color="#059669" />
          <Text style={styles.bestPriceText}>BEST PRICE</Text>
        </View>
      ) : null}

      <View style={styles.platformLeft}>
        <View style={styles.platformIconWrap}>
          <PlatformIcon platform={platform} size={28} />
        </View>
        <View style={styles.platformTexts}>
          <View style={styles.platformNameRow}>
            <Text style={styles.platformName}>{platform.name}</Text>
            {platform.best ? <View style={styles.liveDot} /> : null}
          </View>
          <View style={styles.timeRow}>
            <ClockIcon width={12} height={12} color="#45464D" />
            <Text style={styles.timeText}>{platform.time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.platformRight}>
        <Text style={styles.platformPrice}>₹{platform.price}</Text>
        <Text
          style={[
            styles.platformNote,
            platform.noteTone === 'save' && styles.platformNoteSave,
          ]}
        >
          {platform.note}
        </Text>
      </View>
    </Pressable>
  );
}

export default function GroceryProductDetailScreen({
  product,
  cartCount = 0,
  onBack,
  onCart,
  onProfile,
  onChoosePlatform,
  onAddToCart,
}) {
  const [selectedId, setSelectedId] = useState(
    product?.selectedPlatformId || product?.platforms?.[0]?.id
  );

  const selectedPlatform = useMemo(
    () => product?.platforms?.find((p) => p.id === selectedId),
    [product?.platforms, selectedId]
  );

  if (!product) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.headerActions}>
          <HeaderCartButton onPress={onCart} count={cartCount} />
          <HeaderProfileButton onPress={onProfile} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image source={product.image} style={styles.heroImage} />
          {product.inStock ? (
            <View style={styles.stockBadge}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>IN STOCK</Text>
            </View>
          ) : null}
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>
              {product.platformsVerified} platforms verified
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.brandRow}>
            <Text style={styles.brandLine}>{product.brandLine}</Text>
            <View style={styles.packBadge}>
              <Text style={styles.packText}>{product.packSize}</Text>
            </View>
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.attributeBadge}>
            <DealCheckIcon width={13} height={12} color="#131B2E" />
            <Text style={styles.attributeText}>{product.attribute}</Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About this product</Text>
          <Text style={styles.aboutBody}>{product.description}</Text>
        </View>

        <View style={styles.compareSection}>
          <View style={styles.compareHeader}>
            <View style={styles.compareTitleRow}>
              <Text style={styles.compareTitle}>Compare prices</Text>
              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>Live prices</Text>
              </View>
            </View>
            <Text style={styles.compareSubtitle}>
              Current prices across available grocery platforms
            </Text>
          </View>

          <View style={styles.platformList}>
            {product.platforms.map((platform) => (
              <PlatformRow
                key={platform.id}
                platform={platform}
                selected={selectedId === platform.id}
                onPress={(next) => setSelectedId(next.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.priceNote}>
          <InfoIcon width={13} height={15} color="#45464D" />
          <Text style={styles.priceNoteText}>
            Final price may vary at checkout based on taxes & delivery fees.
          </Text>
        </View>

        <View style={styles.selectedToast}>
          <View style={styles.selectedLeft}>
            <CheckSelectedIcon width={15} height={15} />
            <Text style={styles.selectedText}>
              <Text style={styles.selectedLabel}>Selected: </Text>
              <Text style={styles.selectedValue}>
                {selectedPlatform?.name} (₹{selectedPlatform?.price})
              </Text>
            </Text>
          </View>
          <Text style={styles.selectedMeta}>
            {product.selectedNote || 'Fastest + Lowest'}
          </Text>
        </View>

        <Pressable
          style={styles.primaryCta}
          onPress={() =>
            onChoosePlatform?.({ product, platform: selectedPlatform })
          }
        >
          <Text style={styles.primaryCtaText}>Choose where to buy</Text>
          <ArrowFillCtaIcon width={13} height={13} />
        </Pressable>

        <Pressable
          style={styles.secondaryCta}
          onPress={() =>
            onAddToCart?.({ product, platform: selectedPlatform })
          }
        >
          <CartPlusIcon width={17} height={18} />
          <Text style={styles.secondaryCtaText}>+ Add to Kisse Loon Cart</Text>
        </Pressable>
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
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
    fontFamily: 'Inter_600SemiBold',
    flexShrink: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 32,
    gap: 12,
  },
  hero: {
    height: 220,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  heroImage: {
    width: 330,
    height: 180,
    resizeMode: 'contain',
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#eff4ff',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  stockText: {
    color: '#059669',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#dce9ff',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  verifiedText: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  brandLine: {
    flex: 1,
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  packBadge: {
    backgroundColor: '#eff4ff',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  packText: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_600SemiBold',
  },
  productName: {
    marginTop: 4,
    color: '#0b1c30',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontFamily: 'Inter_700Bold',
  },
  attributeBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#dae2fd',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attributeText: {
    color: '#131b2e',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_600SemiBold',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  aboutTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_700Bold',
  },
  aboutBody: {
    marginTop: 1,
    color: '#45464d',
    fontSize: 14,
    lineHeight: 23,
    fontFamily: 'Inter_400Regular',
  },
  compareSection: {
    gap: 8,
    marginTop: 8,
  },
  compareHeader: {
    gap: 0,
  },
  compareTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compareTitle: {
    color: '#0b1c30',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    fontFamily: 'Inter_700Bold',
  },
  liveBadge: {
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#dce9ff',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  liveBadgeText: {
    color: '#76777d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_600SemiBold',
  },
  compareSubtitle: {
    color: '#76777d',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  platformList: {
    gap: 8,
    paddingTop: 8,
  },
  platformRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  platformRowSelected: {
    minHeight: 76,
    shadowRadius: 8,
  },
  bestPriceBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#e8f8f0',
    borderWidth: 1,
    borderColor: '#bce8d3',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  bestPriceText: {
    color: '#059669',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  platformLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  platformIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformLetter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformLetterText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  platformTexts: {
    gap: 2,
  },
  platformNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  platformName: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_700Bold',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_600SemiBold',
  },
  platformRight: {
    alignItems: 'flex-end',
  },
  platformPrice: {
    color: '#0b1c30',
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.56,
    fontFamily: 'Inter_800ExtraBold',
  },
  platformNote: {
    color: '#76777d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_600SemiBold',
  },
  platformNoteSave: {
    color: '#059669',
  },
  priceNote: {
    backgroundColor: '#eff4ff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  priceNoteText: {
    flex: 1,
    color: '#76777d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  selectedToast: {
    backgroundColor: '#dce9ff',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  selectedText: {
    flexShrink: 1,
  },
  selectedLabel: {
    color: '#0b1c30',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_600SemiBold',
  },
  selectedValue: {
    color: '#0b1c30',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
  },
  selectedMeta: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  primaryCta: {
    height: 54,
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
    color: '#684000',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
    fontFamily: 'Inter_700Bold',
  },
  secondaryCta: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  secondaryCtaText: {
    color: '#0b1c30',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
    fontFamily: 'Inter_600SemiBold',
  },
});
