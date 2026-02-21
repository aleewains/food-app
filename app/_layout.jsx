import { useEffect, useState } from "react";
import { Slot, Redirect } from "expo-router";
import { Provider } from "react-redux";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../utils/firebase";
import { store } from "../redux/store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import * as Font from "expo-font"; //

//key for AsyncStorage
const welcome = "has_seen_welcome";

const customFonts = {
  // Keys are the font names you will use in your stylesheets
  "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
  "Sora-SemiBold": require("../assets/fonts/Sora-SemiBold.ttf"),
  "Sora-Bold": require("../assets/fonts/Sora-Bold.ttf"),
  "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
  "Adamina-Regular": require("../assets/fonts/Adamina-Regular.ttf"),
};

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false); //  State to track local font loading

  // 1. Function to load local fonts
  const loadFonts = async () => {
    try {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
    } catch (error) {
      console.error("Error loading custom fonts:", error);
      // Optionally, handle error state here
      setFontsLoaded(true); // Proceed even on error to avoid infinite loading
    }
  };

  // 2. Load Fonts and Check Auth State
  useEffect(() => {
    // Start font loading
    loadFonts();

    // Check Auth State (existing logic)
    const subscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return subscribe; // unsub on unmount
  }, []);

  // 3. Check AsyncStorage for Welcome Screen status
  useEffect(() => {
    const checkWelcomeStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(welcome);
        setHasSeenWelcome(!!value);
      } catch (error) {
        console.error("Error loading welcome status:", error);
        setHasSeenWelcome(false);
      } finally {
        // We will rely on the main if condition to check all three states
        setLoading(false);
      }
    };

    checkWelcomeStatus();
  }, []);

  // 4. Combined Loading Check
  // Wait for auth check (loading=false), welcome status (hasSeenWelcome!=null), AND fonts (fontsLoaded=true)
  if (loading || hasSeenWelcome === null || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar hidden={true} />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // --- Conditional Redirect Logic ---
  let initialRoute = null;

  if (!hasSeenWelcome) {
    initialRoute = "/welcome";
  } else if (user) {
    initialRoute = "/(main)";
  } else {
    initialRoute = "/(auth)/logIn";
  }

  // --- Render Logic ---
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar hidden={true} />
        <Redirect href={initialRoute} />
        <Slot />
      </Provider>
    </GestureHandlerRootView>
  );
}
