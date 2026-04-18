import React from "react";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/CustomDrawer";

export default function MainLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: "50%" },
        overlayColor: "transparent",
        swipeEnabled: true, // Let the drawer handle edge swipes
        unmountOnBlur: false,
        freezeOnBlur: true,
      }}
    >
      <Drawer.Screen name="(stack)" options={{ title: "Main App" }} />
    </Drawer>
  );
}
