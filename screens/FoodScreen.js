import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';

import {
  ArrowRightBrownIcon,
  ArrowSmallIcon,
  ChevronDownIcon,
  LocationPinIcon,
  MicIcon,
  SearchIcon20,
  SparklesIcon,
} from '../components/icons';
import {
  HeaderCartButton,
  HeaderProfileButton,
} from '../components/HeaderIconButton';
import ChooseLocationSheet from '../components/ChooseLocationSheet';
import { getDemoSearchResult } from '../constants/demoSearch';
import { fetchCurrentLocationLabel } from '../services/locationService';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const POPULAR = [
  {
    id: 'biryani',
    name: 'Chicken Biryani',
    platforms: 'From 3 platforms',
    price: 'From ₹190',
    image: require('../assets/food/biryani.jpg'),
  },
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    platforms: 'From 4 platforms',
    price: 'From ₹260',
    image: require('../assets/food/butter-chicken.jpg'),
  },
  {
    id: 'paneer-tikka',
    name: 'Paneer Tikka',
    platforms: 'From 3 platforms',
    price: 'From ₹220',
    image: require('../assets/food/paneer-tikka.jpg'),
  },
];

export default function FoodScreen({
  location = 'Koramangala, Bengaluru',
  onBack,
  onLocationChange,
  onCart,
  onProfile,
  onExploreFood,
  onCheckDeals,
  onSelectDish,
  onSearch,
  onAddAddress,
}) {
  const [query, setQuery] = useState('');
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(location);
  const [selectedAddressId, setSelectedAddressId] = useState('home');
  const [locating, setLocating] = useState(false);
  const { colors } = useTheme();

  const submitSearch = (value = query) => {
    const result = getDemoSearchResult(value);
    if (result) {
      onSearch?.(result);
      return;
    }
    onSelectDish?.({ name: value.trim() });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food</Text>
        <View style={styles.headerActions}>
          <HeaderCartButton onPress={onCart} />
          <HeaderProfileButton onPress={onProfile} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={styles.locationRow}
          onPress={() => setLocationSheetOpen(true)}
        >
          <View style={styles.locationLeft}>
            <LocationPinIcon width={12} height={12} />
            <Text style={styles.locationText} numberOfLines={1}>
              Delivering to {currentLocation}
            </Text>
          </View>
          <View style={styles.locationChange}>
            <Text style={styles.changeText}>Change</Text>
            <ChevronDownIcon width={14} height={14} color={colors.textMuted} />
          </View>
        </Pressable>

        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>What are you looking for?</Text>
          <Text style={styles.greetingSubtitle}>
            Compare prices. Save more. Order smarter.
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <SearchIcon20 width={20} height={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search food, groceries or a restaurant"
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              onSubmitEditing={() => submitSearch()}
            />
            <MicIcon width={18} height={18} color={colors.textMuted} />
          </View>
        </View>

        <View style={styles.heroWrap}>
          <Pressable style={styles.heroCard} onPress={onExploreFood}>
            <View style={styles.heroLeft}>
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroEyebrow}>CRAVING SOMETHING SPECIAL?</Text>
                <Text style={styles.heroTitle}>
                  Discover popular dishes near you
                </Text>
              </View>
              <View style={styles.heroCta}>
                <Text style={styles.heroCtaText}>Explore food</Text>
                <ArrowRightBrownIcon width={14} height={14} />
              </View>
            </View>
            <Image
              source={require('../assets/food/explore-banner.jpg')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </Pressable>
        </View>

        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular near you</Text>
            <Text style={styles.sectionSubtitle}>
              What people are ordering around you
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          >
            {POPULAR.map((item) => (
              <Pressable
                key={item.id}
                style={styles.dishCard}
                onPress={() => {
                  const result = getDemoSearchResult(item.name);
                  if (result) {
                    onSearch?.(result);
                    return;
                  }
                  onSelectDish?.(item);
                }}
              >
                <Image source={item.image} style={styles.dishImage} />
                <View style={styles.dishInfo}>
                  <View style={styles.dishTitleBlock}>
                    <Text style={styles.dishName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.dishPlatforms} numberOfLines={1}>
                      {item.platforms}
                    </Text>
                  </View>
                  <Text style={styles.dishPrice}>{item.price}</Text>
                </View>
              </Pressable>
            ))}
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
          <View style={styles.valueHeader}>
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
        </View>
      </ScrollView>

      <ChooseLocationSheet
        visible={locationSheetOpen}
        selectedId={selectedAddressId}
        onClose={() => setLocationSheetOpen(false)}
        onSelect={(address) => {
          const next = `${address.label}, ${address.city}`;
          setSelectedAddressId(address.id);
          setCurrentLocation(next);
          onLocationChange?.(next);
          setLocationSheetOpen(false);
        }}
        onUseCurrentLocation={async () => {
          if (locating) return;
          setLocating(true);
          try {
            const { label } = await fetchCurrentLocationLabel();
            setSelectedAddressId(null);
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
  locationRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  locationLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    flex: 1,
    color: '#0b1c30',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  locationChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    color: '#fea619',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  greeting: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  greetingTitle: {
    color: '#0b1c30',
    fontSize: 24,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  greetingSubtitle: {
    color: '#45464d',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  searchBar: {
    height: 54,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eff4ff',
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
  heroWrap: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  heroCard: {
    height: 128,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eff4ff',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heroLeft: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  heroTextBlock: {
    gap: 4,
  },
  heroEyebrow: {
    color: '#855300',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    lineHeight: 20,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroCtaText: {
    color: '#855300',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  heroImage: {
    width: 140,
    height: '100%',
  },
  popularSection: {
    gap: 12,
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    gap: 2,
  },
  sectionTitle: {
    color: '#0b1c30',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  sectionSubtitle: {
    color: '#45464d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  carousel: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dishCard: {
    width: 148,
    height: 190,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eff4ff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dishImage: {
    width: '100%',
    height: 100,
  },
  dishInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  dishTitleBlock: {
    gap: 2,
  },
  dishName: {
    color: '#0b1c30',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  dishPlatforms: {
    color: '#76777d',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  dishPrice: {
    color: '#059669',
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  adBanner: {
    marginHorizontal: 16,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
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
  adSubtitle: {
    color: '#d3e4fe',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
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
  },
  valueHeader: {
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
