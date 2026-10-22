import { createContext, useContext, useMemo } from 'react';
import { lightColors } from './colors';

const ThemeContext = createContext({
  scheme: 'light',
  isDark: false,
  colors: lightColors,
});

/** App is light-mode only — kept as a provider so screens can read shared colors. */
export function ThemeProvider({ children }) {
  const value = useMemo(
    () => ({
      scheme: 'light',
      isDark: false,
      colors: lightColors,
    }),
    []
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
