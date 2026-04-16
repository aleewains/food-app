import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react-native";
import {
  useTheme,
  spacing,
  radius,
  typography,
  shadows,
  layout,
  iconSize,
} from "../theme";

const Header = ({ showBackButton = false, title = "", onBackPress = null }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: userData } = useSelector((state) => state.user);
  const { addresses } = useSelector((state) => state.address);
  const currentAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const profile = userData?.profileImage
    ? { uri: userData.profileImage }
    : require("../assets/profile.png");

  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(main)/(stack)/mainpager");
    }
  };

  const styles = makeStyles(colors);

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity
          style={styles.sideBar}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <ChevronLeft size={iconSize.lg} color={colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.sideBar}
          onPress={() => navigation.openDrawer()}
        >
          <View>
            <View style={styles.hamburgerLong} />
            <View style={styles.hamburgerShort} />
          </View>
        </TouchableOpacity>
      )}

      {title ? (
        <Text style={styles.pageTitle}>{title}</Text>
      ) : (
        <View style={styles.deliverAddress}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.deliverTo}>Deliver to</Text>
            <Image
              source={require("../assets/arrowDown.png")}
              style={{ height: 5.25, width: 8 }}
            />
          </View>
          <Text style={styles.addressTo}>
            {currentAddress ? currentAddress.street : "Select Address"}
          </Text>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.profilePhoto}
        onPress={() => router.push("/(main)/(stack)/myProfile")}
      >
        <Image source={profile} style={styles.profileImage} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const makeStyles = (colors) =>
  StyleSheet.create({
    header: {
      marginTop: spacing.xxl,
      margin: spacing.xxl,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },

    // ── Sidebar / Back Button ────────────────────────────────────────────────
    sideBar: {
      width: layout.headerIconSize,
      height: layout.headerIconSize,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      shadowColor: colors.shadowCard,
      ...shadows.floating,
      justifyContent: "center",
      alignItems: "center",
    },

    // ── Hamburger Lines ──────────────────────────────────────────────────────
    hamburgerLong: {
      width: 15,
      height: 0,
      backgroundColor: colors.textPrimary,
      borderRadius: radius.full,
      borderWidth: 1.3,
      borderColor: colors.textPrimary,
    },
    hamburgerShort: {
      marginTop: 3,
      width: 10,
      height: 0,
      borderRadius: radius.full,
      borderWidth: 1.3,
      borderColor: colors.textPrimary,
    },

    // ── Address Block ────────────────────────────────────────────────────────
    deliverAddress: {
      alignItems: "center",
    },
    deliverTo: {
      fontFamily: typography.font.regular,
      fontWeight: "400",
      fontSize: typography.size.md,
      color: colors.textMuted,
      marginRight: 2,
    },
    addressTo: {
      fontFamily: typography.font.regular,
      fontWeight: "400",
      fontSize: typography.size.md + 1,
      color: colors.primary,
    },

    // ── Page Title (when title prop is passed) ───────────────────────────────
    pageTitle: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xl,
      fontWeight: "600",
      color: colors.textPrimary,
    },

    // ── Profile Photo ────────────────────────────────────────────────────────
    profilePhoto: {
      width: layout.headerIconSize,
      height: layout.headerIconSize,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      shadowColor: colors.shadowProfile,
      ...shadows.floating,
      justifyContent: "center",
      alignItems: "center",
    },
    profileImage: {
      width: layout.headerIconSize,
      height: layout.headerIconSize,
      borderRadius: radius.lg,
    },
  });
