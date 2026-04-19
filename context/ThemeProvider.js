// ─────────────────────────────────────────────────────────────────────────────
//  context/ThemeContext.js
//  Wrap your root layout with <ThemeProvider> so every useTheme() call
//  re-renders when the device color scheme changes.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import {
  lightColors,
  darkColors,
  spacing,
  radius,
  typography,
  shadows,
  iconSize,
  layout,
} from "../theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const colors = isDark ? darkColors : lightColors;

  const value = {
    colors,
    spacing,
    radius,
    typography,
    shadows,
    iconSize,
    layout,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Use this instead of importing useTheme from theme/index.js
// It reads from context so it re-renders the whole tree on scheme change
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
