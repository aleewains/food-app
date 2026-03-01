import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import LogoutButton from "./LogoutButton";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { router, useRouter } from "expo-router";
import userService from "../services/firebaseService";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/userSlice";

export default function CustomDrawer({ navigation }) {
  const { data: userData, loading } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/logIn"); //
    } catch (error) {
      console.log("Logout error:", error.message);
    }
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const orders = require("../assets/drawer/orders.png");
  const profile = require("../assets/drawer/Profile.png");
  const location = require("../assets/drawer/Location.png");
  const wallet = require("../assets/drawer/Wallet.png");
  const setting = require("../assets/drawer/Setting.png");
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={
            userData?.profileImage
              ? { uri: userData.profileImage }
              : require("../assets/profile.png")
          }
          style={styles.profileImage}
        />
        <View style={styles.Bio}>
          <Text style={styles.profileName}>
            {userData?.fullName || "Guest User"}
          </Text>
          <Text style={styles.profileMail}>{auth.currentUser?.email}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.closeDrawer();
          router.push("/(main)/(stack)/myOrders");
        }}
      >
        <View style={styles.drawerItems}>
          <Image source={orders} style={styles.icon} />
          <Text style={styles.itemText}>My Orders</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.closeDrawer();
          router.push("/(main)/(stack)/myProfile");
        }}
      >
        <View style={styles.drawerItems}>
          <Image source={profile} style={styles.icon} />
          <Text style={styles.itemText}>My Profile</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.closeDrawer();
          router.push("/(main)/(stack)/deliveryAddress");
        }}
      >
        <View style={styles.drawerItems}>
          <Image source={location} style={styles.icon} />
          <Text style={styles.itemText}>Delivery Address</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("favorites")}
      >
        <View style={styles.drawerItems}>
          <Image source={wallet} style={styles.icon} />
          <Text style={styles.itemText}>Payment Methods</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate("favorites");
        }}
      >
        <View style={styles.drawerItems}>
          <Image source={setting} style={styles.icon} />
          <Text style={styles.itemText}>Settings</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: "auto", marginBottom: 25 }}
        onPress={handleLogout}
      >
        <LogoutButton onPress={handleLogout} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#efefef",
    padding: 25,
  },
  profileSection: {
    marginBottom: 30,
    marginTop: 36,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    shadowColor: "#FFC529",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
  },
  Bio: {
    marginTop: 10,
    // backgroundColor: "red",
    alignContent: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "Adamina-Regular",
    marginBottom: -5,
  },
  profileMail: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Adamina-Regular",
    lineHeight: "100%",
    color: "#9EA1B1",
  },
  item: {
    paddingVertical: 15,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Adamina-Regular",
    color: "#000000",
    marginLeft: 10,
  },
  drawerItems: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 23,
    height: 23,
  },
});
