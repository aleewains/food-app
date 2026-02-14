import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
} from "react-native";
import { auth, db } from "../../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { Camera, ChevronLeft } from "lucide-react-native";
import storageService from "../../services/supabase";
import CustomInput from "../../components/CustomInput";
import { CountryPicker } from "react-native-country-codes-picker";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateUserProfile,
  setUserData,
} from "../../redux/userSlice";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const dispatch = useDispatch();
  const { data: userData, loading } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(userData || {});
  const [countryCode, setCountryCode] = useState(
    userData?.countryCode || "+92",
  );

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      setLocalData(userData);
      setCountryCode(userData.countryCode || "+92");
    }
  }, [userData]);

  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused
      return () => {
        // Screen is unfocused
        setIsEditing(false);
      };
    }, []),
  );

  const handleSaveProfile = async () => {
    const updatedProfile = { ...localData, countryCode };
    dispatch(updateUserProfile(updatedProfile));
    setIsEditing(false);
  };

  const handleImageUpload = async (uri) => {
    setUploading(true);
    try {
      const publicUrl = await storageService.uploadUserImage(uri);
      if (publicUrl) {
        await userService.updateProfileImage(publicUrl);
        setUserData((prev) => ({ ...prev, profileImage: publicUrl }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    // Request permissions (Good practice for modern Android/iOS)
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Allow access to your photos to change profile picture.",
      );
      return;
    }

    // UPDATED LOGIC
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#FE724C" />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // adjust if you have headers
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        h
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainWrapper}>
          <View style={styles.orangeBg} pointerEvents="none">
            <Image
              source={require("../../assets/profileBg.png")}
              style={styles.bgImage}
            />
          </View>

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconCircle}
            >
              <ChevronLeft size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Profile Content */}
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  userData?.profileImage
                    ? { uri: userData.profileImage }
                    : require("../../assets/profile.png")
                }
                style={styles.profileImage}
              />
              {isEditing && (
                <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
                  {uploading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Camera size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.userName}>
              {userData?.fullName || "Guest User"}
            </Text>

            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editProfileText}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Text>
            </TouchableOpacity>

            <View style={styles.infoSection}>
              <CustomInput
                label="Full Name"
                value={localData.fullName || ""}
                editable={isEditing}
                onChangeText={(t) =>
                  setLocalData((prev) => ({ ...prev, fullName: t }))
                }
              />

              <CustomInput
                label="Email"
                value={auth.currentUser?.email}
                editable={false}
              />

              <CustomInput
                label="Phone"
                value={localData.phone || ""}
                editable={isEditing}
                countryCode={countryCode}
                onCountryPress={() => setShowPicker(true)}
                onChangeText={(t) =>
                  setLocalData((prev) => ({ ...prev, phone: t }))
                }
                keyboardType="phone-pad"
              />

              <CustomInput
                label="Address"
                value={localData.address || ""}
                editable={isEditing}
                onChangeText={(t) =>
                  setLocalData((prev) => ({ ...prev, address: t }))
                }
              />

              {isEditing && (
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <CountryPicker
            show={showPicker}
            pickerButtonOnPress={(item) => {
              setCountryCode(item.dial_code);
              setShowPicker(false);
            }}
            style={{
              modal: { height: 500 },
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#984545",
  },
  mainWrapper: {
    // backgroundColor: "#984545",
    flex: 1,
    // height: "100%",
    position: "relative",
  },
  orangeBg: {
    position: "absolute",
    top: 0,
    width: width,
    height: 285,
    zIndex: 0,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  header: {
    marginTop: 25,
    paddingHorizontal: 25,
    justifyContent: "center",
  },
  iconCircle: {
    width: 38,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    shadowColor: "#E9EDF2",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.9,
    shadowRadius: 30, // blur = 30
    elevation: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    marginTop: 20, // Adjusted to make profile image sit nicely on the BG
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageContainer: { position: "relative" },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFC529",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  editProfileText: {
    color: "#FE724C",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "600",
  },
  infoSection: { width: "100%", marginTop: 25 },
  saveBtn: {
    backgroundColor: "#FE724C",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 25,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
