import { Stack } from "expo-router";

export default function StackLayout() {
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
    </Stack>
  );
}
