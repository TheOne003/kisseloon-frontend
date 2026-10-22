import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';

import {
  ArrowSmallIcon,
  LocationPinIcon,
  MicIcon,
  SearchIcon20,
  SparklesIcon,
} from '../components/icons';
import {
  HeaderCartButton,
  HeaderProfileButton,
} from '../components/HeaderIconButton';
import AddToCartControl from '../components/AddToCartControl';
import ChooseLocationSheet from '../components/ChooseLocationSheet';
import { getCatalogByCategory } from '../constants/demoGroceryCatalog';
import { cartItemFromGroceryProduct } from '../constants/demoCart';
import { fetchCurrentLocationLabel } from '../services/locationService';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const CATEGORIES = [
  'Milk & Dairy',
  'Fruits',
  'Vegetables',
  'Snacks',
  'Beverages',
];

const CATEGORY_BG = {
  'Milk & Dairy': '#f1f5f9',
  Fruits: '#ecfdf5',
  Vegetables: '#fff7ed',
  Snacks: '#fffbeb',
  Beverages: '#eff6ff',
};

function toHomeCard(product, category) {
  const price = product.bestPrice;
  const mrp = Math.max(price + 8, Math.round(price * 1.15));
  return {
    ...product,
    pack: product.details,
    price,
    mrp,
    off: mrp - price,
    imageBg: CATEGORY_BG[category] || '#f1f5f9',
  };
}

function ProductCard({
  product,
  category,
  qty = 0,
  onAdd,
  onIncrement,
  onDecrement,
  onSeeAll,
}) {
  return (
    <View style={styles.productCard}>
      <View style={[styles.imageArea, { backgroundColor: product.imageBg }]}>
        <Image source={product.image} style={styles.productImage} />
        <View style={styles.addControlWrap}>
          <AddToCartControl
            qty={qty}
            size={36}
            accessibilityLabel={`Add ${product.name} to cart`}
            onAdd={() => onAdd?.(product)}
            onIncrement={() => onIncrement?.(product)}
            onDecrement={() => onDecrement?.(product)}
          />
        </View>
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.priceRow}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>₹{product.price}</Text>
          </View>
          <Text style={styles.mrp}>₹{product.mrp}</Text>
        </View>
        <Text style={styles.offText}>₹{product.off} OFF</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.packText}>{product.pack}</Text>
        <Pressable style={styles.seeAllWrap} onPress={() => onSeeAll?.(category)}>
          <Text style={styles.seeAllText}>See All {category}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function GroceryScreen({
  location = 'Indirapuram, Ghaziabad',
  onBack,
  onCart,
  cartCount = 0,
  cartItems = [],
  onProfile,
  onCheckDeals,
  onAddAddress,
  onLocationChange,
  onSelectProduct,
  onAddProduct,
  onChangeProductQty,
  onSeeAllCategory,
  onSearch,
}) {
  const [category, setCategory] = useState('Milk & Dairy');
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(location);
  const [locating, setLocating] = useState(false);
  const { colors } = useTheme();

  const products = useMemo(() => {
    const list = getCatalogByCategory(category);
    return list.map((p) => toHomeCard(p, category));
  }, [category]);

  const qtyByProductId = useMemo(() => {
    const map = {};
    (cartItems || [])
      .filter((item) => item.category === 'grocery')
      .forEach((line) => {
        const key =
          line.productId ||
          String(line.id || '').replace(/^grocery-/, '').split(':')[0];
        map[key] = (map[key] || 0) + (line.qty || 0);
        map[line.id] = line.qty || 0;
      });
    return map;
  }, [cartItems]);

  const qtyForProduct = (product) => {
    const lineId = cartItemFromGroceryProduct(product).id;
    return qtyByProductId[lineId] || qtyByProductId[product.id] || 0;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grocery</Text>
        <View style={styles.headerActions}>
          <HeaderCartButton onPress={onCart} count={cartCount} />
          <HeaderProfileButton onPress={onProfile} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.locationRow}>
          <View style={styles.locationLeft}>
            <LocationPinIcon width={12} height={15} />
            <Text style={styles.locationText} numberOfLines={1}>
              Delivering to {currentLocation}
            </Text>
          </View>
          <Pressable onPress={() => setLocationSheetOpen(true)}>
            <Text style={styles.changeText}>Change</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>What do you need?</Text>
          <Text style={styles.heroSubtitle}>
            Compare grocery prices before you buy.
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <Pressable
            style={styles.searchBar}
            onPress={() => onSearch?.('Amul Gold Milk')}
          >
            <SearchIcon20 width={15} height={15} color={colors.textMuted} />
            <Text style={[styles.searchInput, styles.searchPlaceholder]} numberOfLines={1}>
              Search groceries, brands or products
            </Text>
            <MicIcon width={12} height={16} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.categoryHeading}>Shop by category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryTabs}
          >
            {CATEGORIES.map((item) => {
              const active = category === item;
              return (
                <Pressable
                  key={item}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => setCategory(item)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsRow}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={category}
                  qty={qtyForProduct(product)}
                  onAdd={onAddProduct || onSelectProduct}
                  onIncrement={(item) =>
                    onChangeProductQty?.(item, qtyForProduct(item) + 1)
                  }
                  onDecrement={(item) =>
                    onChangeProductQty?.(item, qtyForProduct(item) - 1)
                  }
                  onSeeAll={onSeeAllCategory}
                />
              ))
            ) : (
              <View style={styles.emptyCategory}>
                <Text style={styles.emptyCategoryText}>
                  Demo products coming soon for {category}.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <ImageBackground
          source={require('../assets/home/ad-banner.jpg')}
          style={styles.adBanner}
          imageStyle={styles.adBannerImage}
        >
          <View style={styles.adScrim} />
          <View style={styles.adTag}>
            <View style={styles.adTagDot} />
            <Text style={styles.adTagText}>ADVERTISEMENT</Text>
          </View>
          <View style={styles.adContent}>
            <Text style={styles.adEyebrow}>SMART GROCERY</Text>
            <Text style={styles.adSubtitle}>
              Live real-time price comparison across quick stores.
            </Text>
            <Pressable style={styles.adButton} onPress={onCheckDeals}>
              <Text style={styles.adButtonText}>Check Deals</Text>
              <ArrowSmallIcon width={9} height={9} />
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.valueCard}>
          <View style={styles.sparkleWrap}>
            <SparklesIcon width={16} height={16} />
          </View>
          <View style={styles.valueTexts}>
            <Text style={styles.valueTitle}>Compare before you order</Text>
            <Text style={styles.valueSubtitle}>
              One item. Multiple platforms. One smarter choice.
            </Text>
          </View>
        </View>
      </ScrollView>

      <ChooseLocationSheet
        visible={locationSheetOpen}
        onClose={() => setLocationSheetOpen(false)}
        onSelect={(address) => {
          const next = `${address.label}, ${address.city}`;
          setCurrentLocation(next);
          onLocationChange?.(next);
          setLocationSheetOpen(false);
        }}
        onUseCurrentLocation={async () => {
          if (locating) return;
          setLocating(true);
          try {
            const { label } = await fetchCurrentLocationLabel();
            setCurrentLocation(label);
            onLocationChange?.(label);
            setLocationSheetOpen(false);
          } catch (error) {
            const denied = error?.code === 'PERMISSION_DENIED';
            Alert.alert(
              denied ? 'Location permission needed' : 'Couldn’t get location',
              denied
                ? 'Enable location access in settings to deliver to your current area.'
                : 'Please try again, or pick a saved address.',
            );
          } finally {
            setLocating(false);
          }
        }}
        onAddAddress={() => {
          setLocationSheetOpen(false);
          onAddAddress?.();
        }}
      />
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(248,249,255,0.8)',
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#0b1c30',
    fontSize: 16,
    letterSpacing: -0.4,
    fontFamily: 'Inter_600SemiBold',
    pointerEvents: 'none',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 1,
    marginLeft: 'auto',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  locationRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    paddingRight: 8,
  },
  locationText: {
    color: '#45464d',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
    flexShrink: 1,
  },
  changeText: {
    color: '#fea619',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  hero: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 6,
  },
  heroTitle: {
    color: '#0b1c30',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.7,
    fontFamily: 'Inter_800ExtraBold',
  },
  heroSubtitle: {
    color: '#45464d',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  searchBar: {
    height: 54,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 0,
  },
  searchPlaceholder: {
    color: '#76777d',
  },
  categorySection: {
    gap: 16,
    paddingBottom: 24,
  },
  categoryHeading: {
    paddingHorizontal: 16,
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryTabs: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  categoryChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexShrink: 0,
  },
  categoryChipActive: {
    backgroundColor: '#eff4ff',
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },
  categoryChipText: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_500Medium',
  },
  categoryChipTextActive: {
    color: '#2563eb',
    fontFamily: 'Inter_600SemiBold',
  },
  productsRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 10,
  },
  productCard: {
    width: 148,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageArea: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  addControlWrap: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    zIndex: 2,
  },
  cardInfo: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  priceBadge: {
    backgroundColor: '#16a34a',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  mrp: {
    color: '#94a3b8',
    fontSize: 10,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  offText: {
    color: '#16a34a',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  productName: {
    color: '#0f172a',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  packText: {
    color: '#94a3b8',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  seeAllWrap: {
    paddingTop: 6,
    alignItems: 'center',
  },
  seeAllText: {
    color: '#2563eb',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyCategory: {
    width: 280,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyCategoryText: {
    color: '#76777d',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  adBanner: {
    marginHorizontal: 16,
    height: 164,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginBottom: 16,
  },
  adBannerImage: {
    borderRadius: 16,
  },
  adScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  adTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  adTagDot: {
    width: 6,
    height: 6,
    borderRadius: 9999,
    backgroundColor: '#fea619',
  },
  adTagText: {
    color: '#fff',
    fontSize: 10,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  adContent: {
    gap: 4,
    zIndex: 1,
  },
  adEyebrow: {
    color: '#ffb95f',
    fontSize: 10,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  adSubtitle: {
    color: '#d3e4fe',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
  },
  adButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#fea619',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adButtonText: {
    color: '#2a1700',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  valueCard: {
    marginHorizontal: 16,
    backgroundColor: '#eff4ff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sparkleWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(254,166,25,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueTexts: {
    flex: 1,
    gap: 2,
  },
  valueTitle: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  valueSubtitle: {
    color: '#45464d',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
});
