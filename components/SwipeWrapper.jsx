import React from "react";
import { Dimensions } from "react-native";
import {
  PanGestureHandler,
  gestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  runOnJS,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;

const TABS = ["home", "location", "cart", "favorite"];

export default function SwipeWrapper({ children, activeTab, onChange }) {
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onEnd: (event) => {
      if (event.translationX < -50) {
        // Swipe left → next tab
        const next = getNextTab(activeTab);
        runOnJS(onChange)(next);
      } else if (event.translationX > 50) {
        // Swipe right → previous tab
        const prev = getPrevTab(activeTab);
        runOnJS(onChange)(prev);
      }
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={{ flex: 1 }}>{children}</Animated.View>
    </PanGestureHandler>
  );
}

// Helper functions
const getNextTab = (tab) => {
  const idx = TABS.indexOf(tab);
  return TABS[(idx + 1) % TABS.length];
};
const getPrevTab = (tab) => {
  const idx = TABS.indexOf(tab);
  return TABS[(idx - 1 + TABS.length) % TABS.length];
};
