import { useMemo, useState } from 'react';
import {
  StyleSheet
} from 'react-native';

import {
  RefreshCwIcon,
  StatusCancelIcon,
  StatusCheckIcon,
} from '../components/icons';
import ScreenHeader from '../components/ScreenHeader';
import { DEMO_ORDERS } from '../constants/demoOrderHistory';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'food', label: 'Food' },
  { id: 'grocery', label: 'Grocery' },
];

function OrderCard({ order, onReorder }) {
  const isFood = order.category === 'food';
  const delivered = order.status === 'delivered';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View
            style={[styles.typeBadge, isFood ? styles.foodBadge : styles.groceryBadge]}
          >
            <Text
              style={[
                styles.typeBadgeText,
                isFood ? styles.foodBadgeText : styles.groceryBadgeText,
              ]}
            >
              {isFood ? 'FOOD' : 'GROCERY'}
            </Text>
          </View>
          <Text style={styles.orderId}>#{order.id}</Text>
        </View>
        <Text style={styles.dateText}>{order.dateLabel}</Text>
      </View>

      <Text style={styles.itemsText} numberOfLines={2}>
        {order.items}
      </Text>
      <View style={styles.platformRow}>
        <Text style={styles.platformLabel}>Platform:</Text>
        <Text style={styles.platformName}>{order.platform}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.price}>₹{order.total}</Text>
          <View style={styles.statusRow}>
            {delivered ? (
              <StatusCheckIcon width={10} height={10} color="#059669" />
            ) : (
              <StatusCancelIcon width={10} height={10} color="#DC2626" />
            )}
            <Text
              style={[
                styles.statusText,
                delivered ? styles.statusDelivered : styles.statusCancelled,
              ]}
            >
              {delivered ? 'Delivered' : 'Cancelled'}
            </Text>
          </View>
        </View>
        <Pressable style={styles.reorderBtn} onPress={() => onReorder?.(order)}>
          <RefreshCwIcon width={12} height={12} color="#FFFFFF" />
          <Text style={styles.reorderText}>Reorder</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function OrderHistoryScreen({
  orders = DEMO_ORDERS,
  onBack,
  onReorder,
}) {
  const [filter, setFilter] = useState('all');

  const visibleOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((order) => order.category === filter);
  }, [filter, orders]);

  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ThemedStatusBar />

      <ScreenHeader title="Order History" onBack={onBack} />

      <View style={styles.filters}>
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <Pressable
              key={item.id}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(item.id)}
            >
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {visibleOrders.map((order) => (
          <OrderCard key={order.id} order={order} onReorder={onReorder} />
        ))}
        {visibleOrders.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Your past food and grocery orders will show up here.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(198,198,205,0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: '#ff5a1f',
    borderColor: '#ff5a1f',
  },
  filterText: {
    color: '#0b1c30',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  foodBadge: {
    backgroundColor: '#ffece5',
  },
  groceryBadge: {
    backgroundColor: '#e6f4ea',
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  foodBadgeText: {
    color: '#ff5a1f',
  },
  groceryBadgeText: {
    color: '#059669',
  },
  orderId: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  dateText: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  itemsText: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  platformLabel: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  platformName: {
    color: '#0b1c30',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(198,198,205,0.45)',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  statusRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  statusDelivered: {
    color: '#059669',
  },
  statusCancelled: {
    color: '#dc2626',
  },
  reorderBtn: {
    backgroundColor: '#ff5a1f',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reorderText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  emptySubtitle: {
    color: '#76777d',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
