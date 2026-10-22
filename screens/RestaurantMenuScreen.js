import { useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet
} from 'react-native';

import { ArrowFillCtaIcon } from '../components/icons';
import BackButton from '../components/BackButton';
import { HeaderCartButton } from '../components/HeaderIconButton';
import AddToCartControl from '../components/AddToCartControl';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

function MenuCard({ item, qty = 0, onPress, onAdd, onIncrement, onDecrement }) {
  return (
    <Pressable style={styles.menuCard} onPress={() => onPress?.(item)}>
      <View style={styles.menuUpper}>
        <Image source={item.image} style={styles.menuThumb} />
        <View style={styles.menuTitleBlock}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
          <Text style={styles.menuName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.menuHint}>Tap to see prices & slide to order</Text>
        </View>
        <Pressable onPress={(e) => e?.stopPropagation?.()}>
          <AddToCartControl
            qty={qty}
            size={40}
            accessibilityLabel={`Add ${item.name} to cart`}
            onAdd={() => onAdd?.(item)}
            onIncrement={() => onIncrement?.(item)}
            onDecrement={() => onDecrement?.(item)}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function RestaurantMenuScreen({
  restaurant,
  onBack,
  onCart,
  cartCount = 0,
  cartItems = [],
  onSelectItem,
  onAddItem,
  onChangeItemQty,
  onFooterAction,
}) {
  const [activeCategory, setActiveCategory] = useState(
    restaurant?.categories?.[0] || 'Popular'
  );

  const restaurantLines = useMemo(() => {
    if (!restaurant?.id) return [];
    const menuIds = new Set((restaurant.menu || []).map((item) => item.id));
    return cartItems.filter((item) => {
      if (item.category !== 'food') return false;
      if (item.restaurantId === restaurant.id) return true;
      const productId =
        item.productId || String(item.id || '').replace(/^food-/, '');
      return menuIds.has(productId);
    });
  }, [cartItems, restaurant]);

  const footerCount = useMemo(
    () => restaurantLines.reduce((sum, item) => sum + (item.qty || 0), 0),
    [restaurantLines]
  );

  const footerSubtotal = useMemo(
    () =>
      restaurantLines.reduce(
        (sum, item) => sum + (item.price || 0) * (item.qty || 0),
        0
      ),
    [restaurantLines]
  );

  const qtyByProductId = useMemo(() => {
    const map = {};
    restaurantLines.forEach((line) => {
      const key = line.productId || String(line.id || '').replace(/^food-/, '');
      map[key] = (map[key] || 0) + (line.qty || 0);
    });
    return map;
  }, [restaurantLines]);

  const distinctCount = restaurantLines.length;
  const showFooter = footerCount > 0;
  const footerCtaLabel =
    distinctCount >= 2 ? 'Compare Cart' : 'View Cart';

  if (!restaurant) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={onBack} />
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {restaurant.area}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <HeaderCartButton onPress={onCart} count={cartCount} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          showFooter && styles.contentWithFooter,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={restaurant.heroImage}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroScrim} />
          {restaurant.open ? (
            <View style={styles.openBadge}>
              <Text style={styles.openBadgeText}>OPEN NOW</Text>
            </View>
          ) : (
            <View />
          )}
          <View style={styles.heroBottom}>
            <Text style={styles.heroName}>{restaurant.name}</Text>
            <View style={styles.heroMetaRow}>
              <Text style={styles.heroMeta}>
                {restaurant.cuisine} • ★ {restaurant.rating} ({restaurant.reviews})
              </Text>
              <View style={styles.heroDot} />
              <Text style={styles.heroMeta}>{restaurant.time}</Text>
            </View>
          </View>
        </ImageBackground>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categories}
        >
          {restaurant.categories.map((category) => {
            const active = activeCategory === category;
            return (
              <Pressable
                key={category}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setActiveCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active && styles.categoryTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionTitle}>
          <Text style={styles.menuHeading}>Menu</Text>
          <Text style={styles.menuSubtitle}>
            Open a dish to see platform prices and slide to order.
          </Text>
        </View>

        <View style={styles.menuList}>
          {restaurant.menu.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              qty={qtyByProductId[item.id] || 0}
              onPress={onSelectItem}
              onAdd={onAddItem}
              onIncrement={(menuItem) =>
                onChangeItemQty?.(menuItem, (qtyByProductId[menuItem.id] || 0) + 1)
              }
              onDecrement={(menuItem) =>
                onChangeItemQty?.(menuItem, (qtyByProductId[menuItem.id] || 0) - 1)
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(198,198,205,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  contentWithFooter: {
    paddingBottom: 100,
  },
  hero: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    justifyContent: 'space-between',
  },
  heroImage: {
    borderRadius: 16,
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
  },
  openBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  openBadgeText: {
    color: '#0b1c30',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  heroBottom: {
    gap: 4,
    zIndex: 1,
  },
  heroName: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Inter_800ExtraBold',
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  heroMeta: {
    color: '#dce9ff',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  heroDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#dce9ff',
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categories: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexGrow: 0,
  },
  categoryChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c6c6cd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  categoryChipActive: {
    backgroundColor: '#fea619',
    borderColor: '#fea619',
  },
  categoryText: {
    color: '#45464d',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  categoryTextActive: {
    color: '#684000',
    fontFamily: 'Inter_700Bold',
  },
  sectionTitle: {
    gap: 4,
  },
  menuHeading: {
    color: '#0b1c30',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  menuSubtitle: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  menuList: {
    gap: 12,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuUpper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  menuTitleBlock: {
    flex: 1,
    gap: 4,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(254,166,25,0.15)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    color: '#684000',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  menuName: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  menuHint: {
    color: '#76777d',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  addIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fea619',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e8',
    borderWidth: 1,
    borderColor: '#fea619',
    borderRadius: 18,
    height: 36,
    paddingHorizontal: 4,
    gap: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    minWidth: 16,
    textAlign: 'center',
    color: '#0b1c30',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  footerSafe: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  footerCart: {
    marginHorizontal: 12,
    marginBottom: 8,
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: '#0b1c30',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  footerInfo: {
    flex: 1,
    gap: 2,
  },
  footerCount: {
    color: '#dce9ff',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  footerSubtotal: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  footerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fea619',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  footerCtaText: {
    color: '#684000',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
