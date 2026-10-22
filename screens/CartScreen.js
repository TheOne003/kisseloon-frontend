import { useMemo, useState } from 'react';
import {
  Image,
  StyleSheet
} from 'react-native';

import {
  ArrowFillCtaIcon,
  BestPriceSealIcon,
  BoltIcon,
  ClockIcon,
  InfoIcon,
  SwapArrowsIcon,
  TrashIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import { getCartSummary } from '../constants/demoCart';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'food', label: '🍕 Food' },
  { id: 'grocery', label: '🛒 Grocery' },
];

function QuantityStepper({ qty, onDec, onInc }) {
  return (
    <View style={styles.stepper}>
      <Pressable style={styles.stepperBtn} onPress={onDec}>
        <Text style={styles.stepperBtnText}>−</Text>
      </Pressable>
      <Text style={styles.stepperQty}>{qty}</Text>
      <Pressable style={styles.stepperBtn} onPress={onInc}>
        <Text style={styles.stepperBtnText}>+</Text>
      </Pressable>
    </View>
  );
}

function CartItemCard({ item, onRemove, onChangeQty }) {
  const tagStyle =
    item.tag === 'veg'
      ? styles.tagVeg
      : item.tag === 'in-stock'
        ? styles.tagStock
        : styles.tagNonVeg;

  return (
    <View style={styles.itemCard}>
      <View style={styles.itemImageWrap}>
        <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
        <View style={[styles.itemTag, tagStyle]}>
          <Text style={styles.itemTagText}>{item.tagLabel}</Text>
        </View>
      </View>

      <View style={styles.itemBody}>
        <View style={styles.itemTopRow}>
          <View style={styles.itemTextBlock}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          </View>
          <Pressable style={styles.trashBtn} onPress={() => onRemove?.(item.id)}>
            <TrashIcon width={12} height={14} color="#94A3B8" />
          </Pressable>
        </View>

        <View style={styles.itemBottomRow}>
          <View style={styles.priceBlock}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{item.price}</Text>
              <Text style={styles.mrp}>₹{item.mrp}</Text>
            </View>
            <View style={styles.bestOnRow}>
              <View style={styles.bestDot} />
              <Text style={styles.bestOnText}>{item.bestOn}</Text>
            </View>
          </View>
          <QuantityStepper
            qty={item.qty}
            onDec={() => onChangeQty?.(item.id, item.qty - 1)}
            onInc={() => onChangeQty?.(item.id, item.qty + 1)}
          />
        </View>
      </View>
    </View>
  );
}

function SectionHeader({ emoji, title, countLabel, eta, etaIcon }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLeft}>
        <View
          style={[
            styles.sectionEmojiWrap,
            title === 'Grocery Cart'
              ? styles.sectionEmojiGrocery
              : styles.sectionEmojiFood,
          ]}
        >
          <Text style={styles.sectionEmoji}>{emoji}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View
          style={[
            styles.countPill,
            title === 'Grocery Cart' ? styles.countPillGrocery : styles.countPillFood,
          ]}
        >
          <Text
            style={[
              styles.countPillText,
              title === 'Grocery Cart'
                ? styles.countPillTextGrocery
                : styles.countPillTextFood,
            ]}
          >
            {countLabel}
          </Text>
        </View>
      </View>
      <View style={styles.etaRow}>
        {etaIcon}
        <Text style={styles.etaText}>{eta}</Text>
      </View>
    </View>
  );
}

export default function CartScreen({
  items = [],
  onBack,
  onContinueShopping,
  onComparePrices,
  onChangeQty,
  onRemoveItem,
}) {
  const [tab, setTab] = useState('all');
  const summary = useMemo(() => getCartSummary(items), [items]);

  const showFood = tab === 'all' || tab === 'food';
  const showGrocery = tab === 'all' || tab === 'grocery';

  const tabCounts = {
    all: summary.totalCount,
    food: summary.foodCount,
    grocery: summary.groceryCount,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <BackButton onPress={onBack} />
            <View>
              <Text style={styles.headerTitle}>Kisse Loon Cart</Text>
              <Text style={styles.headerSubtitle}>
                Smart Multi-Platform Comparison
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <Pressable
                key={t.id}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setTab(t.id)}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {t.label}
                </Text>
                <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
                  <Text
                    style={[
                      styles.tabBadgeText,
                      active && styles.tabBadgeTextActive,
                    ]}
                  >
                    {tabCounts[t.id]}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optimizerBanner}>
          <View style={styles.optimizerIcon}>
            <SwapArrowsIcon width={18} height={15} color="#FBBF24" />
          </View>
          <View style={styles.optimizerText}>
            <View style={styles.optimizerTitleRow}>
              <Text style={styles.optimizerTitle}>Dual-Basket Optimizer</Text>
              <View style={styles.bestRatePill}>
                <Text style={styles.bestRateText}>BEST RATE</Text>
              </View>
            </View>
            <Text style={styles.optimizerSubtitle}>
              Comparing across Swiggy, Zomato, Blinkit & Zepto
            </Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add food or grocery items to start comparing prices.
            </Text>
          </View>
        ) : null}

        {showFood && summary.foodItems.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader
              emoji="🍕"
              title="Food Cart"
              countLabel={`${summary.foodCount} item${summary.foodCount === 1 ? '' : 's'}`}
              eta="~30-35 mins"
              etaIcon={<ClockIcon width={11} height={11} color="#64748B" />}
            />
            {summary.foodItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onRemove={onRemoveItem}
                onChangeQty={onChangeQty}
              />
            ))}
          </View>
        ) : null}

        {showGrocery && summary.groceryItems.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader
              emoji="🛒"
              title="Grocery Cart"
              countLabel={`${summary.groceryCount} item${summary.groceryCount === 1 ? '' : 's'}`}
              eta="~10-12 mins"
              etaIcon={<BoltIcon width={9} height={11} color="#64748B" />}
            />
            {summary.groceryItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onRemove={onRemoveItem}
                onChangeQty={onChangeQty}
              />
            ))}
          </View>
        ) : null}

        {items.length > 0 ? (
          <View style={styles.estimateCard}>
            <View style={styles.estimateAccent}>
              <View style={styles.estimateAccentAmber} />
              <View style={styles.estimateAccentGreen} />
            </View>
            <View style={styles.estimateHeader}>
              <View style={styles.estimateTitleRow}>
                <BestPriceSealIcon width={17} height={16} color="#F59E0B" />
                <Text style={styles.estimateTitle}>Cart Comparison Estimate</Text>
              </View>
              <View style={styles.savePill}>
                <Text style={styles.savePillText}>Save ₹{summary.saveAmount}</Text>
              </View>
            </View>

            <View style={styles.breakdown}>
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownLabel}>🍕 Food Subtotal</Text>
                  <Text style={styles.breakdownMeta}>
                    ({summary.foodCount} item{summary.foodCount === 1 ? '' : 's'})
                  </Text>
                </View>
                <Text style={styles.breakdownValue}>₹{summary.foodSubtotal}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownLabel}>🛒 Grocery Subtotal</Text>
                  <Text style={styles.breakdownMeta}>
                    ({summary.groceryCount} item
                    {summary.groceryCount === 1 ? '' : 's'})
                  </Text>
                </View>
                <Text style={styles.breakdownValue}>₹{summary.grocerySubtotal}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  Estimated Delivery & Packing
                </Text>
                <Text style={styles.breakdownValue}>₹{summary.deliveryFee}</Text>
              </View>
              <View style={styles.discountRow}>
                <Text style={styles.discountLabel}>% Applied Store Discounts</Text>
                <Text style={styles.discountValue}>−₹{summary.saveAmount}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>BEST COMBINED RATE</Text>
                <Text style={styles.totalHint}>{summary.optimizedLine}</Text>
              </View>
              <Text style={styles.totalPrice}>₹{summary.total}</Text>
            </View>

            <View style={styles.footnote}>
              <InfoIcon width={13} height={13} color="#64748B" />
              <Text style={styles.footnoteText}>
                We compare across{' '}
                <Text style={styles.footnoteStrong}>
                  Swiggy, Zomato, Blinkit, Zepto & Instamart
                </Text>{' '}
                to find you the lowest net bill.
              </Text>
            </View>
          </View>
        ) : null}

        <Pressable
          style={[styles.primaryCta, items.length === 0 && styles.primaryCtaDisabled]}
          onPress={onComparePrices}
          disabled={items.length === 0}
        >
          <Text style={styles.primaryCtaText}>Compare Cart Prices</Text>
          <ArrowFillCtaIcon width={15} height={15} color="#0A1128" />
        </Pressable>

        <Pressable style={styles.secondaryCta} onPress={onContinueShopping}>
          <Text style={styles.secondaryCtaText}>Continue Shopping</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fd',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 13,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(226,232,240,0.6)',
    backgroundColor: 'rgba(248,249,253,0.95)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#0a1128',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.475,
    fontFamily: 'Inter_600SemiBold',
  },
  headerSubtitle: {
    color: '#64748b',
    fontSize: 10,
    lineHeight: 16.5,
    fontFamily: 'Inter_500Medium',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(226,232,240,0.7)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#0a1128',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabLabel: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Inter_700Bold',
  },
  tabLabelActive: {
    color: '#fff',
  },
  tabBadge: {
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: '#cbd5e1',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabBadgeText: {
    color: '#334155',
    fontSize: 10,
    lineHeight: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  tabBadgeTextActive: {
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 16,
  },
  optimizerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0a1c30',
    overflow: 'hidden',
  },
  optimizerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(254,166,25,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
  },
  optimizerText: {
    flex: 1,
    gap: 4,
  },
  optimizerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  optimizerTitle: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Inter_700Bold',
  },
  bestRatePill: {
    backgroundColor: '#002112',
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  bestRateText: {
    color: '#70fabd',
    fontSize: 10,
    lineHeight: 15,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  optimizerSubtitle: {
    color: '#b2bfd9',
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'Inter_400Regular',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    color: '#0a1128',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  emptySubtitle: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionEmojiWrap: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionEmojiFood: {
    backgroundColor: '#ffedd5',
  },
  sectionEmojiGrocery: {
    backgroundColor: '#d1fae5',
  },
  sectionEmoji: {
    fontSize: 12,
    lineHeight: 16,
  },
  sectionTitle: {
    color: '#0a1128',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Inter_700Bold',
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  countPillFood: {
    backgroundColor: '#ffedd5',
  },
  countPillGrocery: {
    backgroundColor: '#d1fae5',
  },
  countPillText: {
    fontSize: 10,
    lineHeight: 16.5,
    fontFamily: 'Inter_700Bold',
  },
  countPillTextFood: {
    color: '#9a3412',
  },
  countPillTextGrocery: {
    color: '#065f46',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  etaText: {
    color: '#64748b',
    fontSize: 10,
    lineHeight: 16.5,
    fontFamily: 'Inter_500Medium',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemImageWrap: {
    width: 78,
    height: 78,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemTag: {
    position: 'absolute',
    left: 4,
    bottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagNonVeg: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  tagVeg: {
    backgroundColor: 'rgba(4,120,87,0.8)',
  },
  tagStock: {
    backgroundColor: '#059669',
  },
  itemTagText: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 13.5,
    fontFamily: 'Inter_700Bold',
  },
  itemBody: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemTextBlock: {
    flex: 1,
    gap: 2,
    paddingRight: 4,
  },
  itemName: {
    color: '#0f172a',
    fontSize: 14,
    lineHeight: 17.5,
    fontFamily: 'Inter_700Bold',
  },
  itemSubtitle: {
    color: '#64748b',
    fontSize: 10,
    lineHeight: 16.5,
    fontFamily: 'Inter_500Medium',
  },
  trashBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
    paddingTop: 4,
    marginTop: 8,
  },
  priceBlock: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    color: '#0a1128',
    fontSize: 14,
    lineHeight: 22.5,
    fontFamily: 'Inter_800ExtraBold',
  },
  mrp: {
    color: '#94a3b8',
    fontSize: 10,
    lineHeight: 16.5,
    fontFamily: 'Inter_400Regular',
    textDecorationLine: 'line-through',
  },
  bestOnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bestDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  bestOnText: {
    color: '#10b981',
    fontSize: 10,
    lineHeight: 15,
    fontFamily: 'Inter_700Bold',
  },
  stepper: {
    width: 84,
    height: 28,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  stepperBtnText: {
    color: '#1e293b',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_700Bold',
  },
  stepperQty: {
    flex: 1,
    textAlign: 'center',
    color: '#0f172a',
    fontSize: 12,
    lineHeight: 19.5,
    fontFamily: 'Inter_700Bold',
  },
  estimateCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(241,245,249,0.8)',
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 16,
    gap: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  estimateAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  estimateAccentAmber: {
    flex: 1,
    backgroundColor: '#f59e0b',
  },
  estimateAccentGreen: {
    flex: 1,
    backgroundColor: '#10b981',
  },
  estimateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estimateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  estimateTitle: {
    color: '#0a1128',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Inter_700Bold',
  },
  savePill: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  savePillText: {
    color: '#065f46',
    fontSize: 10,
    lineHeight: 15,
    fontFamily: 'Inter_700Bold',
  },
  breakdown: {
    gap: 10,
    paddingTop: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownLabel: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 19.5,
    fontFamily: 'Inter_400Regular',
  },
  breakdownMeta: {
    color: '#94a3b8',
    fontSize: 10,
    lineHeight: 16.5,
    fontFamily: 'Inter_400Regular',
  },
  breakdownValue: {
    color: '#0f172a',
    fontSize: 12,
    lineHeight: 19.5,
    fontFamily: 'Inter_600SemiBold',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(236,253,245,0.7)',
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  discountLabel: {
    color: '#065f46',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Inter_700Bold',
  },
  discountValue: {
    color: '#10b981',
    fontSize: 12,
    lineHeight: 19.5,
    fontFamily: 'Inter_700Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: '#94a3b8',
    fontSize: 10,
    lineHeight: 16.5,
    letterSpacing: 0.55,
    fontFamily: 'Inter_700Bold',
  },
  totalHint: {
    color: '#64748b',
    fontSize: 10,
    lineHeight: 15,
    fontFamily: 'Inter_500Medium',
  },
  totalPrice: {
    color: '#0a1128',
    fontSize: 26,
    lineHeight: 26,
    letterSpacing: -0.65,
    fontFamily: 'Inter_800ExtraBold',
  },
  footnote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  footnoteText: {
    flex: 1,
    color: '#475569',
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'Inter_400Regular',
  },
  footnoteStrong: {
    color: '#1e293b',
    fontFamily: 'Inter_700Bold',
  },
  primaryCta: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  primaryCtaDisabled: {
    opacity: 0.5,
  },
  primaryCtaText: {
    color: '#0a1128',
    fontSize: 14,
    lineHeight: 22.5,
    fontFamily: 'Inter_800ExtraBold',
  },
  secondaryCta: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  secondaryCtaText: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 19.5,
    fontFamily: 'Inter_700Bold',
  },
});
