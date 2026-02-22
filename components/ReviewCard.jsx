import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getReviews } from "../redux/reviewSlice";
import { useDispatch } from "react-redux";

const ReviewCard = ({ id, name, date, rating, comment, profileImage }) => {
  const [imageError, setImageError] = useState(false);

  // Important: If the profileImage prop changes, reset the error state
  // so it tries to load the new URL instead of staying stuck on the fallback.
  useEffect(() => {
    setImageError(false);
  }, [profileImage]);

  const defaultAvatar = require("../assets/profile.png");

  // Determine the source logic clearly
  const imageSource =
    profileImage && !imageError ? { uri: profileImage } : defaultAvatar;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.profileWrapper}>
          <Image
            key={profileImage} // Adding a key forces a fresh render when the URL changes
            source={imageSource}
            style={styles.avatar}
            onError={() => {
              console.log("Image failed to load, falling back...");
              setImageError(true);
            }}
          />

          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{String(rating)}</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{name || "Anonymous"}</Text>
          <Text style={styles.date}>{date || ""}</Text>
        </View>

        <Text style={styles.moreOptions}>{"⋮"}</Text>
      </View>
      <Text style={styles.comment} numberOfLines={4}>
        {comment || ""}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  card: { marginBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  profileWrapper: { position: "relative" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  ratingBadge: {
    width: 18.23,
    height: 18.23,

    position: "absolute",
    bottom: 0,
    right: -5,
    backgroundColor: "#FFC529",
    borderRadius: 8,
    // paddingHorizontal: 2,
    justifyContent: "center",
    borderWidth: 0,
    shadowColor: "#FFC529",
    shadowOffset: {
      width: 0,
      height: 6.84,
    },
    shadowOpacity: 0.5,
    shadowRadius: 13.67,

    // Android Property
    elevation: 8,
  },
  ratingText: {
    fontFamily: "Adamina-Regular",
    fontSize: 10,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
  info: { flex: 1, marginLeft: 15 },
  name: {
    fontFamily: "Adamina-Regular",
    fontSize: 16,
    fontWeight: "600",
    color: "#323643",
  },
  date: {
    fontFamily: "Adamina-Regular",
    fontSize: 12,
    color: "#9796A1",
    marginTop: 2,
  },
  moreOptions: { fontSize: 20, color: "#D3D1D8" },
  comment: {
    fontFamily: "Adamina-Regular",
    fontSize: 14,
    color: "#7E8389",
    lineHeight: 22,
  },
});

export default ReviewCard;
