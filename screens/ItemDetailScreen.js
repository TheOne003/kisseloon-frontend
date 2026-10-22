import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  PanResponder,
  StyleSheet
} from 'react-native';

import {
  ArrowRightBrownIcon,
  CheckGreenIcon,
  NonVegIcon,
  StepperMinusIcon,
  StepperPlusIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import { HeaderCartButton } from '../components/HeaderIconButton';
import PlatformIcon from '../components/PlatformIcon';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const SWIPE_THRESHOLD = 108;

/** Compact est. breakdown that always sums to listed platform price × qty. */
function getPlatformBreakdown(platform, quantity = 1) {
  const unit = Number(platform?.price) || 0;
  const qty = Math.max(1, quantity);
  const freeDelivery = /free delivery/i.test(platform?.note || '');
  const deliveryUnit = freeDelivery ? 0 : Math.min(29, Math.round(unit * 0.08));
  const packagingUnit = Math.min(18, Math.max(5, Math.round(unit * 0.04)));
  const taxesUnit = Math.max(0, Math.round(unit * 0.05));
  const itemUnit = Math.max(0, unit - packagingUnit - taxesUnit - deliveryUnit);
  return {
    platformId: platform.id,
    platformLabel: platform.label || platform.name || 'Platform',
    color: platform.color || '#fea619',
    lines: [
      { label: 'Item', value: itemUnit * qty },
      { label: 'Packaging', value: packagingUnit * qty },
      { label: 'Delivery', value: deliveryUnit * qty },
      { label: 'Taxes', value: taxesUnit * qty },
    ],
    payable: unit * qty,
  };
}

function PlatformRow({
  platform,
  isFirst,
  quantity = 1,
  expanded,
  onToggleBreakdown,
  onOpenPlatform,
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const flicker = useRef(new Animated.Value(0)).current;
  const rowWidth = useRef(320);
  const locked = useRef(false);
  const interacting = useRef(false);
  const hintLoop = useRef(null);
  const hintPlayed = useRef(false);
  const platformColor = platform.color || '#fea619';
  const isCheapest = !!platform.best;
  const breakdown = getPlatformBreakdown(platform, quantity);
  const HINT_DX = 56;

  const reset = (animated = true) => {
    locked.current = false;
    interacting.current = false;
    if (!animated) {
      translateX.setValue(0);
      flicker.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(flicker, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const completeSwipe = () => {
    if (locked.current) return;
    locked.current = true;
    interacting.current = true;
    if (hintLoop.current) {
      hintLoop.current.stop?.();
      hintLoop.current = null;
    }
    Animated.timing(translateX, {
      toValue: Math.max(rowWidth.current * 0.92, SWIPE_THRESHOLD + 40),
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      onOpenPlatform?.(platform);
      setTimeout(() => reset(true), 280);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dx > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2,
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        gesture.dx > 14 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.4,
      onPanResponderGrant: () => {
        interacting.current = true;
        if (hintLoop.current) {
          hintLoop.current.stop?.();
          hintLoop.current = null;
        }
        translateX.stopAnimation();
        flicker.stopAnimation();
        flicker.setValue(0);
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gesture) => {
        if (locked.current) return;
        const dx = Math.max(0, Math.min(gesture.dx, rowWidth.current * 0.9));
        translateX.setValue(dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (locked.current) return;
        if (gesture.dx >= SWIPE_THRESHOLD || gesture.vx > 0.65) {
          completeSwipe();
          return;
        }
        reset(true);
      },
      onPanResponderTerminate: () => reset(true),
    })
  ).current;

  useEffect(() => {
    if (!isCheapest || hintPlayed.current) return undefined;

    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (cancelled || interacting.current || locked.current || hintPlayed.current) {
        return;
      }
      hintPlayed.current = true;

      // One smooth slide-right cue with a soft highlight pulse, then ease back.
      const anim = Animated.sequence([
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: HINT_DX,
            duration: 720,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(flicker, {
            toValue: 1,
            duration: 520,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(420),
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,
            duration: 640,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(flicker, {
            toValue: 0,
            duration: 520,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]);

      hintLoop.current = anim;
      anim.start(() => {
        hintLoop.current = null;
      });
    }, 700);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      if (hintLoop.current) {
        hintLoop.current.stop?.();
        hintLoop.current = null;
      }
    };
  }, [flicker, isCheapest, translateX]);

  const swipeHighlightOpacity = translateX.interpolate({
    inputRange: [0, HINT_DX * 0.4, HINT_DX, SWIPE_THRESHOLD],
    outputRange: [0, 0.14, 0.26, 0.34],
    extrapolate: 'clamp',
  });
  const flickerOpacity = flicker.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.34],
  });

  return (
    <View
      style={[styles.swipeRow, !isFirst && styles.platformRowBorder]}
      onLayout={(event) => {
        rowWidth.current = event.nativeEvent.layout.width;
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.swipeHighlight,
          {
            backgroundColor: platformColor,
            opacity: swipeHighlightOpacity,
          },
        ]}
      />
      {isCheapest ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.swipeHighlight,
            {
              backgroundColor: platformColor,
              opacity: flickerOpacity,
            },
          ]}
        />
      ) : null}

      <Animated.View
        style={[
          styles.platformRow,
          isCheapest && styles.platformRowBest,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.platformLeft}>
          <PlatformIcon platform={platform} size={36} />
          <View style={styles.platformTexts}>
            <View style={styles.platformNameRow}>
              <Text
                style={[
                  styles.platformName,
                  isCheapest && styles.platformNameBest,
                ]}
              >
                {platform.label}
              </Text>
              {isCheapest ? (
                <View style={styles.bestBadge}>
                  <Text style={styles.bestBadgeText}>BEST PRICE</Text>
                </View>
              ) : null}
            </View>
            <Text
              style={[
                styles.platformNote,
                isCheapest && styles.platformNoteBest,
              ]}
            >
              {platform.note}
            </Text>
            {isCheapest ? (
              <Text style={[styles.slideThisCue, { color: platformColor }]}>
                Slide this to order
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.priceBlock}>
          <Text
            style={[
              styles.platformPrice,
              platform.best && styles.platformPriceBest,
            ]}
          >
            ₹{breakdown.payable}
          </Text>
          <Pressable
            style={styles.breakdownToggle}
            onPress={() => onToggleBreakdown?.(platform.id)}
            hitSlop={6}
          >
            <Text style={styles.breakdownToggleText}>
              {expanded ? '▴' : '▾'} Price breakdown
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {expanded ? (
        <View style={styles.breakdownDropdown}>
          {breakdown.lines.map((line) => (
            <View key={line.label} style={styles.breakdownLine}>
              <Text style={styles.breakdownLineLabel}>{line.label}</Text>
              <Text style={styles.breakdownLineValue}>
                {line.value === 0 ? 'FREE' : `₹${line.value}`}
              </Text>
            </View>
          ))}
          <View style={[styles.breakdownLine, styles.breakdownLineTotal]}>
            <Text style={styles.breakdownLineTotalLabel}>Total</Text>
            <Text style={styles.breakdownLineTotalValue}>
              ₹{breakdown.payable}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default function ItemDetailScreen({
  item,
  restaurant,
  onBack,
  onCart,
  cartCount = 0,
  onAddToCart,
  onOpenPlatform,
  /** @deprecated Food flow uses onAddToCart; kept for compatibility */
  onChoosePlatform,
  primaryCtaLabel = 'Add to Cart',
}) {
  const [quantity, setQuantity] = useState(1);
  const [expandedPlatformId, setExpandedPlatformId] = useState(null);

  useEffect(() => {
    setExpandedPlatformId(null);
    setQuantity(1);
  }, [item?.id]);

  if (!item || !restaurant) return null;

  const dietary = item.dietary || 'NON-VEG';
  const isNonVeg = dietary === 'NON-VEG';
  const dietaryLabel = dietary;

  const handlePrimaryCta = () => {
    const payload = { item, quantity };
    if (onAddToCart) {
      onAddToCart(payload);
      return;
    }
    onChoosePlatform?.(payload);
  };

  const handleOpenPlatform = (platform) => {
    onOpenPlatform?.({
      ...platform,
      name: platform.label || platform.name,
      item,
      quantity,
    });
  };

  const toggleBreakdown = (platformId) => {
    setExpandedPlatformId((current) =>
      current === platformId ? null : platformId
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={onBack} />
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {restaurant.name}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <HeaderCartButton onPress={onCart} count={cartCount} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <ImageBackground
          source={item.detailImage || item.image}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.dietaryTag}>
            {isNonVeg ? <NonVegIcon width={12} height={12} /> : null}
            <Text style={styles.dietaryText}>{dietaryLabel}</Text>
          </View>
        </ImageBackground>

        <View style={styles.titleSection}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.metaLine} numberOfLines={1}>
            {restaurant.name} · {restaurant.time} · ★ {restaurant.rating}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.compareSection}>
          <View style={styles.slideCueBanner}>
            <Text style={styles.slideCueEmoji}>👉</Text>
            <Text style={styles.slideCueTitle}>Slide to order instantly</Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.matrix}>
            {item.platforms.map((platform, index) => (
              <PlatformRow
                key={platform.id}
                platform={platform}
                isFirst={index === 0}
                quantity={quantity}
                expanded={expandedPlatformId === platform.id}
                onToggleBreakdown={toggleBreakdown}
                onOpenPlatform={handleOpenPlatform}
              />
            ))}
          </View>

          <View style={styles.savingsAlert}>
            <CheckGreenIcon width={14} height={14} />
            <Text style={styles.savingsText} numberOfLines={1}>
              {item.bestPriceText}
            </Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.actionPanel}>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepperBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <StepperMinusIcon width={10} height={10} />
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
            <Pressable
              style={styles.stepperBtn}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <StepperPlusIcon width={10} height={10} />
            </Pressable>
          </View>

          <Pressable style={styles.cta} onPress={handlePrimaryCta}>
            <Text style={styles.ctaText}>{primaryCtaLabel}</Text>
            <ArrowRightBrownIcon width={14} height={14} color="#684000" />
          </Pressable>
        </View>
      </SafeAreaView>
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
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
    paddingTop: 10,
    paddingBottom: 12,
    gap: 12,
  },
  hero: {
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    padding: 10,
  },
  heroImage: {
    borderRadius: 14,
  },
  dietaryTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dietaryText: {
    color: '#0b1c30',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  titleSection: {
    gap: 4,
  },
  itemName: {
    color: '#0b1c30',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  metaLine: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  description: {
    color: '#45464d',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  compareSection: {
    gap: 8,
  },
  slideCueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff4df',
    borderWidth: 1.5,
    borderColor: '#fea619',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  slideCueEmoji: {
    fontSize: 18,
  },
  slideCueTitle: {
    flex: 1,
    color: '#684000',
    fontSize: 14,
    letterSpacing: -0.2,
    fontFamily: 'Inter_800ExtraBold',
  },
  liveBadge: {
    backgroundColor: '#ecfdf5',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  matrix: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(198,198,205,0.3)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  swipeRow: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  swipeHighlight: {
    ...StyleSheet.absoluteFillObject,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  platformRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(198,198,205,0.3)',
  },
  platformRowBest: {
    backgroundColor: '#ecfdf5',
  },
  platformLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  platformTexts: {
    gap: 2,
    flex: 1,
  },
  platformNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  platformName: {
    color: '#0b1c30',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  platformNameBest: {
    fontFamily: 'Inter_700Bold',
  },
  bestBadge: {
    backgroundColor: '#059669',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bestBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  platformNote: {
    color: '#76777d',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  platformNoteBest: {
    color: '#45464d',
  },
  slideThisCue: {
    marginTop: 1,
    fontSize: 10,
    letterSpacing: -0.1,
    fontFamily: 'Inter_700Bold',
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: 2,
    minWidth: 88,
  },
  platformPrice: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  platformPriceBest: {
    color: '#059669',
  },
  breakdownToggle: {
    paddingVertical: 1,
  },
  breakdownToggleText: {
    color: '#76777d',
    fontSize: 9,
    lineHeight: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  breakdownDropdown: {
    backgroundColor: '#f7f8fc',
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 8,
    gap: 3,
  },
  breakdownLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLineLabel: {
    color: '#76777d',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  breakdownLineValue: {
    color: '#0b1c30',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  breakdownLineTotal: {
    marginTop: 2,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(198,198,205,0.5)',
  },
  breakdownLineTotalLabel: {
    color: '#0b1c30',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  breakdownLineTotalValue: {
    color: '#0b1c30',
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
  },
  savingsAlert: {
    backgroundColor: '#ecfdf5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savingsText: {
    color: '#059669',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    flex: 1,
  },
  footerSafe: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(198,198,205,0.35)',
    backgroundColor: '#f8f9ff',
  },
  actionPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  stepper: {
    width: 100,
    height: 48,
    backgroundColor: 'rgba(254,166,25,0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  cta: {
    flex: 1,
    height: 48,
    backgroundColor: '#fea619',
    borderRadius: 12,
    paddingHorizontal: 16,
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
  ctaText: {
    color: '#684000',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
