import { useEffect, useState, useCallback } from "react";
import { Slot, Redirect } from "expo-router";
import { Provider } from "react-redux";
import { View, ActivityIndicator, StatusBar } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../utils/firebase";
import { store } from "../redux/store";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

const WELCOME_KEY = "has_seen_welcome";

export default function RootLayout() {
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    user: null,
    hasSeenWelcome: false,
  });

  // 1. Optimized Font Loading
  const [fontsLoaded, fontError] = useFonts({
    "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
    "Sora-SemiBold": require("../assets/fonts/Sora-SemiBold.ttf"),
    "Sora-Bold": require("../assets/fonts/Sora-Bold.ttf"),
    "Adamina-Regular": require("../assets/fonts/Adamina-Regular.ttf"),
  });

  // 2. Combined Initialization
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Run Async task (Welcome Check)
        const welcomeVal = await AsyncStorage.getItem(WELCOME_KEY);

        // Setup Auth Listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setAuthStatus({
            loading: false,
            user: user,
            hasSeenWelcome: !!welcomeVal,
          });
          // Hide splash screen once we know where to go
          SplashScreen.hideAsync();
        });

        return unsubscribe;
      } catch (e) {
        console.error(e);
        setAuthStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    initializeApp();
  }, []);

  // 3. Early exit for Fonts
  if (!fontsLoaded && !fontError) return null;

  const { loading, user, hasSeenWelcome } = authStatus;

  // 4. Loading State
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // 5. Routing Logic
  const initialRoute = !hasSeenWelcome
    ? "/welcome"
    : user
      ? "/(main)"
      : "/(auth)/logIn";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar hidden={true} />
        {/* We use Redirect only once based on the initial calculated state */}
        <Redirect href={initialRoute} />
        <Slot />
      </Provider>
    </GestureHandlerRootView>
  );
}
