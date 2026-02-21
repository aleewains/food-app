import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, DeviceEventEmitter } from "react-native";
import PagerView from "react-native-pager-view";
import { useDrawerProgress } from "@react-navigation/drawer";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import BottomNav from "../../components/BottomNav";
// Import your screen components
import HomeScreen from "./index";
import LocationScreen from "./screens/location";
import CartScreen from "./screens/cart";
import FavoriteScreen from "./screens/favorite";

const TAB_ORDER = ["home", "location", "cart", "favorite"];

export default function MainPager() {
  const pagerRef = useRef(null);
  const progress = useDrawerProgress();
  const [activeTab, setActiveTab] = useState("home");

  // This style scales the WHOLE UI (Screens + Bottom Tab)
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 0.75]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, 30]);
    const translateX = interpolate(progress.value, [0, 1], [0, 250]);

    return {
      transform: [{ scale }, { translateX }],
      borderRadius,
      overflow: "hidden", // This ensures BottomNav corners are rounded
    };
  });

  const handleTabChange = (tabName) => {
    const index = TAB_ORDER.indexOf(tabName);
    pagerRef.current?.setPage(index);
    setActiveTab(tabName);
  };

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("CHANGE_TAB", (data) => {
      const index = TAB_ORDER.indexOf(data.tab);
      if (index !== -1) {
        pagerRef.current?.setPage(index); // This slides the screen back to Home
        setActiveTab(data.tab);
      }
    });

    return () => sub.remove();
  }, []);
  return (
    <View style={styles.backgroundContainer}>
      <Animated.View style={[styles.mainWrapper, animatedStyle]}>
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={(e) =>
            setActiveTab(TAB_ORDER[e.nativeEvent.position])
          }
        >
          {/* Key props are required for PagerView children */}
          <View key="home" style={styles.page}>
            <HomeScreen />
          </View>
          <View key="location" style={styles.page}>
            <LocationScreen />
          </View>
          <View key="cart" style={styles.page}>
            <CartScreen />
          </View>
          <View key="favorite" style={styles.page}>
            <FavoriteScreen />
          </View>
        </PagerView>

        <BottomNav
          activeTab={activeTab}
          onChange={handleTabChange}
          onReselect={(tab) =>
            DeviceEventEmitter.emit("SCROLL_TO_TOP", { tab })
          }
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: { flex: 1, backgroundColor: "#efefef" },
  mainWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
  },
  pager: { flex: 1 },
  page: { flex: 1 },
});
