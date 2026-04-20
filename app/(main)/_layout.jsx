import React from "react";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/CustomDrawer";
import { useTheme } from "../../theme";

export default function MainLayout() {
  const { colors } = useTheme();
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "50%",
          backgroundColor: colors.surfaceMuted,
        },
        overlayColor: "transparent",
        swipeEnabled: true, // Let the drawer handle edge swipes
        unmountOnBlur: false,
        freezeOnBlur: false,
        sceneContainerStyle: {
          // backgroundColor: colors.background, //  this fixes the white flash
        },
      }}
    >
      <Drawer.Screen name="(stack)" options={{ title: "Main App" }} />
    </Drawer>
  );
}
