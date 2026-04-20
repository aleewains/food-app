import React, { useEffect } from "react";
import { useDrawerProgress } from "@react-navigation/drawer";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { View, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "../theme";
import { useNavigation, useLocalSearchParams } from "expo-router";
import {
  pushScreen,
  popScreen,
  snapScreen,
  clearStack,
} from "../utils/screenStack";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DURATION = 300;
// SlideWrapper.jsx — full update

export default function SlideWrapper({
  children,
  disableEnterAnimation = false,
  disableDrawerAnimation = false,
}) {
  const { colors } = useTheme();
  const progress = useDrawerProgress();
  const navigation = useNavigation();
  const translateX = useSharedValue(disableEnterAnimation ? 0 : SCREEN_WIDTH);
  const styles = makeStyles(colors);
  const { fromDrawer } = useLocalSearchParams();
  const isFromDrawer = fromDrawer === "true";

  useEffect(() => {
    pushScreen(translateX, isFromDrawer);
    if (!disableEnterAnimation && !isFromDrawer) {
      translateX.value = withTiming(0, { duration: DURATION });
    } else {
      translateX.value = 0;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      const type = e.data.action.type;
      if (type === "REPLACE" || type === "RESET") {
        snapScreen();
        return;
      }
      if (translateX.value === 0) {
        e.preventDefault();
        popScreen();
        translateX.value = withTiming(
          SCREEN_WIDTH,
          { duration: DURATION },
          (finished) => {
            if (finished) runOnJS(navigation.dispatch)(e.data.action);
          },
        );
      }
    });
    return unsubscribe;
  }, [navigation]);

  //  drawer bg layer — only visible when drawer is opening
  const drawerBgStyle = useAnimatedStyle(() => {
    if (disableDrawerAnimation || !progress) return { opacity: 0 };
    return {
      opacity: progress.value > 0 ? 1 : 0,
    };
  });

  const drawerStyle = useAnimatedStyle(() => {
    if (disableDrawerAnimation || !progress) return {};
    const scale = interpolate(progress.value, [0, 1], [1, 0.75]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, 30]);
    const drawerTranslateX = interpolate(progress.value, [0, 1], [0, 250]);
    return {
      transform: [{ scale }, { translateX: drawerTranslateX }],
      borderRadius,
      overflow: "hidden",
    };
  });

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* ✅ only visible when drawer opens — covers mainpager bleed, invisible during normal nav */}
      <Animated.View style={[styles.drawerBg, drawerBgStyle]} />
      <Animated.View style={[styles.main, drawerStyle, slideStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    drawerBg: {
      ...StyleSheet.absoluteFillObject, //  sits behind main, fills container
      backgroundColor: colors.surfaceMuted, //  matches drawer panel color
    },
    main: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
