import { StyleSheet } from 'react-native';
import BottomSheet from './BottomSheet';
import PlatformIcon from './PlatformIcon';
import { getConnectablePlatform } from '../constants/connectablePlatforms';
import { maskPhone } from '../constants/auth';
import { Pressable, Text, View } from '../theme/themed';

export default function PlatformManageSheet({
  visible,
  connection,
  onClose,
  onDisconnect,
}) {
  const platform = getConnectablePlatform(connection?.id);
  if (!platform) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose} handleOnly={false}>
      {({ close }) => (
        <View style={styles.content}>
          <PlatformIcon platform={platform} size={56} />
          <Text style={styles.title}>{platform.name}</Text>
          <Text style={styles.subtitle}>
            {connection?.phone
              ? `Connected with ${maskPhone(connection.phone)}. Disconnect to stop using it for comparison.`
              : 'Disconnect this platform from your account.'}
          </Text>

          <Pressable
            style={styles.dangerBtn}
            onPress={() => close(() => onDisconnect?.(connection.id))}
          >
            <Text style={styles.dangerText}>Disconnect this platform</Text>
          </Pressable>

          <Pressable style={styles.cancelBtn} onPress={() => close()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  title: {
    color: '#0b1c30',
    fontSize: 22,
    fontFamily: 'Inter_800ExtraBold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#76777d',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  dangerBtn: {
    width: '100%',
    backgroundColor: '#ffdad6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerText: {
    color: '#ba1a1a',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  cancelBtn: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#0b1c30',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
});
