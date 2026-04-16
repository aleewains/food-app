import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Star, Heart, Bike, Clock, CheckCircle } from "lucide-react-native";
import { useTheme } from "../theme";

const RestaurantCard = ({
  name,
  rating,
  reviewCount,
  deliveryTime,
  deliveryFee,
  isVerified,
  imageUrl,
  tags = [],
  isFavorite,
  onPressFavorite,
  onPressCard,
}) => {
  const { colors, spacing, radius, typography } = useTheme();
  const styles = getStyles(colors, spacing, radius, typography);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPressCard}
      style={styles.card}
    >
      {/* ── IMAGE SECTION ─────────────────────────────── */}
      <View style={styles.imageContainer}>
        <Image source={imageUrl} style={styles.image} />

        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{rating}</Text>
          <Star size={13} color={colors.star} fill={colors.star} />
          <Text style={styles.reviewCount}>({reviewCount}+)</Text>
        </View>

        {/* Heart / Favourite button */}
        <TouchableOpacity
          onPress={onPressFavorite}
          style={styles.heartButton}
          activeOpacity={0.9}
        >
          <Heart
            size={20}
            color={colors.primary}
            fill={isFavorite ? colors.primary : colors.transparent}
          />
        </TouchableOpacity>
      </View>

      {/* ── CONTENT ───────────────────────────────────── */}
      <View style={styles.content}>
        {/* Name row */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>
          {isVerified && (
            <CheckCircle
              size={18}
              color={colors.surface}
              fill={colors.success}
              style={styles.verifiedIcon}
            />
          )}
        </View>

        {/* Delivery info */}
        <View style={styles.deliveryRow}>
          {deliveryFee !== undefined && deliveryFee !== null && (
            <View style={styles.deliveryItem}>
              <Bike size={18} color={colors.accentDelivery} />
              <Text style={styles.deliveryText}>
                {deliveryFee === 0 ? "Free Delivery" : String(deliveryFee)}
              </Text>
            </View>
          )}

          <View style={styles.deliveryItem}>
            <Clock size={18} color={colors.accentDelivery} />
            <Text style={styles.deliveryText}>{deliveryTime}</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;

// ─────────────────────────────────────────────────────────────────────────────
const getStyles = (colors, spacing, radius, typography) =>
  StyleSheet.create({
    card: {
      width: "100%",
      // height: 229,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      marginTop: spacing.xs + 1,
      marginBottom: spacing.xl,
      overflow: "hidden",
      alignSelf: "center",
      //  shadowColor is a solid hex — opacity controlled via shadowOpacity
      shadowColor: colors.shadowSoft,
      shadowOpacity: 0.25,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
      paddingBottom: spacing.lg,
    },

    imageContainer: {
      width: "100%",
      height: 136,
    },

    image: {
      width: "100%",
      height: "100%",
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
    },

    // ── Rating badge ───────────────────────────────────
    ratingBadge: {
      position: "absolute",
      top: 12,
      left: 12,
      backgroundColor: colors.surface,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: radius.full,
      flexDirection: "row",
      alignItems: "center",
      elevation: 5,
    },

    ratingText: {
      color: colors.textSubtle,
      fontSize: 15,
      marginRight: spacing.sm - 2,
      fontFamily: typography.font.regular,
      lineHeight: 20, // was "100%" — string crashes on Android
    },

    reviewCount: {
      fontSize: typography.size.sm,
      marginLeft: spacing.sm - 2,
      color: colors.textSubtle,
      fontFamily: typography.font.regular,
    },

    // ── Heart button ───────────────────────────────────
    heartButton: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: radius.circle,
      elevation: 5,
    },

    // ── Content area ───────────────────────────────────
    content: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xs + 1,
    },

    nameRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    name: {
      fontSize: typography.size.h3,
      fontWeight: "400", // was declared twice (700 then 400) — kept intended value
      fontFamily: typography.font.regular,
      color: colors.textPrimary,
    },

    verifiedIcon: {
      marginLeft: spacing.sm - 2,
    },

    // ── Delivery info ──────────────────────────────────
    deliveryRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 0,
    },

    deliveryItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: spacing.sm - 2,
    },

    deliveryText: {
      marginLeft: spacing.sm - 2,
      fontSize: typography.size.sm,
      fontFamily: typography.font.regular,
      color: colors.textSubtle,
    },

    // ── Tags ───────────────────────────────────────────
    tagsRow: {
      flexDirection: "row",
      marginTop: spacing.md,
      gap: spacing.md,
    },

    tag: {
      backgroundColor: colors.surfaceAlt,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: radius.xs,
    },

    tagText: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.sm,
      fontWeight: "400",
      color: colors.textSubtle,
    },
  });
