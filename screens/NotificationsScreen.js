import { useMemo, useState } from 'react';
import {
  StyleSheet
} from 'react-native';

import {
  GiftIcon,
  NotifBellIcon,
  NotifCheckIcon,
  SparklesIcon,
  TagIcon,
} from '../components/icons';
import ScreenHeader from '../components/ScreenHeader';
import { DEMO_NOTIFICATIONS } from '../constants/demoNotifications';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const SECTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
];

function NotificationIcon({ type, unread }) {
  const accent = unread ? '#FF5A1F' : '#0B1C30';

  switch (type) {
    case 'price':
      return <TagIcon width={16} height={16} color={accent} />;
    case 'delivered':
      return <NotifCheckIcon width={16} height={16} color={accent} />;
    case 'feature':
      return <SparklesIcon width={16} height={16} color={accent} />;
    case 'promo':
      return <GiftIcon width={16} height={16} color={accent} />;
    case 'stock':
      return <NotifBellIcon width={16} height={16} color={accent} />;
    default:
      return <NotifBellIcon width={16} height={16} color={accent} />;
  }
}

function NotificationCard({ item, onPress }) {
  return (
    <Pressable
      style={[styles.card, item.unread ? styles.cardUnread : styles.cardRead]}
      onPress={() => onPress?.(item)}
    >
      <View
        style={[
          styles.iconBg,
          item.unread ? styles.iconBgUnread : styles.iconBgRead,
        ]}
      >
        <NotificationIcon type={item.type} unread={item.unread} />
      </View>
      <View style={styles.content}>
        <Text
          style={[styles.title, item.unread ? styles.titleUnread : styles.titleRead]}
        >
          {item.title}
        </Text>
        <Text style={styles.time}>{item.timeLabel}</Text>
      </View>
      {item.unread ? <View style={styles.unreadDot} /> : null}
    </Pressable>
  );
}

export default function NotificationsScreen({
  notifications = DEMO_NOTIFICATIONS,
  onBack,
}) {
  const [items, setItems] = useState(notifications);

  const sections = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        items: items.filter((item) => item.section === section.id),
      })).filter((section) => section.items.length > 0),
    [items]
  );

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const markOneRead = (item) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id ? { ...entry, unread: false } : entry
      )
    );
  };

  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ThemedStatusBar />

      <ScreenHeader
        title="Notifications"
        onBack={onBack}
        right={
          <Pressable onPress={markAllRead} hitSlop={8}>
            <Text style={styles.markAll}>Mark all as read</Text>
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            {section.items.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                onPress={markOneRead}
              />
            ))}
          </View>
        ))}
        {sections.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.emptySubtitle}>
              Price drops, order updates, and offers will show up here.
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
  markAll: {
    color: '#ff5a1f',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 20,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardUnread: {
    backgroundColor: '#fff7f2',
    borderWidth: 1,
    borderColor: 'rgba(255,90,31,0.15)',
  },
  cardRead: {
    backgroundColor: '#fff',
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBgUnread: {
    backgroundColor: '#ffece5',
  },
  iconBgRead: {
    backgroundColor: '#e5eeff',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#0b1c30',
    fontSize: 13,
    lineHeight: 18,
  },
  titleUnread: {
    fontFamily: 'Inter_700Bold',
  },
  titleRead: {
    fontFamily: 'Inter_500Medium',
  },
  time: {
    color: '#76777d',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff5a1f',
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
