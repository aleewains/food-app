import React from "react";
import { useDrawerProgress } from "@react-navigation/drawer";
import Animated, {
  interpolate,
  useAnimatedStyle,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { View, StyleSheet } from "react-native";
import { colors, useTheme } from "../theme";

export default function SlideWrapper({ children }) {
  const { colors } = useTheme();
  const progress = useDrawerProgress();

  // The Drawer Scaling Logic
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 0.75]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, 30]);
    const translateX = interpolate(progress.value, [0, 1], [0, 250]);

    return {
      transform: [{ scale }, { translateX }],
      borderRadius,
      overflow: "hidden",
    };
  });

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.main, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surfaceAlt },
    main: { flex: 1, backgroundColor: colors.surface },
  });
