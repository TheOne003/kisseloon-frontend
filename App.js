import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Easing,
  Linking,
  StyleSheet,
  View,
} from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SwipeBack from './components/SwipeBack';
import {
  ScreenTransitionHost,
  useScreenTransition,
} from './components/ScreenTransition';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import ItemRaceComparisonAnimation from './components/ItemRaceComparisonAnimation';
import CartOrbitComparisonAnimation from './components/CartOrbitComparisonAnimation';
import VideoSplashScreen from './screens/VideoSplashScreen';
import { DEMO_EMAIL, normalizeEmail } from './constants/auth';
import { countActivePlatforms } from './constants/connectablePlatforms';
import WelcomeScreen from './screens/WelcomeScreen';
import ConnectedPlatformsScreen from './screens/ConnectedPlatformsScreen';
import OtpScreen from './screens/OtpScreen';
import OtpHelpScreen from './screens/OtpHelpScreen';
import HomeScreen from './screens/HomeScreen';
import AddNewAddressScreen from './screens/AddNewAddressScreen';
import FoodScreen from './screens/FoodScreen';
import GroceryScreen from './screens/GroceryScreen';
import GrocerySearchScreen from './screens/GrocerySearchScreen';
import GroceryResultsScreen from './screens/GroceryResultsScreen';
import GroceryPlatformSelectionScreen from './screens/GroceryPlatformSelectionScreen';
import RestaurantResultsScreen from './screens/RestaurantResultsScreen';
import { getDemoGroceryResults } from './constants/demoGroceryResults';
import {
  getDemoGroceryProduct,
  groceryProductToItemDetail,
  groceryProductToRestaurantMeta,
} from './constants/demoGroceryProduct';
import RestaurantMenuScreen from './screens/RestaurantMenuScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import CartScreen from './screens/CartScreen';
import CartPriceComparisonScreen from './screens/CartPriceComparisonScreen';
import CartPlatformSelectionScreen from './screens/CartPlatformSelectionScreen';
import ProfileScreen from './screens/ProfileScreen';
import PersonalInformationScreen from './screens/PersonalInformationScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import { getDemoRestaurantForCard } from './constants/demoRestaurant';
import {
  cartItemFromFoodSelection,
  cartItemFromGroceryProduct,
  getCartFingerprint,
  getCartSummary,
  upsertCartItem,
} from './constants/demoCart';
import {
  ComparisonMode,
  ComparisonSource,
  cartSourceFromItems,
  createCartSnapshotId,
  createComparisonContext,
} from './constants/comparison';
import {
  buildRaceFromCartSelection,
  compareCart,
  compareRestaurantMenu,
  compareSingleItem,
} from './services/comparisonService';
import {
  MENU_ORBIT_COPY,
  PRODUCT_ORBIT_COPY,
} from './constants/demoCartCompare';

/** External deep links when the app has a real integration URL. */
const PLATFORM_CHECKOUT_URLS = {
  // Populated when platform integrations are available.
};

const APP_CANVAS = '#f8f9ff';
const SPLASH_CANVAS = '#ffffff';
const WELCOME_FADE_IN_MS = 420;

function formatProfilePhone(value = '') {
  const digits = String(value).replace(/\D/g, '');
  if (digits.length >= 10) {
    const local = digits.slice(-10);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return '+91 98765 43210';
}

SplashScreen.preventAutoHideAsync().catch(() => {});
// setOptions is unsupported in Expo Go — only apply in dev/production builds.
if (Constants.executionEnvironment !== ExecutionEnvironment.StoreClient) {
  SplashScreen.setOptions({ duration: 0, fade: false });
}

function ThemedAppFrame({ children }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {children}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}

function AppNavigator() {
  const [showVideoSplash, setShowVideoSplash] = useState(true);
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const [screen, setScreen] = useState('welcome');
  const [returnScreen, setReturnScreen] = useState('home');
  const [cartReturnScreen, setCartReturnScreen] = useState('home');
  const [loginEmail, setLoginEmail] = useState('');
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [promptConnect, setPromptConnect] = useState(false);
  const [platformsReturnScreen, setPlatformsReturnScreen] = useState('profile');
  const [deliveryLocation, setDeliveryLocation] = useState('Ghaziabad');
  const [searchResult, setSearchResult] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [grocerySearchQuery, setGrocerySearchQuery] = useState('Amul Gold Milk');
  const [groceryResults, setGroceryResults] = useState(null);
  const [selectedGroceryProduct, setSelectedGroceryProduct] = useState(null);
  const [itemRace, setItemRace] = useState(null);
  const [groceryPlatformSelection, setGroceryPlatformSelection] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartPlatformSelection, setCartPlatformSelection] = useState(null);
  const [comparisonContext, setComparisonContext] = useState(null);
  const [cartComparison, setCartComparison] = useState(null);
  const [cartSnapshot, setCartSnapshot] = useState([]);
  const [raceReturnScreen, setRaceReturnScreen] = useState('restaurant-menu');
  const [raceSessionKey, setRaceSessionKey] = useState(0);
  const [cartPlatformReturnScreen, setCartPlatformReturnScreen] = useState('cart');
  const [selectedCheckoutPlatform, setSelectedCheckoutPlatform] = useState(null);
  const [profileReturnScreen, setProfileReturnScreen] = useState('home');
  const [profileUser, setProfileUser] = useState({
    name: 'Aarav Kumar',
    email: 'aarav@example.com',
    initials: 'AK',
  });

  const cartNavLock = useRef(false);
  const raceNavLock = useRef(false);
  const comparisonContextRef = useRef(null);
  const cartSnapshotRef = useRef([]);
  const pendingMenuComparisonRef = useRef(null);
  const pendingGroceryComparisonRef = useRef(null);
  /** Bumps on every restaurant select so stale race finish callbacks are ignored. */
  const restaurantRaceGenRef = useRef(0);
  /** Bumps on every grocery product select so race always remounts / replays. */
  const groceryRaceGenRef = useRef(0);

  comparisonContextRef.current = comparisonContext;

  const { directionRef, skipRef, busyRef, transitionTo, resetTransition } =
    useScreenTransition();

  const goTo = (next, direction = 'forward') => {
    if (next === screen) return;
    transitionTo(() => setScreen(next), direction);
  };

  const jumpTo = (next) => {
    resetTransition();
    setScreen(next);
  };

  const openFood = () => goTo('food', 'forward');
  const openGrocery = () => goTo('grocery', 'forward');
  const backToHome = () => goTo('home', 'back');
  cartSnapshotRef.current = cartSnapshot;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const cartCount = useMemo(
    () => getCartSummary(cartItems).totalCount,
    [cartItems]
  );

  const cartFingerprint = useMemo(
    () => getCartFingerprint(cartItems),
    [cartItems]
  );

  useEffect(() => {
    // Quantity / membership changes invalidate basket-level results.
    if (
      cartComparison &&
      cartComparison.fingerprint &&
      cartComparison.fingerprint !== cartFingerprint
    ) {
      setCartComparison(null);
      setCartPlatformSelection(null);
    }
  }, [cartFingerprint, cartComparison]);

  useEffect(() => {
    if (!fontsLoaded) return;
    SystemUI.setBackgroundColorAsync(SPLASH_CANVAS).catch(() => {});
  }, [fontsLoaded]);

  useEffect(() => {
    if (showVideoSplash) return;
    welcomeOpacity.setValue(0);
    Animated.timing(welcomeOpacity, {
      toValue: 1,
      duration: WELCOME_FADE_IN_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [showVideoSplash, welcomeOpacity]);

  /** Shared back stack. `animated` = hardware back; swipe uses instant jump. */
  const navigateBack = (animated = false) => {
    const move = (next) => {
      if (!next) return;
      if (animated) goTo(next, 'back');
      else jumpTo(next);
    };

    if (screen === 'notifications') {
      move('profile');
      return true;
    }
    if (screen === 'order-history') {
      move('profile');
      return true;
    }
    if (screen === 'personal-information') {
      move('profile');
      return true;
    }
    if (screen === 'connected-platforms') {
      move(platformsReturnScreen || 'profile');
      return true;
    }
    if (screen === 'profile') {
      move(profileReturnScreen || 'home');
      return true;
    }
    if (screen === 'cart-platform-selection') {
      move(cartPlatformReturnScreen || 'cart');
      return true;
    }
    if (screen === 'cart-price-comparison') {
      move('cart');
      return true;
    }
    if (screen === 'cart-comparison-transition') {
      move('cart');
      return true;
    }
    if (screen === 'cart') {
      move(cartReturnScreen || 'home');
      return true;
    }
    if (screen === 'grocery-platform-selection') {
      move('grocery-results');
      return true;
    }
    if (screen === 'grocery-price-race') {
      pendingGroceryComparisonRef.current = null;
      move(raceReturnScreen || 'grocery-results');
      return true;
    }
    if (screen === 'price-race') {
      const ctx = comparisonContextRef.current;
      if (ctx?.source === ComparisonSource.FOOD_MENU) {
        pendingMenuComparisonRef.current = null;
        move('restaurant-results');
        return true;
      }
      move(raceReturnScreen || 'item-detail');
      return true;
    }
    if (screen === 'item-detail') {
      move('restaurant-menu');
      return true;
    }
    if (screen === 'restaurant-menu') {
      move('restaurant-results');
      return true;
    }
    if (screen === 'restaurant-results') {
      move('food');
      return true;
    }
    if (screen === 'grocery-product') {
      move('grocery-results');
      return true;
    }
    if (screen === 'grocery-results') {
      move('grocery-search');
      return true;
    }
    if (screen === 'grocery-search') {
      move('grocery');
      return true;
    }
    if (screen === 'food' || screen === 'grocery') {
      move('home');
      return true;
    }
    if (screen === 'add-address') {
      move(returnScreen || 'home');
      return true;
    }
    if (screen === 'otp-help') {
      move('otp');
      return true;
    }
    if (screen === 'otp') {
      move('welcome');
      return true;
    }
    return false;
  };

  const goBack = () => {
    navigateBack(false);
  };

  useEffect(() => {
    const onHardwareBack = () => {
      // Block leaving mid splash / while fonts load.
      if (!fontsLoaded || showVideoSplash) return true;
      // Root screens: let Android exit/minimize the app.
      if (screen === 'welcome' || screen === 'home') return false;
      return navigateBack(true);
    };

    const sub = BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBack
    );
    return () => sub.remove();
  }, [fontsLoaded, showVideoSplash, screen]);

  // Keep the native splash up until fonts are ready — never flash a spinner.
  if (!fontsLoaded) {
    return null;
  }

  if (showVideoSplash) {
    return (
      <SafeAreaProvider style={[styles.root, styles.splashRoot]}>
        <VideoSplashScreen
          onReady={() => {
            SplashScreen.hideAsync().catch(() => {});
          }}
          onFinish={() => {
            SystemUI.setBackgroundColorAsync(APP_CANVAS).catch(() => {});
            setShowVideoSplash(false);
          }}
        />
      </SafeAreaProvider>
    );
  }

  const openCart = () => {
    if (screen !== 'cart') {
      setCartReturnScreen(screen);
    }
    goTo('cart', 'forward');
  };

  const addToCart = (item, { open = false } = {}) => {
    setCartItems((prev) => upsertCartItem(prev, item));
    if (open) {
      if (screen !== 'cart') {
        setCartReturnScreen(screen);
      }
      goTo('cart', 'forward');
    }
  };

  const changeCartQty = (id, qty) => {
    setCartItems((prev) => {
      if (qty <= 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) => (item.id === id ? { ...item, qty } : item));
    });
  };

  const removeCartItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const startItemRace = ({ context, race, returnTo, afterRaceScreen, sessionKey }) => {
    raceNavLock.current = false;
    setComparisonContext(context);
    setItemRace(race || null);
    setRaceReturnScreen(returnTo);
    if (sessionKey != null) {
      setRaceSessionKey(sessionKey);
    }
    setScreen(afterRaceScreen || 'price-race');
  };

  const finishItemRace = () => {
    if (raceNavLock.current) return;

    const ctx = comparisonContextRef.current;
    if (ctx?.source === ComparisonSource.FOOD_MENU) {
      const pending = pendingMenuComparisonRef.current;
      // Back-out clears pending; ignore stale/overlapping race completions.
      if (!pending?.ok) return;
      if (pending.selectionGen !== restaurantRaceGenRef.current) return;
      if (
        pending.restaurantId &&
        ctx.restaurantId &&
        pending.restaurantId !== ctx.restaurantId
      ) {
        return;
      }
      raceNavLock.current = true;
      pendingMenuComparisonRef.current = null;
      setScreen('restaurant-menu');
      return;
    }

    if (ctx?.source === ComparisonSource.GROCERY_PRODUCT) {
      const pending = pendingGroceryComparisonRef.current;
      if (!pending?.ok) return;
      if (pending.selectionGen !== groceryRaceGenRef.current) return;
      if (
        pending.productId &&
        ctx.itemIds?.[0] &&
        pending.productId !== ctx.itemIds[0]
      ) {
        return;
      }
      raceNavLock.current = true;
      if (pending.selection) {
        setGroceryPlatformSelection(pending.selection);
      }
      pendingGroceryComparisonRef.current = null;
      // Orbit complete → food-style grocery item detail (swipe to order / add to cart)
      setScreen('grocery-product');
      return;
    }

    raceNavLock.current = true;
    setScreen(raceReturnScreen || 'restaurant-menu');
  };

  const openRestaurantWithMenuComparison = (restaurantCard) => {
    const restaurant = getDemoRestaurantForCard(restaurantCard);
    setSelectedRestaurant(restaurant);

    // Always replay restaurant-level race on each selection from results.
    const selectionGen = restaurantRaceGenRef.current + 1;
    restaurantRaceGenRef.current = selectionGen;

    const result = compareRestaurantMenu(restaurant);
    if (result.ok) {
      pendingMenuComparisonRef.current = { ...result, selectionGen };
      startItemRace({
        context: createComparisonContext({
          mode: ComparisonMode.ITEM,
          source: ComparisonSource.FOOD_MENU,
          itemIds: [restaurant.id],
          restaurantId: restaurant.id,
        }),
        race: result.race,
        returnTo: 'restaurant-menu',
        afterRaceScreen: 'price-race',
        sessionKey: selectionGen,
      });
      return;
    }

    // No platform data — open menu without inventing a race winner
    pendingMenuComparisonRef.current = null;
    setScreen('restaurant-menu');
  };

  /** Food basket: add with best menu price — no item-level race in this flow. */
  const addFoodItemToCart = ({ item, quantity = 1, stayOnMenu = false } = {}) => {
    const dish = item || selectedItem;
    if (!dish || !selectedRestaurant) return;

    const best =
      dish.platforms?.find((p) => p.best) || dish.platforms?.[0];
    if (!best) return;

    const line = cartItemFromFoodSelection({
      item: dish,
      restaurant: selectedRestaurant,
      platform: best,
      quantity,
    });
    setCartItems((prev) => upsertCartItem(prev, line));
    if (!stayOnMenu) {
      setScreen('restaurant-menu');
    }
  };

  const setFoodMenuItemQty = (menuItem, qty) => {
    if (!menuItem || !selectedRestaurant) return;
    const lineId = `food-${menuItem.id}`;
    if (qty <= 0) {
      removeCartItem(lineId);
      return;
    }
    const best =
      menuItem.platforms?.find((p) => p.best) || menuItem.platforms?.[0];
    if (!best) return;
    const line = cartItemFromFoodSelection({
      item: menuItem,
      restaurant: selectedRestaurant,
      platform: best,
      quantity: qty,
    });
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.id === lineId);
      if (existing) {
        return prev.map((entry) =>
          entry.id === lineId ? { ...entry, qty } : entry
        );
      }
      return upsertCartItem(prev, line, { replaceQty: true });
    });
  };

  /** Resolve a grocery detail card (results row or full product). */
  const resolveGroceryProduct = (product) => {
    if (!product) return getDemoGroceryProduct({ id: 'amul-gold-1l' });
    const demo = getDemoGroceryProduct(product);
    if (!product.platforms?.length) return demo;
    return {
      ...demo,
      id: product.id || demo.id,
      name: product.name || demo.name,
      brandLine: product.brand
        ? `${product.brand} • GROCERY`
        : demo.brandLine,
      packSize:
        product.packSize ||
        product.details?.split('•')?.[0]?.trim() ||
        demo.packSize,
      attribute:
        product.attribute ||
        product.details?.split('•')?.[1]?.trim() ||
        demo.attribute,
      image: product.detailImage || product.image || demo.image,
      inStock: product.stock !== 'oos',
      platforms: product.platforms.map((p) => ({
        ...p,
        time: /delivery/i.test(p.time || '')
          ? p.time
          : `${p.time || ''} delivery`.trim(),
        note:
          p.note ||
          (p.best
            ? `You save ₹${product.saveAmount || 0}`
            : p.unavailable
              ? 'Unavailable'
              : 'Higher'),
        noteTone: p.noteTone || (p.best ? 'save' : 'higher'),
      })),
      selectedPlatformId:
        product.platforms.find((p) => p.best)?.id ||
        product.platforms[0]?.id ||
        demo.selectedPlatformId,
    };
  };

  /** Grocery basket: add at best (or chosen) price — no item orbit on silent add. */
  const addGroceryProductToCart = ({
    product,
    platform,
    quantity = 1,
    stayOnResults = true,
  } = {}) => {
    const detail = resolveGroceryProduct(product);
    const chosen =
      platform ||
      detail.platforms?.find((p) => p.best && !p.unavailable) ||
      detail.platforms?.find((p) => !p.unavailable) ||
      detail.platforms?.[0];
    if (!detail || !chosen || chosen.unavailable) return;

    const line = cartItemFromGroceryProduct(detail, chosen);
    setCartItems((prev) =>
      upsertCartItem(prev, { ...line, qty: quantity }, { replaceQty: false })
    );
    setSelectedGroceryProduct(detail);
    if (!stayOnResults) {
      setScreen('grocery-results');
    }
  };

  const setGroceryProductQty = (product, qty) => {
    const detail = resolveGroceryProduct(product);
    const line = cartItemFromGroceryProduct(detail);
    const lineId = line.id;
    if (qty <= 0) {
      removeCartItem(lineId);
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.id === lineId);
      if (existing) {
        return prev.map((entry) =>
          entry.id === lineId ? { ...entry, qty } : entry
        );
      }
      return upsertCartItem(
        prev,
        { ...line, qty },
        { replaceQty: true }
      );
    });
  };

  /** Item-level grocery orbit (Choose where to buy) — always replay. */
  const startGroceryItemComparison = (product) => {
    const detail = resolveGroceryProduct(product);
    setSelectedGroceryProduct(detail);

    const selectionGen = groceryRaceGenRef.current + 1;
    groceryRaceGenRef.current = selectionGen;

    const result = compareSingleItem({ product: detail });
    if (!result.ok) {
      setScreen('grocery-product');
      return;
    }

    pendingGroceryComparisonRef.current = {
      ok: true,
      selectionGen,
      productId: detail.id,
      selection: result.selection,
    };
    setGroceryPlatformSelection(result.selection);

    startItemRace({
      context: createComparisonContext({
        mode: ComparisonMode.ITEM,
        source: ComparisonSource.GROCERY_PRODUCT,
        itemIds: [detail.id],
        variantId: detail.packSize || detail.id,
      }),
      race: result.race,
      returnTo: 'grocery-results',
      afterRaceScreen: 'grocery-price-race',
      sessionKey: selectionGen,
    });
  };

  const startCartComparison = () => {
    if (!cartItems.length) return;
    cartNavLock.current = false;

    const fingerprint = getCartFingerprint(cartItems);
    const snapshot = cartItems.map((item) => ({ ...item }));

    // Explicit full-cart Compare uses race animation (swapped with orbit).
    const snapshotId = createCartSnapshotId();
    const context = createComparisonContext({
      mode: ComparisonMode.CART,
      source: cartSourceFromItems(snapshot),
      itemIds: snapshot.map((item) => item.id),
      cartSnapshotId: snapshotId,
    });

    const earlyResult = compareCart(snapshot);
    const cartRace = earlyResult.ok
      ? buildRaceFromCartSelection(earlyResult.selection)
      : null;

    setComparisonContext(context);
    setCartSnapshot(snapshot);
    setCartComparison({
      fingerprint,
      snapshotId,
      result: earlyResult.ok ? earlyResult : null,
    });
    if (cartRace) {
      setItemRace(cartRace);
    }
    setRaceSessionKey((key) => key + 1);
    setScreen('cart-comparison-transition');
  };

  const finishCartOrbit = () => {
    if (cartNavLock.current) return;
    cartNavLock.current = true;

    const snapshot = cartSnapshotRef.current;
    const result = compareCart(snapshot.length ? snapshot : cartItems);
    if (!result.ok) {
      Alert.alert('Comparison unavailable', result.error || 'Could not compare cart.');
      setScreen('cart');
      return;
    }

    setCartComparison((prev) => ({
      ...prev,
      result,
      fingerprint: getCartFingerprint(result.items),
    }));
    setCartPlatformSelection(result.selection);
    // Orbit → one cart platform-selection step (food and grocery).
    setCartPlatformReturnScreen('cart');
    setScreen('cart-platform-selection');
  };

  const goToCartPlatformSelection = () => {
    setComparisonContext(
      createComparisonContext({
        mode: ComparisonMode.CART,
        source: cartSourceFromItems(cartItems),
        itemIds: cartItems.map((i) => i.id),
        cartSnapshotId: cartComparison?.snapshotId,
      })
    );

    const selection =
      cartComparison?.result?.selection ||
      cartPlatformSelection ||
      compareCart(cartItems).selection;
    setCartPlatformSelection(selection);
    setCartPlatformReturnScreen('cart-price-comparison');
    setScreen('cart-platform-selection');
  };

  const handleCheckoutRedirect = async (platform) => {
    setSelectedCheckoutPlatform(platform);
    const url = platform?.checkoutUrl || PLATFORM_CHECKOUT_URLS[platform?.id];
    if (!url) {
      Alert.alert(
        'Checkout unavailable',
        `${platform?.name || 'This platform'} redirect is not configured yet. Your Kisse Loon cart was kept.`
      );
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(
          'Checkout unavailable',
          `Cannot open ${platform?.name || 'platform'}. Your cart was kept.`
        );
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'Checkout failed',
        'Could not open the external platform. Your cart was kept.'
      );
    }
  };

  const openProfile = () => {
    if (screen !== 'profile') {
      setProfileReturnScreen(screen);
    }
    goTo('profile', 'forward');
  };

  const openPersonalInfo = () => goTo('personal-information', 'forward');

  const openConnectedPlatforms = () => {
    setPlatformsReturnScreen(screen === 'home' ? 'home' : 'profile');
    goTo('connected-platforms', 'forward');
  };

  const connectPlatform = (next) => {
    setConnectedPlatforms((prev) => {
      const rest = prev.filter((item) => item.id !== next.id);
      return [...rest, next];
    });
  };

  const disconnectPlatform = (id) => {
    setConnectedPlatforms((prev) => prev.filter((item) => item.id !== id));
  };

  const canSwipeBack = [
    'profile',
    'personal-information',
    'connected-platforms',
    'order-history',
    'notifications',
    'cart',
    'cart-comparison-transition',
    'cart-price-comparison',
    'cart-platform-selection',
    'food',
    'grocery',
    'grocery-search',
    'grocery-results',
    'grocery-product',
    'grocery-price-race',
    'grocery-platform-selection',
    'restaurant-results',
    'restaurant-menu',
    'item-detail',
    'price-race',
    'add-address',
    'otp',
    'otp-help',
  ].includes(screen);

  return (
    <SafeAreaProvider style={styles.root}>
      <Animated.View style={[styles.root, { opacity: welcomeOpacity }]}>
      <ThemedAppFrame>
      <SwipeBack enabled={canSwipeBack} onBack={goBack}>
        <ScreenTransitionHost
          screenKey={screen}
          directionRef={directionRef}
          skipRef={skipRef}
          busyRef={busyRef}
        >
        {screen === 'welcome' && (
          <WelcomeScreen
            onGetOtp={(nextEmail) => {
              setLoginEmail(nextEmail);
              goTo('otp', 'forward');
            }}
          />
        )}

        {screen === 'otp' && (
          <OtpScreen
            email={loginEmail}
            onBack={() => goTo('welcome', 'back')}
            onChangeEmail={() => goTo('welcome', 'back')}
            onHelp={() => goTo('otp-help', 'forward')}
            onVerify={() => {
              const nextEmail = normalizeEmail(loginEmail) || DEMO_EMAIL;
              setProfileUser((current) => ({
                ...current,
                email: nextEmail,
              }));
              setPromptConnect(true);
              goTo('home', 'forward');
            }}
          />
        )}

        {screen === 'otp-help' && (
          <OtpHelpScreen
            onBack={() => goTo('otp', 'back')}
            onContactSupport={() => {
              console.log('Contact support');
            }}
          />
        )}

        {screen === 'home' && (
          <HomeScreen
            location={deliveryLocation}
            onLocationChange={setDeliveryLocation}
            connections={connectedPlatforms}
            onConnectPlatform={connectPlatform}
            promptConnect={promptConnect}
            onConnectPromptSeen={() => setPromptConnect(false)}
            onSelectFood={openFood}
            onSelectGrocery={openGrocery}
            onCheckDeals={() => console.log('Check deals')}
            onCart={openCart}
            onProfile={openProfile}
            onAddAddress={() => {
              setReturnScreen('home');
              goTo('add-address', 'forward');
            }}
          />
        )}

        {screen === 'grocery' && (
          <GroceryScreen
            location={
              deliveryLocation === 'Ghaziabad'
                ? 'Indirapuram, Ghaziabad'
                : deliveryLocation
            }
            onBack={backToHome}
            onLocationChange={setDeliveryLocation}
            onCart={openCart}
            cartCount={cartCount}
            cartItems={cartItems}
            onProfile={openProfile}
            onCheckDeals={() => console.log('Check deals')}
            onAddProduct={(product) =>
              addGroceryProductToCart({
                product,
                quantity: 1,
                stayOnResults: true,
              })
            }
            onChangeProductQty={setGroceryProductQty}
            onSelectProduct={(product) => {
              const query = product?.name || grocerySearchQuery;
              const results = getDemoGroceryResults(query);
              setGrocerySearchQuery(query);
              setGroceryResults(results);
              goTo('grocery-results', 'forward');
            }}
            onSeeAllCategory={(category) => {
              const query = category?.name || category || 'Milk';
              const results = getDemoGroceryResults(String(query));
              setGrocerySearchQuery(String(query));
              setGroceryResults(results);
              goTo('grocery-results', 'forward');
            }}
            onSearch={(query) => {
              setGrocerySearchQuery(query);
              goTo('grocery-search', 'forward');
            }}
            onAddAddress={() => {
              setReturnScreen('grocery');
              goTo('add-address', 'forward');
            }}
          />
        )}

        {screen === 'grocery-search' && (
          <GrocerySearchScreen
            initialQuery={grocerySearchQuery}
            onBack={() => goTo('grocery', 'back')}
            onProfile={openProfile}
            onSelectProduct={(product) => {
              const results = getDemoGroceryResults(product.name);
              setGrocerySearchQuery(product.name);
              setGroceryResults(results);
              goTo('grocery-results', 'forward');
            }}
            onSelectSuggestion={(suggestion) => {
              const query = `${suggestion.brand}${suggestion.rest}`.trim();
              const results = getDemoGroceryResults(query);
              setGrocerySearchQuery(query);
              setGroceryResults(results);
              goTo('grocery-results', 'forward');
            }}
          />
        )}

        {screen === 'grocery-results' && (
          <GroceryResultsScreen
            {...(groceryResults || getDemoGroceryResults(grocerySearchQuery))}
            cartCount={cartCount}
            cartItems={cartItems}
            onBack={() => goTo('grocery-search', 'back')}
            onCart={openCart}
            onProfile={openProfile}
            onSelectProduct={(product) => {
              startGroceryItemComparison(product);
            }}
            onAddProduct={(product) =>
              addGroceryProductToCart({
                product,
                quantity: 1,
                stayOnResults: true,
              })
            }
            onChangeProductQty={setGroceryProductQty}
            onFooterAction={({ distinctCount }) => {
              if (distinctCount >= 2) {
                startCartComparison();
                return;
              }
              openCart();
            }}
          />
        )}

        {screen === 'grocery-product' && selectedGroceryProduct && (
          <ItemDetailScreen
            item={groceryProductToItemDetail(selectedGroceryProduct)}
            restaurant={groceryProductToRestaurantMeta(selectedGroceryProduct)}
            onBack={() => goTo('grocery-results', 'back')}
            onCart={openCart}
            cartCount={cartCount}
            primaryCtaLabel="Add to Cart"
            onAddToCart={({ item, quantity }) => {
              addGroceryProductToCart({
                product: selectedGroceryProduct,
                quantity: quantity || 1,
                stayOnResults: true,
              });
              goTo('grocery-results', 'back');
            }}
            onOpenPlatform={(platform) =>
              handleCheckoutRedirect({
                id: platform.id,
                name: platform.name || platform.label,
              })
            }
          />
        )}

        {screen === 'grocery-price-race' && (
          <CartOrbitComparisonAnimation
            key={`grocery-orbit-${raceSessionKey}`}
            copy={PRODUCT_ORBIT_COPY}
            items={
              selectedGroceryProduct
                ? [cartItemFromGroceryProduct(selectedGroceryProduct)]
                : []
            }
            onBack={() => {
              pendingGroceryComparisonRef.current = null;
              goTo('grocery-results', 'back');
            }}
            onFinished={finishItemRace}
          />
        )}

        {screen === 'grocery-platform-selection' && groceryPlatformSelection && (
          <GroceryPlatformSelectionScreen
            selection={groceryPlatformSelection}
            onBack={() => goTo('grocery-results', 'back')}
            onProfile={openProfile}
            onContinue={(platform) => {
              const product =
                selectedGroceryProduct ||
                getDemoGroceryProduct({ id: 'amul-gold-1l' });
              const line = cartItemFromGroceryProduct(product, platform);
              setCartItems((prev) => {
                const existing = prev.find((entry) => entry.id === line.id);
                if (existing) {
                  return prev.map((entry) =>
                    entry.id === line.id
                      ? { ...entry, ...line, qty: entry.qty }
                      : entry
                  );
                }
                return upsertCartItem(prev, line);
              });
              openCart();
            }}
          />
        )}

        {screen === 'food' && (
          <FoodScreen
            location={
              deliveryLocation === 'Ghaziabad'
                ? 'Koramangala, Bengaluru'
                : deliveryLocation
            }
            onBack={backToHome}
            onLocationChange={setDeliveryLocation}
            onCart={openCart}
            onProfile={openProfile}
            onExploreFood={() => console.log('Explore food')}
            onCheckDeals={() => console.log('Check deals')}
            onSelectDish={(dish) => console.log('Select dish', dish.name)}
            onSearch={(result) => {
              setSearchResult(result);
              goTo('restaurant-results', 'forward');
            }}
            onAddAddress={() => {
              setReturnScreen('food');
              goTo('add-address', 'forward');
            }}
          />
        )}

        {screen === 'restaurant-results' && searchResult && (
          <RestaurantResultsScreen
            query={searchResult.query}
            location={searchResult.location}
            restaurants={searchResult.restaurants}
            onBack={() => goTo('food', 'back')}
            onSelectRestaurant={openRestaurantWithMenuComparison}
          />
        )}

        {screen === 'restaurant-menu' && selectedRestaurant && (
          <RestaurantMenuScreen
            restaurant={selectedRestaurant}
            onBack={() => goTo('restaurant-results', 'back')}
            onCart={openCart}
            cartCount={cartCount}
            cartItems={cartItems}
            onSelectItem={(item) => {
              setSelectedItem(item);
              goTo('item-detail', 'forward');
            }}
            onAddItem={(item) =>
              addFoodItemToCart({ item, quantity: 1, stayOnMenu: true })
            }
            onChangeItemQty={setFoodMenuItemQty}
            onFooterAction={({ distinctCount }) => {
              if (distinctCount >= 2) {
                startCartComparison();
                return;
              }
              openCart();
            }}
          />
        )}

        {screen === 'item-detail' && selectedItem && selectedRestaurant && (
          <ItemDetailScreen
            item={selectedItem}
            restaurant={selectedRestaurant}
            onBack={() => goTo('restaurant-menu', 'back')}
            onCart={openCart}
            cartCount={cartCount}
            primaryCtaLabel="Add to Cart"
            onAddToCart={(payload) =>
              addFoodItemToCart({ ...payload, stayOnMenu: false })
            }
            onOpenPlatform={(platform) =>
              handleCheckoutRedirect({
                id: platform.id,
                name: platform.label || platform.name,
                checkoutUrl: platform.checkoutUrl,
              })
            }
          />
        )}

        {/* Restaurant / item-level comparison uses orbit (swapped with race). */}
        {screen === 'price-race' && (
          <CartOrbitComparisonAnimation
            key={`restaurant-orbit-${raceSessionKey}`}
            copy={MENU_ORBIT_COPY}
            items={(selectedRestaurant?.menu || []).slice(0, 3).map((item) =>
              cartItemFromFoodSelection({
                item,
                restaurant: selectedRestaurant,
                platform:
                  item.platforms?.find((p) => p.best) || item.platforms?.[0],
                quantity: 1,
              })
            )}
            onBack={() => {
              pendingMenuComparisonRef.current = null;
              goTo('restaurant-results', 'back');
            }}
            onFinished={finishItemRace}
          />
        )}

        {screen === 'cart' && (
          <CartScreen
            items={cartItems}
            onBack={() => goTo(cartReturnScreen || 'home', 'back')}
            onContinueShopping={() => goTo(cartReturnScreen || 'home', 'back')}
            onComparePrices={startCartComparison}
            onChangeQty={changeCartQty}
            onRemoveItem={removeCartItem}
          />
        )}

        {screen === 'cart-comparison-transition' && (
          <ItemRaceComparisonAnimation
            key={`cart-race-${raceSessionKey}`}
            location={deliveryLocation}
            racers={itemRace?.racers}
            savingsTitle={itemRace?.savingsTitle || 'Comparing your cart…'}
            savingsSubtitle={
              itemRace?.savingsSubtitle ||
              'Finding the best platform total for your basket.'
            }
            proceedLabel={itemRace?.proceedLabel || 'Continue'}
            onCart={openCart}
            onFinished={finishCartOrbit}
            onProceed={finishCartOrbit}
          />
        )}

        {screen === 'cart-price-comparison' && (
          <CartPriceComparisonScreen
            items={cartSnapshot.length ? cartSnapshot : cartItems}
            onBack={() => goTo('cart', 'back')}
            onEditCart={() => goTo('cart', 'back')}
            onChooseWhereToBuy={goToCartPlatformSelection}
          />
        )}

        {screen === 'cart-platform-selection' && cartPlatformSelection && (
          <CartPlatformSelectionScreen
            selection={cartPlatformSelection}
            onBack={() => goTo(cartPlatformReturnScreen || 'cart', 'back')}
            onContinue={(platform) => handleCheckoutRedirect(platform)}
          />
        )}

        {screen === 'profile' && (
          <ProfileScreen
            name={profileUser.name}
            initials={profileUser.initials}
            email={profileUser.email}
            phone={formatProfilePhone()}
            onBack={() => goTo(profileReturnScreen || 'home', 'back')}
            onPersonalInfo={openPersonalInfo}
            onAddresses={() => {
              setReturnScreen('profile');
              goTo('add-address', 'forward');
            }}
            onOrderHistory={() => goTo('order-history', 'forward')}
            onNotifications={() => goTo('notifications', 'forward')}
            onConnectedPlatforms={openConnectedPlatforms}
            connectedCount={countActivePlatforms(connectedPlatforms)}
            onTerms={() => console.log('Terms & Conditions')}
            onLogout={() => {
              setLoginEmail('');
              setConnectedPlatforms([]);
              setPromptConnect(false);
              jumpTo('welcome');
            }}
          />
        )}

        {screen === 'connected-platforms' && (
          <ConnectedPlatformsScreen
            connections={connectedPlatforms}
            onBack={() => goTo(platformsReturnScreen || 'profile', 'back')}
            onConnect={connectPlatform}
            onDisconnectPlatform={disconnectPlatform}
          />
        )}

        {screen === 'personal-information' && (
          <PersonalInformationScreen
            initialName={profileUser.name}
            initialEmail={profileUser.email}
            phone={formatProfilePhone()}
            onBack={() => goTo('profile', 'back')}
            onSave={({ name, email }) => {
              const parts = name.trim().split(/\s+/).filter(Boolean);
              const initials =
                parts.length >= 2
                  ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
                  : name.slice(0, 2).toUpperCase();
              setProfileUser({ name, email, initials });
              goTo('profile', 'back');
            }}
          />
        )}

        {screen === 'order-history' && (
          <OrderHistoryScreen
            onBack={() => goTo('profile', 'back')}
            onReorder={(order) =>
              console.log('Reorder', order.id, order.platform)
            }
          />
        )}

        {screen === 'notifications' && (
          <NotificationsScreen onBack={() => goTo('profile', 'back')} />
        )}

        {screen === 'add-address' && (
          <AddNewAddressScreen
            onBack={() => goTo(returnScreen, 'back')}
            onSave={(address) => {
              setDeliveryLocation(address.city || 'Ghaziabad');
              goTo(returnScreen, 'back');
            }}
          />
        )}
        </ScreenTransitionHost>
      </SwipeBack>
      </ThemedAppFrame>
      </Animated.View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  splashRoot: {
    backgroundColor: '#ffffff',
  },
});
