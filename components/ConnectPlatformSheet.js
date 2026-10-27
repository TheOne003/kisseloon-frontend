import { StyleSheet } from 'react-native';
import BottomSheet from './BottomSheet';
import PlatformIcon from './PlatformIcon';
import { CheckGreenIcon } from './icons';
import {
  CONNECTABLE_PLATFORMS,
  PLATFORM_CATEGORIES,
  getConnectionById,
} from '../constants/connectablePlatforms';
import { Pressable, Text, View } from '../theme/themed';

function PlatformCell({ platform, connections, onSelect }) {
  const connection = getConnectionById(connections, platform.id);
  const connected = connection?.status === 'connected';

  return (
    <Pressable
      style={[styles.cell, connected && styles.cellLinked]}
      disabled={connected}
      onPress={() => onSelect?.(platform)}
    >
      <View style={styles.iconWrap}>
        <PlatformIcon platform={platform} size={48} borderWidth={0} />
        {connected ? (
          <View style={styles.check}>
            <CheckGreenIcon width={12} height={12} color="#059669" />
          </View>
        ) : null}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {platform.shortName || platform.name}
      </Text>
    </Pressable>
  );
}

export default function ConnectPlatformSheet({
  visible,
  connections = [],
  onClose,
  onSelect,
  onSkip,
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeight="72%">
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Connect platforms</Text>
          <Text style={styles.subtitle}>Tap an app icon to link it</Text>
        </View>
        <Pressable onPress={onSkip || onClose} hitSlop={8} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {PLATFORM_CATEGORIES.map((category) => {
        const items = CONNECTABLE_PLATFORMS.filter(
          (item) => item.category === category
        );
        return (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionLabel}>{category}</Text>
            <View style={styles.grid}>
              {items.map((platform) => (
                <PlatformCell
                  key={platform.id}
                  platform={platform}
                  connections={connections}
                  onSelect={onSelect}
                />
              ))}
            </View>
          </View>
        );
      })}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: '#0b1c30',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    color: '#76777d',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#eff4ff',
  },
  skipText: {
    color: '#0b1c30',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  section: {
    marginTop: 12,
    marginBottom: 4,
  },
  sectionLabel: {
    color: '#76777d',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f8f9ff',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cell: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 6,
  },
  cellLinked: {
    opacity: 0.45,
  },
  iconWrap: {
    position: 'relative',
  },
  check: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: '#0b1c30',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    maxWidth: 84,
  },
});
