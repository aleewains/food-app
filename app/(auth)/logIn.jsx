import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { router } from "expo-router";
import CustomInput from "../../components/CustomInput";
import { useTheme } from "../../theme";
import SlideWrapper from "../../components/slideWrapper";
import Ionicons from "@expo/vector-icons/Ionicons";

const Login = () => {
  const { colors, spacing, radius, typography, shadows } = useTheme();
  const styles = getStyles(colors, spacing, radius, typography, shadows);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  // const router = useRouter();

  const handleLogin = async () => {
    if (loading) return; //  prevents double click

    setLoading(true);

    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(main)");
    } catch (error) {
      const messages = {
        "auth/invalid-credential": "Wrong email or password.",
        "auth/invalid-email": "Please enter a valid email.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
        "auth/network-request-failed": "Check your internet connection.",
      };
      setAuthError(messages[error.code] || "Something went wrong. Try again.");
    } finally {
      setLoading(false); //  always reset
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.ellipseC}>
        <Image
          source={require("../../assets/elipse-1.png")}
          style={[styles.ellipse, styles.topLeft]}
        />
        <Image
          source={require("../../assets/elipse-2.png")}
          style={[styles.ellipse, styles.topRight]}
        />
        <Image
          source={require("../../assets/elipse-3.png")}
          style={[styles.ellipse, styles.topRight2]}
        />
      </View>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputsC}>
        <CustomInput
          label="E-mail"
          placeholder="Your email or phone"
          value={email}
          onChangeText={(txt) => {
            setEmail(txt);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          error={errors.email}
        />
        <CustomInput
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={(txt) => {
            setPassword(txt);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          error={errors.password}
        />
        {authError ? (
          <View style={styles.errorBanner}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={colors.textError}
            />
            <Text style={styles.errorBannerText}>{authError}</Text>
          </View>
        ) : null}
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ alignSelf: "center" }}
        onPress={() => router.push("/(auth)/passReset")}
      >
        <Text style={styles.forget}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        style={styles.button}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.buttonT}>Login</Text>
      </TouchableOpacity>
      <Text
        style={styles.createAcc}
        onPress={() => router.push("/(auth)/signUp")}
      >
        Don’t have an account? <Text style={styles.loginText}>Sign Up</Text>
      </Text>
    </View>
  );
};

export default Login;

const getStyles = (colors, spacing, radius, typography, shadows) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },

    ellipseC: {
      flexDirection: "row",
    },

    topRight: {
      left: -49,
    },

    topRight2: {
      left: 107,
    },

    title: {
      marginTop: 100,
      marginLeft: spacing.xl,
      fontSize: typography.size.h1,
      fontFamily: typography.font.regular,
      marginBottom: spacing.xl,
      color: colors.textPrimary,
    },

    button: {
      width: 248,
      height: 60,
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.md,
      shadowColor: colors.primaryShadow,
      ...shadows.cta,
    },

    buttonT: {
      color: colors.textInverse,
      fontFamily: typography.font.regular,
      fontSize: typography.size.xl,
      letterSpacing: 1,
    },

    forget: {
      textAlign: "center",
      fontFamily: typography.font.regular,
      fontSize: typography.size.lg,
      color: colors.primary,
      marginVertical: spacing.sm,
    },

    createAcc: {
      textAlign: "center",
      fontFamily: typography.font.regular,
      fontSize: typography.size.lg,
      color: colors.textSecondary,
      marginVertical: spacing.xl,
    },

    loginText: {
      color: colors.primary,
    },

    errorBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.errorBg,
      borderLeftWidth: 3,
      borderLeftColor: colors.errorBorder,
      borderRadius: radius.sm,
      marginHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.sm,
    },

    errorBannerText: {
      color: colors.textError,
      fontFamily: typography.font.regular,
      fontSize: typography.size.md,
      flexShrink: 1,
    },
  });
