import { View, StyleSheet, Pressable, Image, Text } from "react-native";
import { useSelector } from "react-redux";

const TABS = [
  { key: "home", icon: require("../assets/icons/compass.png") },
  { key: "location", icon: require("../assets/icons/location.png") },
  { key: "cart", icon: require("../assets/icons/bag.png") },
  { key: "favorite", icon: require("../assets/icons/heart.png") },
];

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
                  onReselect(tab.key); // Trigger scroll to top logic
                } else {
                  onChange(tab.key);
                }
              }}
              style={styles.item}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIcon]}>
                <Image
                  source={tab.icon}
                  style={[
                    styles.icon,
                    { tintColor: isActive ? "#FE724C" : "#C9C9CE" },
                  ]}
                />
              </View>

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
    bottom: 20,
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 0,
    paddingHorizontal: 25,
    paddingVertical: 14,
    height: 74,

    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 10 },
    // shadowOpacity: 0.08,
    // shadowRadius: 20,
    // elevation: 15,
  },

  item: {
    borderRightColor: "#e20e0e",
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    // backgroundColor: "#FE724C",
    width: 42,
    height: 100,
    // borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  activeIcon: {
    // backgroundColor: "#FE724C",
  },

  icon: {
    width: 25,
    height: 28,
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
