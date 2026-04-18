// ─────────────────────────────────────────────────────────────────────────────
//  theme/index.js
//  Single source of truth for all design tokens.
//  Import what you need:
//    import { colors, spacing, radius, typography, shadows } from '../theme';
//    import { useTheme } from '../theme';   ← for dark-mode-aware values
// ─────────────────────────────────────────────────────────────────────────────

// ─── LIGHT PALETTE ───────────────────────────────────────────────────────────
export const lightColors = {
  // Brand
  primary: "#FE724C", // main orange (buttons, CTAs, active states)
  primaryAlt: "#F56844", // slightly darker orange (View-All links)
  primarySoft: "rgba(254, 114, 76, 0.10)", // tinted bg for addon btn
  primaryShadow: "#FE724C", // shadow color on primary buttons
  accent: "#FF3600", // bold red-orange accent (hero text highlight)
  accentDelivery: "#ff7043", // delivery icon tint

  // Backgrounds
  background: "#FCFCFD", // app/screen background
  surface: "#FFFFFF", // cards, inputs, modals
  surfaceAlt: "#F6F6F6", // tag chips, counter bg, skeleton tint
  surfaceMuted: "#F9F9FB", // disabled input bg

  // Text
  textPrimary: "#111719", // headings, important labels
  textSecondary: "#30384F", // tagline, body text
  textTertiary: "#323643", // section headings (Featured Restaurants)
  textMuted: "#8C9099", // "Deliver to" label
  textSubtle: "#9796A1", // descriptions, review counts
  textDisabled: "#9A9A9A", // empty-state sub text
  textLight: "#D0D0D0", // prompts / fine print
  textPlaceholder: "#C4C4C4", // TextInput placeholder
  textInverse: "#FFFFFF", // text on dark/primary backgrounds
  textError: "#FE724C", // error banner text

  // Input / Border
  inputBorder: "#E6E6E6", // default input border
  inputBorderFocus: "#ff6f4f", // focused input border
  divider: "#F2F2F2", // summary section dividers
  dividerWeak: "#EEEEEE", // promo container border

  // Overlays & Gradients (used in welcome + food details)
  overlayDark: "rgba(25, 27, 47, 1)",
  overlayMid: "rgba(25, 27, 47, 0.6)",
  overlayLight: "rgba(73, 77, 99, 0)",
  overlayCard: "rgba(0, 0, 0, 0.35)",
  overlayBtn: "rgba(255, 255, 255, 0.21)",
  dividerOnDark: "#FFFFFF80", // semi-transparent white line on dark bg

  // Feedback
  star: "#FFC529", // star rating fill
  success: "#10b981", // verified badge fill
  errorBg: "#FFF0ED", // error banner background
  errorBorder: "#FE724C", // error banner left border
  danger: "#FF4B3A", // remove / delete icon

  // Shadows (shadowColor values)
  shadowSoft: "#D3D1D8", // soft card shadow (use with opacity 0.3–0.4)
  shadowCard: "#E9EDF2", // floating card shadow
  shadowProfile: "#FFC5294D", // profile photo shadow

  skeletonBase: "#E5E7EB", // gray-200
  skeletonHighlight: "#F3F4F6", // gray-100
};

// ─── DARK PALETTE ────────────────────────────────────────────────────────────
export const darkColors = {
  // Brand — unchanged (orange stays orange in dark mode)
  primary: "#FE724C",
  primaryAlt: "#F56844",
  primarySoft: "rgba(254, 114, 76, 0.15)",
  primaryShadow: "#FE724C",
  accent: "#FF3600",
  accentDelivery: "#ff7043",

  // Backgrounds
  background: "#0F1117",
  surface: "#1C1E26",
  surfaceAlt: "#272A35",
  surfaceMuted: "#1A1C24",

  // Text
  textPrimary: "#F2F2F2",
  textSecondary: "#B8BDD0",
  textTertiary: "#A0A6BF",
  textMuted: "#7A8099",
  textSubtle: "#7A7A88",
  textDisabled: "#5A5A66",
  textLight: "#4A4A55",
  textPlaceholder: "#555566",
  textInverse: "#FFFFFF",
  textError: "#FE724C",

  // Input / Border
  inputBorder: "#2E3040",
  inputBorderFocus: "#FE724C",
  divider: "#252733",
  dividerWeak: "#2A2C3A",

  // Overlays — same as light (they sit on images)
  overlayDark: "rgba(10, 11, 20, 1)",
  overlayMid: "rgba(10, 11, 20, 0.6)",
  overlayLight: "rgba(30, 32, 50, 0)",
  overlayCard: "rgba(0, 0, 0, 0.50)",
  overlayBtn: "rgba(255, 255, 255, 0.12)",
  dividerOnDark: "#FFFFFF40",

  // Feedback — same meaning, same values
  star: "#FFC529",
  success: "#10b981",
  errorBg: "#2A1510",
  errorBorder: "#FE724C",
  danger: "#FF4B3A",

  // Shadows — lighter on dark backgrounds
  shadowSoft: "#00000060",
  shadowCard: "#00000040",
  shadowProfile: "#FFC52933",

  skeletonBase: "#272727",
  skeletonHighlight: "#3A3A3A",
};

// ─── SPACING ─────────────────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 15,
  xl: 20,
  xxl: 25,
  xxxl: 100,
  huge: 60,
};

// ─── BORDER RADIUS ───────────────────────────────────────────────────────────
export const radius = {
  xs: 5,
  sm: 8,
  md: 12, // back button, input container, icon circle
  lg: 14, // profile photo, sidebar icon
  xl: 20, // cards, restaurant card
  pill: 25, // checkout button, promo container
  full: 30, // fully circular (skip button, counter)
  circle: 100,
};

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
export const typography = {
  font: {
    regular: "Adamina-Regular",
    bold: "Sora-Bold",
    extraBold: "Sora-ExtraBold",
    semiBold: "Sora-SemiBold",
    medium: "Sora-Medium",
    light: "Sora-Light",
    extraLight: "Sora-ExtraLight",
    thin: "Sora-Thin",
  },
  size: {
    xxs: 10,
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    h3: 24,
    h2: 30,
    h1: 36,
    hero: 48,
  },
};

// ─── SHADOWS (shared — use shadowColor from palette per theme) ────────────────
export const shadows = {
  // For buttons & interactive elements
  soft: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  // For floating cards & headers
  floating: {
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 20,
  },
  // For cart items and small cards
  card: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  // For primary CTA buttons (colored shadow)
  cta: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
};

// ─── ICON SIZES ──────────────────────────────────────────────────────────────
export const iconSize = {
  xs: 13,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
  xxl: 24,
};

// ─── LAYOUT ──────────────────────────────────────────────────────────────────
export const layout = {
  screenPadding: 25,
  cardBorderRadius: radius.xl,
  headerIconSize: 38,
  inputHeight: 52,
  buttonHeight: 60,
  bottomNavHeight: 80,
};

// ─────────────────────────────────────────────────────────────────────────────
//  useTheme hook — returns the correct palette based on the current color scheme
//  Usage:
//    import { useTheme } from '../theme';
//    const { colors } = useTheme();
// ─────────────────────────────────────────────────────────────────────────────
import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme(); // "light" | "dark" | null
  const colors = scheme === "dark" ? darkColors : lightColors;
  return {
    colors,
    spacing,
    radius,
    typography,
    shadows,
    iconSize,
    layout,
    isDark: scheme === "dark",
  };
}

// ─── DEFAULT EXPORT (light colors, for files that don't need dark mode) ──────
// Keep backward compatibility with existing `import { colors } from '../theme'`
export const colors = lightColors;
