import { useState } from 'react';
import { StyleSheet } from 'react-native';

import ConnectPlatformSheet from '../components/ConnectPlatformSheet';
import PlatformLinkSheet from '../components/PlatformLinkSheet';
import PlatformManageSheet from '../components/PlatformManageSheet';
import PlatformIcon from '../components/PlatformIcon';
import ScreenHeader from '../components/ScreenHeader';
import ThemedStatusBar from '../components/ThemedStatusBar';
import { PlusIcon, ProfileChevronIcon, StoreIcon } from '../components/icons';
import { maskPhone } from '../constants/auth';
import {
  MIN_COMPARE_PLATFORMS,
  countActivePlatforms,
  getConnectablePlatform,
} from '../constants/connectablePlatforms';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '../theme/themed';

function PlatformRow({ connection, onPress }) {
  const platform = getConnectablePlatform(connection.id);
  if (!platform) return null;

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <PlatformIcon platform={platform} size={40} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{platform.name}</Text>
        <Text style={styles.rowHint}>
          {`Connected · ${maskPhone(connection.phone)}`}
        </Text>
      </View>
      <View style={[styles.statusDot, styles.statusOn]} />
      <ProfileChevronIcon width={7} height={10} color="#76777D" />
    </Pressable>
  );
}

export default function ConnectedPlatformsScreen({
  connections = [],
  onBack,
  onConnect,
  onDisconnectPlatform,
}) {
  const { colors } = useTheme();
  const [listOpen, setListOpen] = useState(false);
  const [linkPlatform, setLinkPlatform] = useState(null);
  const [manageConnection, setManageConnection] = useState(null);

  const activeCount = countActivePlatforms(connections);
  const remaining = Math.max(MIN_COMPARE_PLATFORMS - activeCount, 0);

  const openLink = (platform) => {
    setListOpen(false);
    setManageConnection(null);
    setTimeout(() => setLinkPlatform(platform), 260);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ThemedStatusBar />
      <ScreenHeader title="Connected platforms" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summary}>
          <View style={styles.summaryIcon}>
            <StoreIcon width={18} height={18} color="#855300" />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>
              {activeCount} of {MIN_COMPARE_PLATFORMS} needed to compare
            </Text>
            <Text style={styles.summaryBody}>
              {remaining > 0
                ? `Connect ${remaining} more platform${remaining === 1 ? '' : 's'} to unlock live price comparison.`
                : 'You’re ready to compare. Tap a platform to disconnect it.'}
            </Text>
          </View>
        </View>

        {connections.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No platforms yet</Text>
            <Text style={styles.emptyBody}>
              Link Swiggy, Blinkit, Zepto and more with a quick mobile OTP.
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            {connections.map((connection) => (
              <PlatformRow
                key={connection.id}
                connection={connection}
                onPress={() => setManageConnection(connection)}
              />
            ))}
          </View>
        )}

        <Pressable style={styles.connectMore} onPress={() => setListOpen(true)}>
          <View style={styles.plusWrap}>
            <PlusIcon width={16} height={16} color="#FEA619" />
          </View>
          <Text style={styles.connectMoreText}>Connect more platforms</Text>
        </Pressable>
      </ScrollView>

      <ConnectPlatformSheet
        visible={listOpen}
        connections={connections}
        onClose={() => setListOpen(false)}
        onSkip={() => setListOpen(false)}
        onSelect={openLink}
      />
      <PlatformLinkSheet
        visible={Boolean(linkPlatform)}
        platform={linkPlatform}
        onClose={() => setLinkPlatform(null)}
        onLinked={(next) => {
          onConnect?.(next);
          setLinkPlatform(null);
        }}
      />
      <PlatformManageSheet
        visible={Boolean(manageConnection)}
        connection={manageConnection}
        onClose={() => setManageConnection(null)}
        onDisconnect={onDisconnectPlatform}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  summary: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: {
    flex: 1,
    gap: 4,
  },
  summaryTitle: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  summaryBody: {
    color: '#45464d',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  empty: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  emptyBody: {
    color: '#76777d',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  rowHint: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusOn: {
    backgroundColor: '#059669',
  },
  connectMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
  },
  plusWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectMoreText: {
    color: '#fea619',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
