import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
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

const Login = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const router = useRouter();

  const handleCreate = async () => {
    if (!fullName || !email || !password) {
      alert("Please fill all fields");
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

      alert("Account Created!");
    } catch (error) {
      console.log("Signup error:", error);
      alert(error.message);
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
        onChangeText={setEmail}
      />

      <CustomInput
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleCreate} style={styles.button}>
        <Text style={styles.buttonT}>SIGN UP</Text>
      </TouchableOpacity>
      <Text
        style={styles.createAcc}
        onPress={() => router.push("/(auth)/logIn")}
      >
        Already have an account? <Text style={styles.loginText}>Login</Text>
      </Text>
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
    top: 10,
    left: 26,
    fontSize: 36.41,
    fontWeight: "400",
    fontFamily: "Adamina-Regular",
    marginBottom: 20,
    // textAlign: 'center',
    color: "#000000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#a01717ff",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  button: {
    width: 248,
    height: 60,
    backgroundColor: "#ff6f4f",
    borderRadius: 40,
    alignSelf: "center",
    alignItems: "center",
    // marginHorizontal: 25,
    paddingVertical: 18,
    marginTop: 10,
    shadowColor: "#ff6f4f",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonT: {
    color: "#fff",
    fontFamily: "Adamina-Regular",
    fontSize: 20,
    letterSpacing: 1,
  },
  createAcc: {
    textAlign: "center",
    fontFamily: "Adamina-Regular",
    fontSize: 16,
    color: "#555",
    marginVertical: 25,
  },
  loginText: {
    color: "#ff6f4f",
  },
});
