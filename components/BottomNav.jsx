import { View, StyleSheet, Pressable, Image, Text } from "react-native";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const TABS = [
  { key: "home", icon: require("../assets/icons/compass.png") },
  { key: "location", icon: require("../assets/icons/location.png") },
  { key: "cart", icon: require("../assets/icons/bag.png") },
  { key: "favorite", icon: require("../assets/icons/heart.png") },
];

// Animated wrapper for each icon
const AnimatedIcon = ({ isActive, children }) => {
  const scale = useSharedValue(isActive ? 1.2 : 1);

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

export default function BottomNav({ activeTab, onChange, onReselect }) {
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
                if (isActive && onReselect) {
                  onReselect(tab.key);
                } else {
                  onChange(tab.key);
                }
              }}
              style={styles.item}
            >
              <AnimatedIcon isActive={isActive}>
                <View style={[styles.iconWrapper]}>
                  <Image
                    source={tab.icon}
                    style={[
                      styles.icon,
                      { tintColor: isActive ? "#FE724C" : "#C9C9CE" },
                    ]}
                  />
                </View>
              </AnimatedIcon>

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

const styles = StyleSheet.create({
  wrapper: {
    bottom: 30,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around", // better than space-between
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    height: 70,
  },
  item: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    // backgroundColor: "#b21616",
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    // backgroundColor: "#b21616",
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -2,
    backgroundColor: "#FFC529",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
