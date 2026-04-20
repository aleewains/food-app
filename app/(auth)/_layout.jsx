import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Define custom fonts
const customFonts = {
  "Sora-Regular": require("../../assets/fonts/Sora-Regular.ttf"),
  "Sora-SemiBold": require("../../assets/fonts/Sora-SemiBold.ttf"),
  "Sora-Bold": require("../../assets/fonts/Sora-Bold.ttf"),
  "Adamina-Regular": require("../../assets/fonts/Adamina-Regular.ttf"),
};

export default function AuthLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts on mount
  const loadFonts = async () => {
    try {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
    } catch (error) {
      console.error("Error loading custom fonts:", error);
      setFontsLoaded(true); // Continue even if fonts fail
    }
  };

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <StatusBar hidden={true} />
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      {/* Hide the status bar (time/battery) */}
      <StatusBar hidden={true} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="logIn" />
        <Stack.Screen name="signUp" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
