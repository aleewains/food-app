import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  Alert,
} from "react-native";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import { router, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import CustomInput from "../../components/CustomInput";
import { useUI } from "../../context/UIContext";
import { useTheme } from "../../theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import SlideWrapper from "../../components/slideWrapper";

const Login = () => {
  const { colors, spacing, radius, typography, shadows } = useTheme();
  const styles = getStyles(colors, spacing, radius, typography, shadows);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { showToast, showError } = useUI();

  // const router = useRouter();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getFirebaseError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "This email is already registered";
      case "auth/invalid-email":
        return "Invalid email format";
      case "auth/weak-password":
        return "Password should be at least 6 characters";
      default:
        return "Something went wrong";
    }
  };

  const handleCreate = async () => {
    let newErrors = {};

    if (!fullName || !email || !password) {
      showError("Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); //  only shows after button click
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (!user) throw new Error("User not created");

      await updateProfile(user, { displayName: fullName });

      showToast("Account Created!", "success");
    } catch (error) {
      console.log("Signup error:", error);
      showError(getFirebaseError(error));
    }
  };

  return (
    <SlideWrapper disableDrawerAnimation>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
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

        <Text style={styles.title}>Sign{"\n"}Up</Text>
        <CustomInput
          label="Full name"
          placeholder="Enter Your Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <CustomInput
          label="E-mail"
          placeholder="Enter Your E-mail"
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
        <TouchableOpacity
          onPress={handleCreate}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonT}>SIGN UP</Text>
        </TouchableOpacity>
        <Text
          style={styles.createAcc}
          onPress={() => router.push("/(auth)/logIn")}
        >
          Already have an account? <Text style={styles.loginText}>Login</Text>
        </Text>
      </View>
    </SlideWrapper>
  );
};

export default Login;

const getStyles = (colors, spacing, radius, typography, shadows, cta) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      width: "100%",
      height: "100%",
    },

    backButton: {
      position: "absolute",
      width: 38,
      height: 38,
      top: 37,
      left: 27,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      zIndex: 1,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadowSoft,
      ...shadows.card,
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
      marginTop: spacing.xxxl,
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
  });
