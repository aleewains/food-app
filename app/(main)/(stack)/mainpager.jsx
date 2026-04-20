import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, DeviceEventEmitter } from "react-native";
import PagerView from "react-native-pager-view";
import { useDrawerProgress } from "@react-navigation/drawer";
import { useLocalSearchParams } from "expo-router";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import BottomNav from "../../../components/BottomNav";
import HomeScreen from "../home";
import LocationScreen from "../screens/location";
import CartScreen from "../screens/cart";
import FavoriteScreen from "../screens/favorite";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../../redux/userSlice";
import { fetchAddresses } from "../../../redux/addressSlice";
import { useTheme } from "../../../theme"; // ✅ fixed static import
import { pushScreen, popScreen, clearStack } from "../../../utils/screenStack";
import * as SplashScreen from "expo-splash-screen";

const TAB_ORDER = ["home", "location", "cart", "favorite"];

export default function MainPager() {
  const dispatch = useDispatch();
  const { tab } = useLocalSearchParams();
  const pagerRef = useRef(null);
  const progress = useDrawerProgress();
  const { colors, radius } = useTheme(); //  from hook not static import

  const initialTab = tab && TAB_ORDER.includes(tab) ? tab : "home";
  const [activeTab, setActiveTab] = useState(initialTab);

  //  screenStack translateX for nudge effect
  const translateX = useSharedValue(0); // mainpager starts at 0, no slide-in

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // Register mainpager in screenStack
  useEffect(() => {
    pushScreen(translateX, false);
    return () => popScreen(); // mainpager unmounts on logout — safe to cleanup here
  }, []);

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

  //  combine drawer animation + screenStack nudge in one animatedStyle
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 0.75]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, radius.full]);
    const drawerTranslateX = interpolate(progress.value, [0, 1], [0, 250]);
    // const opacity = translateX.value < 0 ? 0 : 1;

    return {
      transform: [
        { scale },
        { translateX: drawerTranslateX + translateX.value }, //  drawer + nudge combined
      ],
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

const makeStyles = (colors) =>
  StyleSheet.create({
    backgroundContainer: {
      flex: 1,
      backgroundColor: colors.surfaceMuted,
    },
    mainWrapper: {
      flex: 1,
      backgroundColor: colors.background, //  was "#000" / colors.surface — now correct
    },
    pager: { flex: 1, backgroundColor: colors.background },
    page: { flex: 1, backgroundColor: colors.background },
  });
