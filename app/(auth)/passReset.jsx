import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "expo-router";
import CustomInput from "../../components/CustomInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import { sendPasswordResetEmail } from "firebase/auth";
import SlideWrapper from "../../components/slideWrapper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
      router.push("/(auth)/logIn"); // redirect to login page
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="black" />
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
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.des}>
        Please enter your email address to {"\n"}request a password reset
      </Text>
      <View style={styles.inputsC}>
        <CustomInput
          // label="E-mail"
          placeholder="Your email or phone"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      {/* <Text style={styles.forget}>Forgot password?</Text> */}

      <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
        <Text style={styles.buttonT}>Send new password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    // top: height > 700 ? 60 : 40,
    // right: 0,
    width: 38,
    height: 38,
    top: 37,
    left: 27,
    backgroundColor: "#FFFFFF",
    // borderWidth: 2,
    // borderColor: "#111719",
    borderRadius: 12,
    // paddingVertical: 5,
    // paddingHorizontal: 15,
    zIndex: 1,
    // shadowColor: "#D3D1D840"
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#D3D1D8",
    shadowOpacity: 0.3,
    shadowRadius: 20, // Blur radius
    elevation: 5,
  },
  ellipseC: {
    // flex: 1,
    flexDirection: "row",
    // top: -301,
  },
  topRight: {
    // top: -1,
    left: -49,
  },
  topRight2: {
    left: 107,
  },
  title: {
    marginTop: 100,
    left: 26,
    fontSize: 36.41,
    fontWeight: "400",
    fontFamily: "Adamina-Regular",
    // marginBottom: 20,
    // textAlign: 'center',
    color: "#000000",
  },
  des: {
    marginTop: 5,
    left: 26,
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Adamina-Regular",
    marginBottom: 25,
    // textAlign: 'center',
    color: "#9796A1",
  },

  button: {
    width: 248,
    height: 60,
    backgroundColor: "#FE724C",
    borderRadius: 40,
    alignSelf: "center",
    alignItems: "center",
    // marginHorizontal: 25,
    paddingVertical: 18,
    marginTop: 30,
    shadowColor: "#FE724C",
    shadowRadius: 10,
  },
  buttonT: {
    color: "#fff",
    fontFamily: "Adamina-Regular",
    fontSize: 20,
    letterSpacing: 1,
  },
  forget: {
    textAlign: "center",
    fontFamily: "Adamina-Regular",
    fontSize: 16,
    fontWeight: "400",
    color: "#FE724C",
    marginVertical: 10,
    lineHeight: 100,
  },
  createAcc: {
    textAlign: "center",
    fontFamily: "Adamina-Regular",
    fontSize: 16,
    color: "#555",
    marginVertical: 30,
  },
  loginText: {
    color: "#ff6f4f",
  },
});
