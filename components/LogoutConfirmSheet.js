import {
  StyleSheet
} from 'react-native';
import BottomSheet from './BottomSheet';
import { LogoutHandIcon } from './icons';
import { Pressable, Text, View } from '../theme/themed';

export default function LogoutConfirmSheet({ visible, onCancel, onConfirm }) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onCancel}
      contentStyle={styles.content}
      handleOnly={false}
    >
      {({ close }) => (
        <>
          <View style={styles.iconCircle}>
            <LogoutHandIcon width={32} height={32} color="#BA1A1A" />
          </View>

          <View style={styles.textStack}>
            <Text style={styles.title}>Log out?</Text>
            <Text style={styles.subtitle}>
              Are you sure you want to log out of your Kisse Loon account?
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelBtn} onPress={() => close()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.confirmBtn}
              onPress={() => close(onConfirm)}
            >
              <Text style={styles.confirmText}>Log Out</Text>
            </Pressable>
          </View>
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffdad6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStack: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#0b1c30',
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'Inter_800ExtraBold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#76777d',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#0b1c30',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#ba1a1a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
});
