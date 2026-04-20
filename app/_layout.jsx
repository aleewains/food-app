import { useEffect, useState, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { Provider } from "react-redux";
import {
  View,
  StatusBar,
  Platform,
  StyleSheet,
  useColorScheme,
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
import * as SystemUI from "expo-system-ui";
import { UIProvider } from "../context/UIContext";
import { useTheme } from "../theme";

SplashScreen.preventAutoHideAsync();

const WELCOME_KEY = "has_seen_welcome";

export default function RootLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const colorScheme = useColorScheme();

  // -------------------------------
  // 1️ State Hooks
  // -------------------------------
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    user: null,
    hasSeenWelcome: false,
  });

  // -------------------------------
  // 2️ Font Loading Hook
  // -------------------------------
  const [fontsLoaded, fontError] = useFonts({
    "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
    "Sora-SemiBold": require("../assets/fonts/Sora-SemiBold.ttf"),
    "Sora-Bold": require("../assets/fonts/Sora-Bold.ttf"),
    "Adamina-Regular": require("../assets/fonts/Adamina-Regular.ttf"),
  });

  // -------------------------------
  // 3️ System UI background
  // -------------------------------
  useEffect(() => {
    const bgColor = colorScheme === "dark" ? "#0F1117" : "#FCFCFD";
    SystemUI.setBackgroundColorAsync(bgColor);
  }, [colorScheme]);

  // -------------------------------
  // 4️ Android Navigation Bar
  // -------------------------------
  useEffect(() => {
    if (Platform.OS === "android") {
      const iconStyle = colorScheme === "dark" ? "light" : "dark";
      NavigationBar.setButtonStyleAsync(iconStyle);
    }
  }, [colorScheme]);

  // -------------------------------
  // 5️ Auth + Welcome Initialization
  // ❌ Removed SplashScreen.hideAsync() from here
  // ✅ Each destination screen will call it when fully painted
  // -------------------------------
  useEffect(() => {
    let unsubscribeAuth;

    const initializeApp = async () => {
      try {
        const welcomeVal = await AsyncStorage.getItem(WELCOME_KEY);

        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          setAuthStatus({
            loading: false,
            user: user,
            hasSeenWelcome: !!welcomeVal,
          });
          // ❌ No SplashScreen.hideAsync() here anymore
        });
      } catch (e) {
        console.error(e);
        setAuthStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    initializeApp();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // -------------------------------
  // 6️ Redirect ONCE
  // -------------------------------
  const { loading, user, hasSeenWelcome } = authStatus;

  useEffect(() => {
    if (!loading && (fontsLoaded || fontError) && !hasRedirected.current) {
      hasRedirected.current = true;

      const initialRoute = !hasSeenWelcome
        ? "/welcome"
        : user
          ? "/(main)"
          : "/(auth)/logIn";

      router.replace(initialRoute);
    }
  }, [loading, fontsLoaded, fontError]);

  // -------------------------------
  // 7️ Early exits AFTER all hooks
  // -------------------------------
  if (!fontsLoaded && !fontError) return null;

  // -------------------------------
  // 8️ Render App
  // -------------------------------
  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <Provider store={store}>
        <UIProvider>
          <SafeAreaProvider>
            <StatusBar hidden={true} />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen
                name="(main)"
                options={{ animation: "none", gestureEnabled: false }}
              />
              <Stack.Screen name="(auth)" options={{ animation: "none" }} />
              <Stack.Screen name="welcome" options={{ animation: "none" }} />
            </Stack>
          </SafeAreaProvider>
        </UIProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
