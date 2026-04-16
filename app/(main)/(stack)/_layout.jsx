import { Stack } from "expo-router";
import { BottomNav } from "../../../components";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#f3f3f3" }, // App BG color
        detachPreviousScreen: false, // STOPS the white flash
        presentation: "card",
        freezeOnBlur: false,
      }}
    >
      {/* The Drawer lives inside this Stack entry */}
      <Stack.Screen name="mainpager" options={{ animation: "none" }} />

      {/* These screens are  "above" the drawer, allowing them to slide over it */}
      <Stack.Screen name="search-results" />
      <Stack.Screen name="FoodDetailsScreen" />

      <Stack.Screen name="myOrders" />
      <Stack.Screen name="myProfile" />
      <Stack.Screen name="deliveryAddress" />
      <Stack.Screen name="addAddress" />
    </Stack>
  );
}
