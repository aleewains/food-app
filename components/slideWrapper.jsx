import React, { useEffect, useRef } from "react";
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
import { useNavigation } from "expo-router";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SlideWrapper({
  children,
  disableEnterAnimation = false,
}) {
  const { colors } = useTheme();
  const progress = useDrawerProgress();
  const navigation = useNavigation();
  const translateX = useSharedValue(disableEnterAnimation ? 0 : SCREEN_WIDTH);
  const styles = makeStyles(colors);

  // Slide IN on mount
  useEffect(() => {
    if (!disableEnterAnimation) {
      translateX.value = withTiming(0, { duration: 300 });
    }
  }, [disableEnterAnimation]);

  // Intercept back gesture/button — animate out THEN go back
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Only intercept if our animation hasn't played yet
      if (translateX.value === 0) {
        e.preventDefault(); // block the default instant removal

        // Slide out to right, then allow removal
        translateX.value = withTiming(
          SCREEN_WIDTH,
          { duration: 300 },
          (finished) => {
            if (finished) {
              runOnJS(navigation.dispatch)(e.data.action);
            }
          },
        );
      }
    });

    return unsubscribe;
  }, [navigation]);

  // Drawer scale/translate animation
  const drawerStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 0.75]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, 30]);
    const drawerTranslateX = interpolate(progress.value, [0, 1], [0, 250]);
    return {
      transform: [{ scale }, { translateX: drawerTranslateX }],
      borderRadius,
      overflow: "hidden",
    };
  });

  // Slide in/out animation
  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.main, drawerStyle, slideStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1 },
    main: { flex: 1, backgroundColor: colors.background },
  });
