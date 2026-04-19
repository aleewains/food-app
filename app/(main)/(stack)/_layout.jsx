import { Stack } from "expo-router";
import { screenStack } from "../../../utils/screenStack";
import { useTheme } from "../../../theme";

export default function StackLayout() {
  const { colors } = useTheme();
  if (__DEV__) {
    screenStack?.reset?.();
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        detachPreviousScreen: false,
        freezeOnBlur: false,
        presentation: "transparentModal",
        animation: "none", // SlideWrapper owns ALL animation
        gestureEnabled: false, // we handle back ourselves in SlideWrapper
      }}
    >
      <Stack.Screen
        name="mainpager"
        options={{ animation: "none", presentation: "card" }} // mainpager stays card
      />
      <Stack.Screen name="search-results" />
      <Stack.Screen name="FoodDetailsScreen" />
      <Stack.Screen name="myOrders" />
      <Stack.Screen name="myProfile" />
      <Stack.Screen name="deliveryAddress" />
      <Stack.Screen name="addAddress" />
      <Stack.Screen name="ReviewScreen" />
    </Stack>
  );
}
