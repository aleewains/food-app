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
        freezeOnBlur: true,
      }}
    >
      {/* The Drawer lives inside this Stack entry */}
      <Stack.Screen name="mainpager" />

      {/* These screens are now "above" the drawer, allowing them to slide over it */}
      <Stack.Screen name="search-results" />
      <Stack.Screen name="FoodDetailsScreen" />
    </Stack>
  );
}
