import { useEffect, useState } from "react";
import { Slot, Redirect, Stack } from "expo-router";
import { Provider } from "react-redux";
import {
  View,
  ActivityIndicator,
  StatusBar,
  Platform,
  StyleSheet,
} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../utils/firebase";
import { store } from "../redux/store";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

const WELCOME_KEY = "has_seen_welcome";

export default function RootLayout() {
  // -------------------------------
  // 1️ State Hooks
  // -------------------------------
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    user: null,
    hasSeenWelcome: false,
  });

  // 2️ Font Loading Hook
  const [fontsLoaded, fontError] = useFonts({
    "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
    "Sora-SemiBold": require("../assets/fonts/Sora-SemiBold.ttf"),
    "Sora-Bold": require("../assets/fonts/Sora-Bold.ttf"),
    "Adamina-Regular": require("../assets/fonts/Adamina-Regular.ttf"),
  });

  // -------------------------------
  // 3️ Android Transparent Navigation Bar Hook
  // -------------------------------
  useEffect(() => {
    if (Platform.OS === "android") {
      // NavigationBar.setBackgroundColorAsync("transparent");
      NavigationBar.setButtonStyleAsync("dark"); // dark icons, change to "light" if needed
      // NavigationBar.setPositionAsync("absolute");
    }
  }, []);

  // -------------------------------
  // 4️ Auth + Welcome Initialization
  // -------------------------------
  useEffect(() => {
    let unsubscribeAuth;

    const initializeApp = async () => {
      try {
        // Check if user has seen welcome screen
        const welcomeVal = await AsyncStorage.getItem(WELCOME_KEY);

        // Setup Firebase Auth Listener
        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          setAuthStatus({
            loading: false,
            user: user,
            hasSeenWelcome: !!welcomeVal,
          });
          // Hide splash screen once ready
          SplashScreen.hideAsync();
        });
      } catch (e) {
        console.error(e);
        setAuthStatus((prev) => ({ ...prev, loading: false }));
        SplashScreen.hideAsync();
      }
    };

    initializeApp();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // -------------------------------
  // 5️ Early exit for fonts
  // -------------------------------
  if (!fontsLoaded && !fontError) return null;

  const { loading, user, hasSeenWelcome } = authStatus;

  // -------------------------------
  // 6️ Loading State
  // -------------------------------
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // -------------------------------
  // 7️ Determine initial route
  // -------------------------------
  const initialRoute = !hasSeenWelcome
    ? "/welcome"
    : user
      ? "/(main)"
      : "/(auth)/logIn";

  // -------------------------------
  // 8️ Render App
  // -------------------------------
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          {/* StatusBar hidden for immersive experience */}
          <StatusBar hidden={true} />
          {/* Redirect to proper route */}
          <Redirect href={initialRoute} />
          {/* Stack navigator */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="(main)"
              options={{ animation: "none", gestureEnabled: false }}
            />
            <Stack.Screen
              name="(auth)"
              options={{ animation: "slide_from_right" }}
            />

            <Stack.Screen name="welcome" options={{ animation: "none" }} />
          </Stack>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

// -------------------------------
// Styles
// -------------------------------
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
