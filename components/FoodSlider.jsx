import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { useTheme } from "../theme";

// ─── Single slider item ───────────────────────────────────────────────────────
const FoodSliderItem = ({ item, isActive, onPress }) => {
  const { colors, spacing, radius, typography } = useTheme();
  const styles = getStyles(colors, spacing, radius, typography);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isActive ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false, // required for color interpolation
    }).start();
  }, [isActive]);

  // Animate background: white → primary orange
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surface, colors.primary],
  });

  // Animate text: primary orange → white
  const textColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, colors.textInverse],
  });

  // Subtle scale-up on active
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor,
            transform: [{ scale }],
            //  solid color — no alpha in shadowColor
            shadowColor: isActive ? colors.primary : colors.shadowSoft,
          },
        ]}
      >
        <Image source={item.image} style={styles.image} />
        <Animated.Text style={[styles.title, { color: textColor }]}>
          {item.title}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

// ─── Slider container ─────────────────────────────────────────────────────────
const FoodSlider = ({ data, style, onSelect }) => {
  const { spacing } = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);

  const handleSelect = (item, index) => {
    if (activeIndex === index) {
      // Tapping the active item deselects it → "All"
      setActiveIndex(null);
      onSelect?.(null);
    } else {
      setActiveIndex(index);
      onSelect?.(item);
    }
  };

  return (
    // Pressing outside any item clears selection
    <Pressable
      onPress={() => {
        setActiveIndex(null);
        onSelect?.(null);
      }}
    >
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[style, { overflow: "visible" }]}
        contentContainerStyle={{
          paddingHorizontal: spacing.xxl,
          paddingVertical: spacing.lg,
        }}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <FoodSliderItem
            item={item}
            index={index}
            isActive={index === activeIndex}
            onPress={(e) => {
              e.stopPropagation();
              handleSelect(item, index);
            }}
          />
        )}
      />
    </Pressable>
  );
};

export default FoodSlider;

// ─────────────────────────────────────────────────────────────────────────────
const getStyles = (colors, spacing, radius, typography) =>
  StyleSheet.create({
    card: {
      width: 58,
      height: 98,
      borderRadius: radius.full,
      marginRight: spacing.lg,
      alignItems: "center",
      paddingTop: spacing.xs,
      paddingBottom: spacing.md,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 10,
      shadowColor: "#ca3434",
    },

    image: {
      width: 49,
      height: 49,
      borderRadius: radius.circle,
    },

    title: {
      marginTop: spacing.md + 2,
      fontSize: typography.size.xs,
      fontWeight: "500",
      fontFamily: typography.font.regular,
    },
  });
