import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text as RNText,
  View as RNView,
  TextInput as RNTextInput,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  FlatList as RNFlatList,
} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from './ThemeContext';

/** Dark ink used on light surfaces → theme text tokens in dark mode. */
const INK_TO_TOKEN = {
  '#0b1c30': 'text',
  '#0a1128': 'text',
  '#0a1c30': 'text',
  '#0f172a': 'text',
  '#1e293b': 'text',
  '#1a1a1a': 'text',
  '#111827': 'text',
  '#020617': 'text',
  '#45464d': 'textSecondary',
  '#475569': 'textSecondary',
  '#334155': 'textSecondary',
  '#52525b': 'textSecondary',
  '#76777d': 'textMuted',
  '#64748b': 'textMuted',
  '#737373': 'textMuted',
  '#6b7280': 'textMuted',
  '#94a3b8': 'textMuted',
  '#9ca3af': 'textMuted',
  '#c6c6cd': 'textFaint',
  '#cbd5e1': 'textFaint',
  '#9a3412': 'textSecondary',
  '#855300': 'textSecondary',
  '#065f46': 'success',
  '#059669': 'success',
};

/** Light page/card surfaces → dark surfaces so remapped text stays readable. */
const SURFACE_TO_TOKEN = {
  '#ffffff': 'surface',
  '#fff': 'surface',
  '#f8f9ff': 'background',
  '#f8f9fa': 'background',
  '#f8f9fd': 'background',
  '#f8fafc': 'background',
  '#f7f8fc': 'background',
  '#f9fafb': 'background',
  '#f1f5f9': 'surfaceMuted',
  '#e5eeff': 'surfaceMuted',
  '#eff4ff': 'surfaceMuted',
  '#dce9ff': 'surfaceSoft',
  '#fff7f2': 'surfaceMuted',
  '#ffece5': 'surfaceMuted',
  '#ffedd5': 'surfaceMuted',
  '#e6f4ea': 'surfaceMuted',
  '#d1fae5': 'surfaceMuted',
  '#ecfdf5': 'surfaceMuted',
  '#f0fdf4': 'surfaceMuted',
  '#cbd5e1': 'surfaceSoft',
  '#c6c6cd': 'surfaceSoft',
  'rgba(248,249,255,0.92)': 'headerBg',
  'rgba(248,249,255,0.85)': 'headerBg',
  'rgba(248,249,255,0.8)': 'headerBg',
  'rgba(248,249,253,0.95)': 'headerBg',
  'rgba(226,232,240,0.7)': 'surfaceMuted',
  'rgba(236,253,245,0.7)': 'surfaceMuted',
};

function norm(color) {
  if (color == null) return '';
  return String(color).trim().toLowerCase();
}

function patchStyle(style, colors, isDark, kind) {
  if (!isDark || style == null) return style;
  const flat = StyleSheet.flatten(style);
  if (!flat || typeof flat !== 'object') return style;

  const patch = {};

  if (kind === 'text' || kind === 'input') {
    const token = INK_TO_TOKEN[norm(flat.color)];
    if (token && colors[token]) patch.color = colors[token];
  }

  if (kind === 'view' || kind === 'input') {
    const bgToken = SURFACE_TO_TOKEN[norm(flat.backgroundColor)];
    if (bgToken && colors[bgToken]) patch.backgroundColor = colors[bgToken];

    const borderNorm = norm(flat.borderColor);
    if (
      borderNorm === '#ffffff' ||
      borderNorm === '#fff' ||
      borderNorm === '#e5eeff' ||
      borderNorm === '#dce9ff' ||
      borderNorm === '#c6c6cd' ||
      borderNorm === 'rgba(198,198,205,0.35)'
    ) {
      patch.borderColor = colors.border;
    }
  }

  return Object.keys(patch).length ? [style, patch] : style;
}

export function Text({ style, ...rest }) {
  const { colors, isDark } = useTheme();
  const themedStyle = useMemo(
    () => patchStyle(style, colors, isDark, 'text'),
    [style, colors, isDark]
  );
  return <RNText style={themedStyle} {...rest} />;
}

export function View({ style, ...rest }) {
  const { colors, isDark } = useTheme();
  const themedStyle = useMemo(
    () => patchStyle(style, colors, isDark, 'view'),
    [style, colors, isDark]
  );
  return <RNView style={themedStyle} {...rest} />;
}

export function Pressable({ style, ...rest }) {
  const { colors, isDark } = useTheme();
  const isFn = typeof style === 'function';
  const themedStyle = useMemo(() => {
    if (isFn) return style;
    return patchStyle(style, colors, isDark, 'view');
  }, [style, colors, isDark, isFn]);

  if (isFn) {
    return (
      <RNPressable
        style={(state) => patchStyle(style(state), colors, isDark, 'view')}
        {...rest}
      />
    );
  }
  return <RNPressable style={themedStyle} {...rest} />;
}

export function TextInput({ style, placeholderTextColor, ...rest }) {
  const { colors, isDark } = useTheme();
  const themedStyle = useMemo(
    () => patchStyle(style, colors, isDark, 'input'),
    [style, colors, isDark]
  );
  let placeholder = placeholderTextColor;
  if (isDark) {
    const mapped = INK_TO_TOKEN[norm(placeholderTextColor)];
    placeholder = mapped
      ? colors[mapped]
      : placeholderTextColor || colors.textMuted;
  }
  return (
    <RNTextInput
      style={themedStyle}
      placeholderTextColor={placeholder}
      {...rest}
    />
  );
}

function useSurfaceStyle(style) {
  const { colors, isDark } = useTheme();
  return useMemo(
    () => patchStyle(style, colors, isDark, 'view'),
    [style, colors, isDark]
  );
}

export function SafeAreaView({ style, ...rest }) {
  const themedStyle = useSurfaceStyle(style);
  return <RNSafeAreaView style={themedStyle} {...rest} />;
}

export const ScrollView = React.forwardRef(function ScrollView(
  { style, contentContainerStyle, ...rest },
  ref
) {
  const themedStyle = useSurfaceStyle(style);
  const themedContent = useSurfaceStyle(contentContainerStyle);
  return (
    <RNScrollView
      ref={ref}
      style={themedStyle}
      contentContainerStyle={themedContent}
      {...rest}
    />
  );
});

export function FlatList({ style, contentContainerStyle, ...rest }) {
  const themedStyle = useSurfaceStyle(style);
  const themedContent = useSurfaceStyle(contentContainerStyle);
  return (
    <RNFlatList
      style={themedStyle}
      contentContainerStyle={themedContent}
      {...rest}
    />
  );
}
