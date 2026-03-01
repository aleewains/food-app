import React from "react";
import { Dimensions } from "react-native";
const TabSwitcher = React.memo(({ activeTab, onTabChange }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const { width } = Dimensions.get("window");
  const TAB_CONTAINER_HORIZONTAL_MARGIN = 25;
  const TAB_PADDING = 6;
  const tabWidth =
    (width - TAB_CONTAINER_HORIZONTAL_MARGIN * 2 - TAB_PADDING * 2) / 2;

  const handlePress = (tab, index) => {
    onTabChange(tab);

    Animated.timing(translateX, {
      toValue: index * tabWidth,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.tabContainer}>
      <Animated.View
        style={[
          styles.indicator,
          { width: tabWidth, transform: [{ translateX }] },
        ]}
      />

      {["Upcoming", "History"].map((tab, index) => (
        <TouchableOpacity
          key={tab}
          style={styles.tab}
          onPress={() => handlePress(tab, index)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});
