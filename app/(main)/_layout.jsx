import React, { useState, useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { View, StyleSheet, DeviceEventEmitter } from "react-native";
import { usePathname, router, useNavigation } from "expo-router";
import CustomDrawer from "../../components/CustomDrawer";
import BottomNav from "../../components/BottomNav";

export default function MainLayout() {
  const pathname = usePathname();
  const navigation = useNavigation(); // Get the navigation object
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Listen for drawer state changes
  useEffect(() => {
    // These specific events fire exactly when the drawer starts opening/closing
    const unsubscribeOpen = navigation.addListener("drawerOpen", () => {
      setIsDrawerOpen(true);
    });

    const unsubscribeClose = navigation.addListener("drawerClose", () => {
      setIsDrawerOpen(false);
    });

    return () => {
      unsubscribeOpen();
      unsubscribeClose();
    };
  }, [navigation]);
  // Check for an exact match for the home path
  const isHome = pathname === "/" || pathname === "/index";

  const activeTab = pathname.includes("favorite")
    ? "favorite"
    : pathname.includes("cart")
      ? "cart"
      : pathname.includes("location")
        ? "location"
        : isHome
          ? "home"
          : "";
  return (
    <View style={styles.outerContainer}>
      <View style={styles.drawerWrapper}>
        <Drawer
          drawerContent={(props) => <CustomDrawer {...props} />}
          screenOptions={{
            headerShown: false,
            drawerStyle: { width: "50%", backgroundColor: "#fff" },
            sceneContainerStyle: { backgroundColor: "#fff" },
            overlayColor: "rgba(0,0,0,0.4)", // Dimming helps the visual transition
          }}
        >
          <Drawer.Screen name="index" options={{ title: "Home" }} />
          <Drawer.Screen
            name="screens/favorite"
            options={{ title: "Favorite" }}
          />
          <Drawer.Screen
            name="screens/location"
            options={{ title: "Location" }}
          />
          <Drawer.Screen name="screens/cart" options={{ title: "Cart" }} />
        </Drawer>
      </View>

      {/* Conditionally hide the BottomNav based on state */}
      {!isDrawerOpen && (
        <BottomNav
          activeTab={activeTab}
          onChange={(tab) => {
            const route = tab === "home" ? "/" : `/screens/${tab}`;
            router.push(route);
          }}
          onReselect={(tab) => {
            DeviceEventEmitter.emit("SCROLL_TO_TOP", { tab });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  drawerWrapper: {
    flex: 1,
  },
});
