import { useMemo, useState } from 'react';
import {
  Image,
  StyleSheet
} from 'react-native';

import {
  ArrowFillCtaIcon,
  BoltIcon,
  BrandTagIcon,
  FilterChevronIcon,
  FilterSlidersIcon,
  RupeeIcon,
  SortArrowsIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import {
  HeaderCartButton,
  HeaderProfileButton,
} from '../components/HeaderIconButton';
import AddToCartControl from '../components/AddToCartControl';
import PlatformIcon from '../components/PlatformIcon';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const FILTERS = [
  { id: 'sort', label: 'Sort', icon: 'sort', hasChevron: true },
  { id: 'filters', label: 'Filters', icon: 'filters', badge: 1 },
  { id: 'price', label: 'Price', icon: 'price' },
  { id: 'brand', label: 'Brand', icon: 'brand' },
  { id: 'under', label: 'Under ₹100', icon: 'bolt' },
];

function FilterIcon({ type }) {
  if (type === 'sort') return <SortArrowsIcon width={11} height={14} />;
  if (type === 'filters') return <FilterSlidersIcon width={13} height={13} />;
  if (type === 'price') return <RupeeIcon width={8} height={12} />;
  if (type === 'brand') return <BrandTagIcon width={13} height={13} />;
  return <BoltIcon width={10} height={13} />;
}

function groceryLineId(product) {
  const pack =
    product?.packSize ||
    product?.details?.split('•')?.[0]?.trim() ||
    '1 L';
  return `grocery-${product.id}:${pack}`;
}

function ProductCard({
  product,
  qty = 0,
  onPress,
  onAdd,
  onIncrement,
  onDecrement,
}) {
  const platforms = (product.platforms || []).filter((p) => !p.unavailable);

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(product)}>
      <View style={styles.cardTop}>
        <View style={styles.imageWrap}>
          <Image source={product.image} style={styles.productImage} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productDetails} numberOfLines={1}>
            {product.details}
          </Text>
          <Text style={styles.menuHint}>
            Tap to compare & slide to order
          </Text>
          <View style={styles.platformIconsRow}>
            {platforms.map((platform) => (
              <View
                key={platform.id}
                style={[
                  styles.platformIconChip,
                  platform.best && styles.platformIconChipBest,
                ]}
              >
                <PlatformIcon platform={platform} size={22} borderWidth={1} />
              </View>
            ))}
          </View>
        </View>
        <Pressable
          onPress={(event) => event?.stopPropagation?.()}
          style={styles.addControlHit}
        >
          <AddToCartControl
            qty={qty}
            size={40}
            accessibilityLabel={`Add ${product.name} to cart`}
            onAdd={() => onAdd?.(product)}
            onIncrement={() => onIncrement?.(product)}
            onDecrement={() => onDecrement?.(product)}
          />
        </Pressable>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.bestVia}>Best via {product.bestPlatform}</Text>
        <Text style={styles.bestPrice}>₹{product.bestPrice}</Text>
      </View>
    </Pressable>
  );
}

export default function GroceryResultsScreen({
  title = 'Amul Gold Milk 1 L',
  foundCount = 12,
  subtitle = 'Live price split across quick-commerce stores',
  cartCount = 0,
  cartItems = [],
  products = [],
  onBack,
  onCart,
  onProfile,
  onSelectProduct,
  onAddProduct,
  onChangeProductQty,
  onFooterAction,
}) {
  const [activeFilter, setActiveFilter] = useState('filters');

  const groceryLines = useMemo(
    () => cartItems.filter((item) => item.category === 'grocery'),
    [cartItems]
  );

  const qtyByProductId = useMemo(() => {
    const map = {};
    groceryLines.forEach((line) => {
      const key =
        line.productId || String(line.id || '').replace(/^grocery-/, '').split(':')[0];
      map[key] = (map[key] || 0) + (line.qty || 0);
    });
    // Also key by full line id for pack-specific matching
    groceryLines.forEach((line) => {
      map[line.id] = line.qty || 0;
    });
    return map;
  }, [groceryLines]);

  const footerCount = useMemo(
    () => groceryLines.reduce((sum, item) => sum + (item.qty || 0), 0),
    [groceryLines]
  );
  const footerSubtotal = useMemo(
    () =>
      groceryLines.reduce(
        (sum, item) => sum + (item.price || 0) * (item.qty || 0),
        0
      ),
    [groceryLines]
  );
  const distinctCount = groceryLines.length;
  const showFooter = footerCount > 0;
  const footerCtaLabel = distinctCount >= 2 ? 'Compare Cart' : 'View Cart';

  const qtyForProduct = (product) =>
    qtyByProductId[groceryLineId(product)] ||
    qtyByProductId[product.id] ||
    0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={onBack} />
          <Text style={styles.headerTitle}>Grocery Results</Text>
        </View>
        <View style={[styles.headerActions, styles.headerActionsRight]}>
          <HeaderCartButton onPress={onCart} count={cartCount} />
          <HeaderProfileButton onPress={onProfile} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          showFooter && styles.contentWithFooter,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summary}>
          <View style={styles.titleRow}>
            <Text style={styles.queryTitle} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.foundBadge}>
              <Text style={styles.foundText}>{foundCount} found</Text>
            </View>
          </View>
          <Text style={styles.summarySubtitle}>{subtitle}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
          style={styles.filtersScroll}
        >
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <Pressable
                key={filter.id}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <FilterIcon type={filter.icon} />
                <Text style={styles.filterLabel}>{filter.label}</Text>
                {filter.hasChevron ? (
                  <FilterChevronIcon width={8} height={8} color="#0B1C30" />
                ) : null}
                {filter.badge ? (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{filter.badge}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              qty={qtyForProduct(product)}
              onPress={onSelectProduct}
              onAdd={onAddProduct}
              onIncrement={(item) =>
                onChangeProductQty?.(item, qtyForProduct(item) + 1)
              }
              onDecrement={(item) =>
                onChangeProductQty?.(item, qtyForProduct(item) - 1)
              }
            />
          ))}
        </View>
      </ScrollView>

      {showFooter ? (
        <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
          <View style={styles.footerCart}>
            <View style={styles.footerInfo}>
              <Text style={styles.footerCount}>
                {footerCount} item{footerCount === 1 ? '' : 's'} added
              </Text>
              <Text style={styles.footerSubtotal}>₹{footerSubtotal}</Text>
            </View>
            <Pressable
              style={styles.footerCta}
              onPress={() =>
                onFooterAction?.({
                  itemCount: footerCount,
                  distinctCount,
                  subtotal: footerSubtotal,
                })
              }
            >
              <Text style={styles.footerCtaText}>{footerCtaLabel}</Text>
              <ArrowFillCtaIcon width={13} height={13} color="#684000" />
            </Pressable>
          </View>
        </SafeAreaView>
      ) : null}
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
    gap: 4,
  },
  headerTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
    fontFamily: 'Inter_600SemiBold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionsRight: {
    marginLeft: 'auto',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  contentWithFooter: {
    paddingBottom: 96,
  },
  summary: {
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  queryTitle: {
    flex: 1,
    color: '#0b1c30',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    fontFamily: 'Inter_700Bold',
  },
  foundBadge: {
    backgroundColor: '#dce9ff',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  foundText: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontFamily: 'Inter_500Medium',
  },
  summarySubtitle: {
    color: '#45464d',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  filtersScroll: {
    marginHorizontal: -16,
  },
  filtersRow: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  filterChipActive: {
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  filterLabel: {
    color: '#0b1c30',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.14,
    fontFamily: 'Inter_600SemiBold',
  },
  filterBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fea619',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#684000',
    fontSize: 10,
    lineHeight: 10,
    fontFamily: 'Inter_700Bold',
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#eff4ff',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardInfo: {
    flex: 1,
    gap: 4,
    paddingRight: 4,
  },
  brand: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: 'Inter_700Bold',
  },
  menuHint: {
    color: '#76777d',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Inter_400Regular',
  },
  platformIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  platformIconChip: {
    borderRadius: 14,
    padding: 1,
  },
  platformIconChipBest: {
    borderWidth: 1.5,
    borderColor: '#059669',
    borderRadius: 14,
  },
  addControlHit: {
    alignSelf: 'flex-start',
  },
  productName: {
    color: '#0b1c30',
    fontSize: 18,
    lineHeight: 26,
    fontFamily: 'Inter_700Bold',
  },
  productDetails: {
    color: '#45464d',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.12,
    fontFamily: 'Inter_400Regular',
  },
  compareBox: {
    backgroundColor: '#eff4ff',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  compareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compareTitle: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontFamily: 'Inter_600SemiBold',
  },
  saveBadge: {
    backgroundColor: 'rgba(111,251,190,0.3)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  saveText: {
    color: '#059669',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  platformsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  platformCell: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  platformCellBest: {
    backgroundColor: '#e8f7ed',
    borderWidth: 1.5,
    borderColor: '#059669',
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  platformUnavailable: {
    backgroundColor: 'rgba(220,233,255,0.6)',
    opacity: 0.7,
  },
  platformLetter: {
    width: 14,
    height: 16,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformLetterText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
  },
  platformName: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_600SemiBold',
    alignSelf: 'stretch',
  },
  platformPrice: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Inter_700Bold',
    alignSelf: 'stretch',
  },
  platformPriceBest: {
    color: '#059669',
    fontFamily: 'Inter_800ExtraBold',
  },
  platformTime: {
    color: '#76777d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_600SemiBold',
    alignSelf: 'stretch',
  },
  unavailableLabel: {
    color: '#76777d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_600SemiBold',
    alignSelf: 'stretch',
  },
  oosLabel: {
    color: '#76777d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
    alignSelf: 'stretch',
  },
  bestBadge: {
    backgroundColor: '#059669',
    borderRadius: 9999,
    paddingHorizontal: 4,
  },
  bestBadgeText: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  bestVia: {
    color: '#45464d',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  bestPrice: {
    color: '#059669',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    fontFamily: 'Inter_800ExtraBold',
  },
  qtyStepper: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff4df',
    borderWidth: 1,
    borderColor: '#fea619',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 4,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: '#684000',
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'Inter_700Bold',
  },
  qtyValue: {
    minWidth: 22,
    textAlign: 'center',
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  footerSafe: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(198,198,205,0.45)',
  },
  footerCart: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerInfo: {
    flex: 1,
    gap: 2,
  },
  footerCount: {
    color: '#0b1c30',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  footerSubtotal: {
    color: '#059669',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
  },
  footerCta: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#fea619',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerCtaText: {
    color: '#684000',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
