import { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet
} from 'react-native';
import { CartIcon, UserFilledIcon } from './icons';
import { useTheme } from '../theme/ThemeContext';
import { Pressable, Text, View } from '../theme/themed';

const THEME_YELLOW = '#FEA619';

/** Shared circular header control — same shape/badge for cart & profile. */
export function HeaderIconButton({
  onPress,
  children,
  style,
  accessibilityLabel,
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: colors.iconButton, shadowColor: colors.shadow },
        style,
      ]}
      onPress={onPress}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Pressable>
  );
}

export function HeaderCartButton({ onPress, count = 0 }) {
  const badgeScale = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      badgeScale.setValue(0.6);
      Animated.sequence([
        Animated.spring(badgeScale, {
          toValue: 1.25,
          friction: 3,
          tension: 180,
          useNativeDriver: true,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          friction: 5,
          tension: 140,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevCount.current = count;
  }, [badgeScale, count]);

  return (
    <HeaderIconButton onPress={onPress} accessibilityLabel="Cart">
      <CartIcon width={18} height={16} color={THEME_YELLOW} />
      {count > 0 ? (
        <Animated.View
          style={[styles.badge, { transform: [{ scale: badgeScale }] }]}
        >
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </Animated.View>
      ) : null}
    </HeaderIconButton>
  );
}

export function HeaderProfileButton({ onPress }) {
  const { colors } = useTheme();
  const icon = <UserFilledIcon width={14} height={15} color={colors.text} />;
  if (!onPress) {
    return (
      <View
        style={[
          styles.button,
          { backgroundColor: colors.iconButton, shadowColor: colors.shadow },
        ]}
      >
        {icon}
      </View>
    );
  }
  return (
    <HeaderIconButton onPress={onPress} accessibilityLabel="Profile">
      {icon}
    </HeaderIconButton>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    paddingHorizontal: 3,
    backgroundColor: THEME_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#684000',
    fontSize: 8,
    lineHeight: 10,
    fontFamily: 'Inter_700Bold',
  },
});
