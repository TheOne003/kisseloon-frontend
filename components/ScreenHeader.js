import { StyleSheet } from 'react-native';
import { HeaderProfileButton } from './HeaderIconButton';
import { useTheme } from '../theme/ThemeContext';
import { Text, View } from '../theme/themed';

/**
 * Shared top bar: title + profile badge (no back arrow).
 */
export default function ScreenHeader({
  title,
  onBack: _onBack,
  right = null,
  showProfile = true,
  onProfile,
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
      <View style={styles.left}>
        {title ? (
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        ) : null}
      </View>

      {right != null ? (
        right
      ) : showProfile ? (
        <HeaderProfileButton onPress={onProfile} />
      ) : (
        <View style={styles.rightSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 28,
    letterSpacing: -0.2,
    fontFamily: 'Inter_600SemiBold',
  },
  rightSpacer: {
    width: 36,
    height: 36,
  },
});
