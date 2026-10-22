import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  Pressable as RNPressable,
  StyleSheet,
  Text as RNText,
  View as RNView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  ArrowSmallIcon,
  LocationChevronIcon,
  LocationPinIcon,
} from '../components/icons';
import {
  HeaderCartButton,
  HeaderProfileButton,
} from '../components/HeaderIconButton';
import ChooseLocationSheet from '../components/ChooseLocationSheet';
import { fetchCurrentLocationLabel } from '../services/locationService';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGE_PADDING = 16;
const CARD_WIDTH = SCREEN_WIDTH - PAGE_PADDING * 2;
const MODE_ROW_GAP = 10;
const MODE_SLIDE_MS = 2000;
const MODE_TRANSITION_MS = 500;

const FOOD_MODE_IMAGES = [
  require('../assets/home/slides/food-1.jpg'),
  require('../assets/home/slides/food-2.jpg'),
  require('../assets/home/slides/food-3.jpg'),
  require('../assets/home/slides/food-4.jpg'),
  require('../assets/home/slides/food-5.jpg'),
];

const GROCERY_MODE_IMAGES = [
  require('../assets/home/slides/grocery-1.jpg'),
  require('../assets/home/slides/grocery-2.jpg'),
  require('../assets/home/slides/grocery-3.jpg'),
  require('../assets/home/slides/grocery-4.jpg'),
  require('../assets/home/slides/grocery-5.jpg'),
  require('../assets/home/slides/grocery-6.jpg'),
];

const MEALS = [
  {
    id: 'morning',
    image: require('../assets/home/meal-morning.png'),
    badge: 'Morning · 6 AM – 11 AM',
    badgeBg: '#ffd959',
    badgeColor: '#1a1a1a',
    title: 'Breakfast & Brunch',
    subtitle: 'Fresh parathas, eggs, smoothies & more',
  },
  {
    id: 'afternoon',
    image: require('../assets/home/meal-afternoon.png'),
    badge: 'Afternoon · 12 PM – 4 PM',
    badgeBg: '#fa8c33',
    badgeColor: '#1a1a1a',
    title: 'Lunch Specials',
    subtitle: 'Thalis, biryanis, rice bowls & combos',
  },
  {
    id: 'evening',
    image: require('../assets/home/meal-evening.png'),
    badge: 'Evening · 4 PM – 8 PM',
    badgeBg: '#d97333',
    badgeColor: '#1a1a1a',
    title: 'Snacks & Chai',
    subtitle: 'Samosas, pakoras, chaat & tea-time treats',
  },
  {
    id: 'night',
    image: require('../assets/home/meal-night.png'),
    badge: 'Night · 8 PM – 12 AM',
    badgeBg: '#403380',
    badgeColor: '#fff',
    title: 'Dinner & Late Bites',
    subtitle: 'Curries, naan, kebabs & midnight cravings',
  },
];

function AdBanner({ compact = false, onCheckDeals }) {
  return (
    <ImageBackground
      source={require('../assets/home/ad-banner.jpg')}
      style={[styles.adBanner, compact && styles.adBannerCompact]}
      imageStyle={styles.adBannerImage}
    >
      <View style={styles.adScrim} />
      <View style={styles.adTag}>
        <View style={styles.adTagDot} />
        <Text style={styles.adTagText}>ADVERTISEMENT</Text>
      </View>
      <View style={styles.adContent}>
        <Text style={styles.adEyebrow}>SMART GROCERY</Text>
        <Text style={styles.adTitle} numberOfLines={compact ? 1 : 2}>
          Save up to 40% on essentials
        </Text>
        {!compact && (
          <Text style={styles.adSubtitle}>
            Live real-time price comparison across quick stores.
          </Text>
        )}
        <Pressable style={styles.adButton} onPress={onCheckDeals}>
          <Text style={styles.adButtonText}>Check Deals</Text>
          <ArrowSmallIcon width={9} height={9} />
        </Pressable>
      </View>
    </ImageBackground>
  );
}

function ModeCard({
  images,
  badge,
  badgeStyle,
  badgeTextStyle,
  title,
  subtitle,
  onPress,
  startDelay = 0,
}) {
  const slides = useMemo(() => (images || []).slice(0, 6), [images]);
  // Clone first slide at the end for a seamless infinite loop reset.
  const loopSlides = useMemo(
    () => (slides.length ? [...slides, slides[0]] : []),
    [slides]
  );

  const [size, setSize] = useState({ width: 0, height: 0 });
  const sizeRef = useRef({ width: 0, height: 0 });
  const pageRef = useRef(0);
  const busyRef = useRef(false);
  const trackX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (slides.length < 2) return undefined;

    let intervalId;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        const width = sizeRef.current.width;
        if (!width || busyRef.current) return;

        busyRef.current = true;
        const nextPage = pageRef.current + 1;

        Animated.timing(trackX, {
          toValue: -nextPage * width,
          duration: MODE_TRANSITION_MS,
          easing: Easing.inOut(Easing.cubic),
          // JS driver keeps the image layer under gradient/text (native
          // driver promotes the track above later siblings on Android).
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (!finished) {
            busyRef.current = false;
            return;
          }

          if (nextPage >= slides.length) {
            // Landed on cloned first slide — snap to real first (identical frame).
            trackX.setValue(0);
            pageRef.current = 0;
          } else {
            pageRef.current = nextPage;
          }
          busyRef.current = false;
        });
      }, MODE_SLIDE_MS);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      trackX.stopAnimation();
      busyRef.current = false;
    };
  }, [slides.length, startDelay, trackX]);

  if (!slides.length) return null;

  return (
    <RNPressable
      style={styles.modeCard}
      onPress={onPress}
      onLayout={(event) => {
        // Measure the outer card (no padding) so slides fill edge-to-edge.
        const nextWidth = Math.round(event.nativeEvent.layout.width);
        const nextHeight = Math.round(event.nativeEvent.layout.height);
        if (
          nextWidth > 0 &&
          nextHeight > 0 &&
          (nextWidth !== size.width || nextHeight !== size.height)
        ) {
          sizeRef.current = { width: nextWidth, height: nextHeight };
          setSize({ width: nextWidth, height: nextHeight });
          trackX.setValue(-pageRef.current * nextWidth);
        }
      }}
    >
      <RNView style={styles.modeMedia} pointerEvents="none">
        {size.width > 0 ? (
          <Animated.View
            style={[
              styles.modeTrack,
              {
                width: size.width * loopSlides.length,
                height: size.height,
                transform: [{ translateX: trackX }],
              },
            ]}
          >
            {loopSlides.map((source, slideIndex) => (
              <Image
                key={`mode-slide-${slideIndex}`}
                source={source}
                style={{ width: size.width, height: size.height }}
                resizeMode="cover"
              />
            ))}
          </Animated.View>
        ) : (
          <Image
            source={slides[0]}
            style={styles.modeMediaFill}
            resizeMode="cover"
          />
        )}
      </RNView>

      <RNView style={styles.modeCardBg} pointerEvents="box-none">
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.88)']}
          locations={[0, 0.45, 1]}
          style={styles.modeScrim}
          pointerEvents="none"
        />

        <RNView style={[styles.modeBadge, badgeStyle]}>
          <RNText style={[styles.modeBadgeText, badgeTextStyle]}>{badge}</RNText>
        </RNView>

        <RNView style={styles.modeTextGroup}>
          <RNText style={styles.modeTitle}>{title}</RNText>
          <RNText style={styles.modeSubtitle} numberOfLines={1}>
            {subtitle}
          </RNText>
        </RNView>
      </RNView>
    </RNPressable>
  );
}

export default function HomeScreen({
  location: initialLocation = 'Ghaziabad',
  onSelectFood,
  onSelectGrocery,
  onCheckDeals,
  onCart,
  onProfile,
  onAddAddress,
  onLocationChange,
}) {
  const [mealIndex, setMealIndex] = useState(0);
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  const [selectedAddressId, setSelectedAddressId] = useState('home');
  const [locating, setLocating] = useState(false);
  const mealRef = useRef(null);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const onMealScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== mealIndex && index >= 0 && index < MEALS.length) {
      setMealIndex(index);
    }
  };

  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ThemedStatusBar />

      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <View style={styles.headerLeft}>
          <Pressable
            style={styles.locationButton}
            onPress={() => setLocationSheetOpen(true)}
          >
            <Text style={[styles.deliverLabel, { color: colors.textMuted }]}>
              DELIVER TO
            </Text>
            <View style={styles.locationRow}>
              <LocationPinIcon width={11} height={13} color={colors.text} />
              <Text
                style={[styles.locationText, { color: colors.text }]}
                numberOfLines={1}
              >
                {location}
              </Text>
              <LocationChevronIcon width={7} height={4} color={colors.text} />
            </View>
          </Pressable>
        </View>

        <View style={styles.logoWrap}>
          <Image
            source={require('../assets/brand/kisse-loon-wordmark.png')}
            style={styles.wordmarkDepth}
            resizeMode="contain"
            tintColor="#1a1208"
          />
          <Image
            source={require('../assets/brand/kisse-loon-wordmark.png')}
            style={styles.wordmark}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerRight}>
          <HeaderCartButton onPress={onCart} />
          <HeaderProfileButton onPress={onProfile} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AdBanner onCheckDeals={onCheckDeals} />

        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Where do you want to shop?</Text>
          <Text style={styles.subheading}>
            Compare prices. Save more. Order smarter.
          </Text>
        </View>

        <View style={styles.modeRow}>
          <ModeCard
            images={FOOD_MODE_IMAGES}
            badge="MEALS"
            badgeStyle={styles.foodBadge}
            badgeTextStyle={styles.foodBadgeText}
            title="Food"
            subtitle="Find dishes & restaurants"
            onPress={onSelectFood}
          />
          <ModeCard
            images={GROCERY_MODE_IMAGES}
            badge="ESSENTIALS"
            badgeStyle={styles.groceryBadge}
            badgeTextStyle={styles.groceryBadgeText}
            title="Grocery"
            subtitle="Compare everyday essentials"
            onPress={onSelectGrocery}
            startDelay={1000}
          />
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealHint}>
            Swipe to explore meals for every time of day
          </Text>

          <ScrollView
            ref={mealRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onMealScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
          >
            {MEALS.map((meal) => (
              <View key={meal.id} style={styles.mealPage}>
                <ImageBackground
                  source={meal.image}
                  style={styles.mealCard}
                  imageStyle={styles.mealCardImage}
                >
                  <View style={styles.mealScrim} />
                  <View
                    style={[styles.mealBadge, { backgroundColor: meal.badgeBg }]}
                  >
                    <Text
                      style={[styles.mealBadgeText, { color: meal.badgeColor }]}
                    >
                      {meal.badge}
                    </Text>
                  </View>
                  <View style={styles.mealTextGroup}>
                    <Text style={styles.mealTitle}>{meal.title}</Text>
                    <Text style={styles.mealSubtitle}>{meal.subtitle}</Text>
                  </View>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {MEALS.map((meal, index) => (
              <View
                key={meal.id}
                style={[
                  styles.dot,
                  index === mealIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <AdBanner compact onCheckDeals={onCheckDeals} />
      </ScrollView>

      <ChooseLocationSheet
        visible={locationSheetOpen}
        selectedId={selectedAddressId}
        onClose={() => setLocationSheetOpen(false)}
        onSelect={(address) => {
          setSelectedAddressId(address.id);
          setLocation(address.city);
          onLocationChange?.(address.city);
          setLocationSheetOpen(false);
        }}
        onUseCurrentLocation={async () => {
          if (locating) return;
          setLocating(true);
          try {
            const { label } = await fetchCurrentLocationLabel();
            setSelectedAddressId(null);
            setLocation(label);
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
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  locationButton: {
    maxWidth: '100%',
  },
  deliverLabel: {
    color: '#76777d',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
    lineHeight: 12,
  },
  locationRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 24,
    maxWidth: 88,
  },
  logoWrap: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3.5,
    elevation: 4,
  },
  wordmarkDepth: {
    position: 'absolute',
    width: 97,
    height: 24,
    opacity: 0.28,
    transform: [{ translateX: 0.8 }, { translateY: 1.4 }],
  },
  wordmark: {
    width: 97,
    height: 24,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  adBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    height: 172,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  adBannerCompact: {
    height: 120,
    marginTop: 36,
  },
  adBannerImage: {
    borderRadius: 16,
  },
  adScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
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
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
    lineHeight: 12,
  },
  adContent: {
    gap: 4,
    zIndex: 1,
  },
  adEyebrow: {
    color: '#ffb95f',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
    lineHeight: 12,
  },
  adTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
    lineHeight: 25,
  },
  adSubtitle: {
    color: '#d3e4fe',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.12,
    lineHeight: 16,
  },
  adButton: {
    marginTop: 8,
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
    letterSpacing: 0.24,
    lineHeight: 16,
  },
  headingBlock: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },
  heading: {
    color: '#0b1c30',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  subheading: {
    marginTop: 2,
    color: '#45464d',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  modeRow: {
    flexDirection: 'row',
    gap: MODE_ROW_GAP,
    paddingHorizontal: PAGE_PADDING,
    marginBottom: 8,
  },
  modeCard: {
    flex: 1,
    height: 152,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  modeMedia: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  modeMediaFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  modeTrack: {
    flexDirection: 'row',
  },
  modeCardBg: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 12,
  },
  modeScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  modeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  foodBadge: {
    backgroundColor: '#faa61a',
  },
  groceryBadge: {
    backgroundColor: '#33c773',
  },
  modeBadgeText: {
    color: '#261a00',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.8,
  },
  foodBadgeText: {
    color: '#261a00',
  },
  groceryBadgeText: {
    color: '#00260d',
  },
  modeTextGroup: {
    gap: 2,
  },
  modeTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  modeSubtitle: {
    color: '#f0f0f0',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  mealSection: {
    paddingTop: 8,
    paddingBottom: 8,
    gap: 8,
  },
  mealHint: {
    paddingHorizontal: 16,
    color: '#737373',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  mealPage: {
    width: SCREEN_WIDTH,
    paddingHorizontal: PAGE_PADDING,
  },
  mealCard: {
    width: CARD_WIDTH,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 12,
  },
  mealCardImage: {
    borderRadius: 16,
  },
  mealScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  mealBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  mealBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  mealTextGroup: {
    gap: 2,
    zIndex: 1,
  },
  mealTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  mealSubtitle: {
    color: '#d9d9d9',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    width: 16,
    backgroundColor: '#fea619',
  },
});
