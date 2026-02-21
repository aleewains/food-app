import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Heart, Bike, Clock, CheckCircle } from "lucide-react-native";

const RestaurantGridCard = ({
  name,
  rating,
  deliveryTime,
  isFreeDelivery,
  isVerified,
  logoUrl,
  tags = [],
  isFavorite,
  onPressFavorite,
  onPressCard,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPressCard}
      style={styles.card}
    >
      {/* 1. TOP SECTION: Logo Box, Rating & Heart */}
      <View style={styles.topContainer}>
        {/* Logo Box with Shadow */}
        <View style={styles.logoBox}>
          <Image source={{ uri: logoUrl }} style={styles.logoImage} />
          {/* Rating Badge overlapping the Logo Box */}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Heart icon on the top right of the card */}
        <TouchableOpacity
          onPress={onPressFavorite}
          style={styles.favoriteButton}
          // activeOpacity={0.9}
        >
          <Heart
            size={20}
            color={isFavorite ? "#FE724C" : "#D3D1D8"}
            fill={isFavorite ? "#FE724C" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {/* 2. TEXT CONTENT SECTION */}
      <View style={styles.content}>
        <View style={styles.nameContainer}>
          <Text numberOfLines={1} style={styles.nameText}>
            {name}
          </Text>
          {isVerified && (
            <CheckCircle
              size={14}
              color="white"
              fill="#029094"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>

        <View style={styles.infoRow}>
          <Bike size={14} color="#FE724C" />
          <Text style={styles.infoText}>Free delivery</Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={14} color="#FE724C" />
          <Text style={styles.infoText}>{deliveryTime}</Text>
        </View>

        {/* 3. TAGS SECTION */}
        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tagBox}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 18.21,
    width: "100%",
    padding: 18,
    elevation: 5,
    shadowColor: "#E9E9E9",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    // This creates the "floating" shadow for the logo box specifically
    // elevation: 10,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 5 },
    boxShadow: "11.48px 17.22px 22.96px rgba(211, 209, 216, 0.45)",
  },
  logoImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  ratingBadge: {
    position: "absolute",
    top: -5,
    right: -15,
    backgroundColor: "#FFC529",
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    boxShadow: "0 6.84px 13.67px rgba(255, 197, 41, 0.5)",
  },
  ratingText: {
    fontFamily: "Adamina-Regular",
    fontSize: 11,
    color: "white",
    fontWeight: "400",
  },
  favoriteButton: {
    marginTop: 5,
  },
  content: {
    marginTop: 15,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  nameText: {
    fontSize: 18,
    fontFamily: "Adamina-Regular",
    color: "#111719",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#9796A1",
    marginLeft: 8,
    fontFamily: "Adamina-Regular",
  },
  tagContainer: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  tagBox: {
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#8A8E9B",
    fontFamily: "Adamina-Regular",
  },
});

export default RestaurantGridCard;
