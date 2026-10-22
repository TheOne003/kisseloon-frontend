import { useState } from 'react';
import {
  Image,
  StyleSheet
} from 'react-native';

import {
  ClockIcon,
  FilterChevronIcon,
  StarIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import PlatformIcon from '../components/PlatformIcon';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const FILTERS = [
  { id: 'sort', label: 'Sort', hasChevron: true },
  { id: 'rating', label: 'Rating 4.0+' },
  { id: 'time', label: 'Delivery Time' },
];

function PlatformBadge({ platform }) {
  return <PlatformIcon platform={platform} size={22} />;
}

function RestaurantCard({ restaurant, dishLabel, onPress }) {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(restaurant)}>
      <Image source={restaurant.image} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <View style={styles.cardTop}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.cuisine} numberOfLines={1}>
              {restaurant.cuisine}
            </Text>
            <View style={styles.dot} />
            <View style={styles.ratingRow}>
              <StarIcon width={10} height={10} />
              <Text style={styles.rating}>{restaurant.rating}</Text>
            </View>
          </View>
          <View style={styles.timeRow}>
            <ClockIcon width={12} height={12} />
            <Text style={styles.timeText}>{restaurant.time}</Text>
          </View>
          <View style={styles.platformsRow}>
            <Text style={styles.availableOn}>Available on</Text>
            {restaurant.platforms.map((platform) => (
              <PlatformBadge key={platform} platform={platform} />
            ))}
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.availableTag}>
            <Text style={styles.availableTagText}>
              {dishLabel} available
            </Text>
          </View>
          <Text style={styles.viewRestaurant}>View restaurant →</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function RestaurantResultsScreen({
  query = 'Chicken Biryani',
  location = 'Koramangala, Bengaluru',
  restaurants = [],
  onBack,
  onSelectRestaurant,
}) {
  const [activeFilter, setActiveFilter] = useState('time');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={onBack} />
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>
              {query}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.filtersRow}>
        {FILTERS.map((filter) => {
          const active = activeFilter === filter.id;
          return (
            <Pressable
              key={filter.id}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}
                numberOfLines={1}
              >
                {filter.label}
              </Text>
              {filter.hasChevron ? (
                <FilterChevronIcon
                  width={10}
                  height={10}
                  color={active ? '#684000' : '#76777D'}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Restaurants serving {query}</Text>

        <View style={styles.cards}>
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              dishLabel={query}
              onPress={onSelectRestaurant}
            />
          ))}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(198,198,205,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
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
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c6c6cd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  filterChipActive: {
    backgroundColor: 'rgba(254,166,25,0.15)',
    borderColor: '#fea619',
  },
  filterText: {
    color: '#0b1c30',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  filterTextActive: {
    color: '#684000',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  sectionTitle: {
    color: '#0b1c30',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  cards: {
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    height: 136,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: 100,
    height: 112,
    borderRadius: 12,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTop: {
    gap: 4,
  },
  restaurantName: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cuisine: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    flexShrink: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#76777d',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: '#0b1c30',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#76777d',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  platformsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  availableOn: {
    color: '#808080',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availableTag: {
    backgroundColor: 'rgba(254,166,25,0.15)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  availableTagText: {
    color: '#684000',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  viewRestaurant: {
    color: '#684000',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
});
