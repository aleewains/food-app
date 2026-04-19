import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import LogoutButton from "./LogoutButton";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/userSlice";
import { useTheme, spacing, radius, typography, shadows } from "../theme";

export default function CustomDrawer({ navigation }) {
  const { data: userData } = useSelector((state) => state.user);
  const { colors } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/logIn");
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

  const styles = makeStyles(colors);

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
        <View style={styles.bio}>
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
          router.navigate({
            pathname: "/(main)/(stack)/myOrders",
            params: { fromDrawer: "true" },
          });
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
          router.navigate({
            pathname: "/(main)/(stack)/myProfile",
            params: { fromDrawer: "true" },
          });
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
          router.navigate({
            pathname: "/(main)/(stack)/deliveryAddress",
            params: { fromDrawer: "true" },
          });
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
        onPress={() => navigation.navigate("favorites")}
      >
        <View style={styles.drawerItems}>
          <Image source={setting} style={styles.icon} />
          <Text style={styles.itemText}>Settings</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: "auto", marginBottom: spacing.xxl }}
        onPress={handleLogout}
      >
        <LogoutButton onPress={handleLogout} />
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.surfaceAlt,
      padding: spacing.xxl,
    },
    profileSection: {
      marginBottom: spacing.huge,
      marginTop: 36,
    },
    profileImage: {
      width: 90,
      height: 90,
      borderRadius: radius.circle,
      marginBottom: spacing.md,
      shadowColor: colors.star,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 15,
      elevation: 15,
    },
    bio: {
      marginTop: spacing.md,
      alignContent: "center",
    },
    profileName: {
      fontSize: typography.size.xxl,
      fontWeight: "400",
      fontFamily: typography.font.regular,
      marginBottom: -5,
      color: colors.textPrimary,
    },
    profileMail: {
      fontSize: typography.size.md,
      fontWeight: "400",
      fontFamily: typography.font.regular,
      color: colors.textSubtle,
    },
    item: {
      paddingVertical: spacing.lg,
    },
    itemText: {
      fontSize: typography.size.lg,
      fontWeight: "400",
      fontFamily: typography.font.regular,
      color: colors.textPrimary,
      marginLeft: spacing.md,
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
