import React from "react";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/CustomDrawer";

export default function MainLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: "50%", backgroundColor: "#fff" },
        overlayColor: "transparent",
        swipeEdgeWidth: 60, // Only open drawer from the far left edge
      }}
    >
      {/* This renders your MainPager component */}
      <Drawer.Screen name="mainpager" options={{ title: "Main" }} />

      {/* Hide original routes from the Drawer menu list */}
      <Drawer.Screen
        name="index"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="screens/location"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="screens/cart"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="screens/favorite"
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </Drawer>
  );
}
