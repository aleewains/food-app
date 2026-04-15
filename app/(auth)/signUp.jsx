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
import { useToast } from "../../context/ToastContext";

const Login = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { showToast } = useToast();

  // const router = useRouter();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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
      setModalMessage("Please fill all fields");
      setModalVisible(true);
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
      setModalMessage(getFirebaseError(error));
      setModalVisible(true);
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
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMessage}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexDirection: "row",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.24)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },

  modalButton: {
    backgroundColor: "#ff6f4f",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
