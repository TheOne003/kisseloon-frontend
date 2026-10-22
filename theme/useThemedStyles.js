import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

/**
 * Build a StyleSheet from theme colors.
 * factory: (colors) => style definitions object
 */
export function useThemedStyles(factory) {
  const { colors } = useTheme();
  return useMemo(() => StyleSheet.create(factory(colors)), [colors, factory]);
}

export function useThemeColors() {
  return useTheme();
}
