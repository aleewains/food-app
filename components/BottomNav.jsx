import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useTheme } from "../theme";

const TABS = [
  { key: "home", icon: require("../assets/icons/compass.png") },
  { key: "location", icon: require("../assets/icons/location.png") },
  { key: "cart", icon: require("../assets/icons/bag.png") },
  { key: "favorite", icon: require("../assets/icons/heart.png") },
];

// ─── Animated scale wrapper ───────────────────────────────────────────────────
const AnimatedIcon = ({ isActive, children }) => {
  const scale = useSharedValue(isActive ? 1.15 : 1);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.15 : 1, {
      damping: 10,
      stiffness: 150,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
export default function BottomNav({ activeTab, onChange, onReselect }) {
  const { colors, spacing, radius, typography } = useTheme();
  const styles = getStyles(colors, spacing, radius, typography);

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                isActive && onReselect
                  ? onReselect(tab.key)
                  : onChange(tab.key);
              }}
              style={styles.item}
            >
              <AnimatedIcon isActive={isActive}>
                <View style={styles.iconWrapper}>
                  <Image
                    source={tab.icon}
                    style={[
                      styles.icon,
                      {
                        tintColor: isActive ? colors.primary : colors.textLight,
                      },
                    ]}
                  />
                </View>
              </AnimatedIcon>

              {/* Cart badge */}
              {tab.key === "cart" && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const getStyles = (colors, spacing, radius, typography) =>
  StyleSheet.create({
    wrapper: {
      bottom: 0,
    },

    container: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: colors.surface,
      paddingVertical: spacing.md + 2,
      height: 90,
      paddingTop: 3,
      paddingBottom: 30,
    },

    item: {
      width: 50,
      alignItems: "center",
      justifyContent: "center",
    },

    iconWrapper: {
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
    },

    icon: {
      width: 26,
      height: 26,
      resizeMode: "contain",
    },

    badge: {
      position: "absolute",
      top: -6,
      right: -2,
      backgroundColor: colors.star, // yellow badge — same token used for star ratings
      width: 22,
      height: 22,
      borderRadius: radius.circle,
      alignItems: "center",
      justifyContent: "center",
    },

    badgeText: {
      color: colors.textInverse,
      fontSize: typography.size.sm,
      fontWeight: "600",
    },
  });
