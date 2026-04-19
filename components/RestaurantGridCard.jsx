import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Heart, Bike, Clock, CheckCircle } from "lucide-react-native";
import { useTheme, spacing, radius, typography, iconSize } from "../theme";

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
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPressCard}
      style={styles.card}
    >
      {/* 1. TOP SECTION: Logo Box, Rating & Heart */}
      <View style={styles.topContainer}>
        <View style={styles.logoBox}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: logoUrl }} style={styles.logoImage} />
          </View>

          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onPressFavorite}
          style={styles.favoriteButton}
        >
          <Heart
            size={iconSize.lg}
            color={isFavorite ? colors.primary : colors.shadowSoft}
            fill={isFavorite ? colors.primary : "transparent"}
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
              size={iconSize.xs}
              color={colors.textInverse}
              fill={colors.success}
              style={{ marginLeft: spacing.xs }}
            />
          )}
        </View>

        <View style={styles.infoRow}>
          <Bike size={iconSize.xs} color={colors.primary} />
          <Text style={styles.infoText}>Free delivery</Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={iconSize.xs} color={colors.primary} />
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

const makeStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      width: "100%",
      padding: spacing.lg + 3,
      elevation: 5,
      shadowColor: colors.shadowCard,
      shadowOpacity: 0.8,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: spacing.md },
    },
    topContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    logoBox: {
      position: "relative",
      width: 80,
      height: 80,
      borderRadius: radius.lg,
      justifyContent: "center",
      alignItems: "center",
    },

    imageWrapper: {
      width: "100%",
      height: "100%",
      borderRadius: radius.lg,
      overflow: "hidden",
    },

    logoImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    ratingBadge: {
      position: "absolute",
      top: -5,
      right: -15,
      backgroundColor: colors.star,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs,
      borderRadius: spacing.md,
      borderWidth: 2,
      borderColor: "transparent",
      boxShadow: `0 6.84px 13.67px rgba(255, 197, 41, 0.5)`,
    },
    ratingText: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xxs + 1,
      color: colors.textInverse,
      fontWeight: "400",
    },
    favoriteButton: {
      marginTop: spacing.xs + 1,
    },
    content: {
      marginTop: spacing.lg,
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.xs + 1,
    },
    nameText: {
      fontSize: typography.size.xl,
      fontFamily: typography.font.regular,
      color: colors.textPrimary,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.xs,
    },
    infoText: {
      fontSize: typography.size.sm,
      color: colors.textSubtle,
      marginLeft: spacing.sm,
      fontFamily: typography.font.regular,
    },
    tagContainer: {
      flexDirection: "row",
      marginTop: spacing.md + 2,
      gap: spacing.sm,
    },
    tagBox: {
      backgroundColor: colors.surfaceAlt,
      paddingHorizontal: spacing.md + 2,
      paddingVertical: spacing.xs + 1,
      borderRadius: radius.xs + 3,
    },
    tagText: {
      fontSize: typography.size.sm,
      color: colors.textMuted,
      fontFamily: typography.font.regular,
    },
  });

export default RestaurantGridCard;
