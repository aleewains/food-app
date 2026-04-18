import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, DeviceEventEmitter } from "react-native";
import PagerView from "react-native-pager-view";
import { useDrawerProgress } from "@react-navigation/drawer";
import { useLocalSearchParams } from "expo-router";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import BottomNav from "../../../components/BottomNav";
import HomeScreen from "../home";
import LocationScreen from "../screens/location";
import CartScreen from "../screens/cart";
import FavoriteScreen from "../screens/favorite";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../../redux/userSlice";
import { fetchAddresses } from "../../../redux/addressSlice";
import { fetchOrders } from "../../../redux/orderSlice";
import { useTheme, spacing, radius } from "../../../theme";
import SlideWrapper from "../../../components/slideWrapper";

const TAB_ORDER = ["home", "location", "cart", "favorite"];

export default function MainPager() {
  const dispatch = useDispatch();
  const { tab } = useLocalSearchParams();
  const pagerRef = useRef(null);
  const progress = useDrawerProgress();
  const { colors } = useTheme();

  const initialTab = tab && TAB_ORDER.includes(tab) ? tab : "home";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchAddresses());
  }, []);

  useEffect(() => {
    if (tab && TAB_ORDER.includes(tab)) {
      const index = TAB_ORDER.indexOf(tab);
      pagerRef.current?.setPage(index);
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("CHANGE_TAB", (data) => {
      const index = TAB_ORDER.indexOf(data.tab);
      if (index !== -1) {
        pagerRef.current?.setPage(index);
        setActiveTab(data.tab);
      }
    });
    return () => sub.remove();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 0.75]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, radius.full]);
    const translateX = interpolate(progress.value, [0, 1], [0, 250]);
    return {
      transform: [{ scale }, { translateX }],
      borderRadius,
      overflow: "hidden",
    };
  });

  const handleTabChange = (tabName) => {
    const index = TAB_ORDER.indexOf(tabName);
    pagerRef.current?.setPage(index);
    setActiveTab(tabName);
  };

  const styles = makeStyles(colors);

  return (
    <View style={styles.backgroundContainer}>
      <Animated.View style={[styles.mainWrapper, animatedStyle]}>
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={TAB_ORDER.indexOf(initialTab)}
          onPageSelected={(e) =>
            setActiveTab(TAB_ORDER[e.nativeEvent.position])
          }
        >
          <View key="home" style={styles.page}>
            <SlideWrapper disableEnterAnimation disableDrawerAnimation>
              <HomeScreen />
            </SlideWrapper>
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

const makeStyles = (colors) =>
  StyleSheet.create({
    backgroundContainer: {
      flex: 1,
      backgroundColor: colors.surfaceAlt,
    },
    mainWrapper: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    pager: { flex: 1 },
    page: { flex: 1 },
  });
