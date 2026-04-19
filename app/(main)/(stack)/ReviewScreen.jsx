import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import ReviewCard from "../../../components/ReviewCard";
import { useDispatch, useSelector } from "react-redux";
import { getReviews } from "../../../redux/restaurantSlice";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SlideWrapper from "../../../components/slideWrapper";
import {
  useTheme,
  spacing,
  radius,
  typography,
  shadows,
  iconSize,
  layout,
} from "../../../theme";

const formatReviewDate = (timestamp) => {
  if (!timestamp) return "Just now";
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

export default function ReviewsScreen() {
  const router = useRouter();
  const { restaurantId } = useLocalSearchParams();
  const { colors } = useTheme();
  const { reviews, reviewLoading } = useSelector((state) => state.restaurants);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      if (restaurantId) dispatch(getReviews(restaurantId));
    }, [restaurantId]),
  );

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("mainpager");
  };

  const styles = makeStyles(colors);

  return (
    <SlideWrapper>
      <SafeAreaProvider style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <ChevronLeft size={iconSize.xl} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Reviews</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        {reviewLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryAlt} />
            <Text style={styles.loadingText}>Fetching reviews...</Text>
          </View>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No reviews yet. Be the first!
              </Text>
            }
            renderItem={({ item }) => (
              <ReviewCard
                id={item.id}
                name={item.userName}
                date={formatReviewDate(item.createdAt || item.date)}
                rating={item.rating}
                comment={item.comment}
                profileImage={item.userImage}
              />
            )}
          />
        )}

        <TouchableOpacity
          style={styles.writeReviewButton}
          onPress={() =>
            router.navigate({
              pathname: "/(main)/(stack)/AddReviewScreen",
              params: { restaurantId },
            })
          }
        >
          <Plus size={iconSize.xxl} color={colors.textInverse} />
          <Text style={styles.writeReviewText}>Write Review</Text>
        </TouchableOpacity>
      </SafeAreaProvider>
    </SlideWrapper>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingBottom: 40,
    },

    // ── Header ───────────────────────────────────────────────────────────────
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: spacing.xxl,
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.xxl,
    },
    headerLeft: { width: layout.headerIconSize, alignItems: "flex-start" },
    headerCenter: { flex: 1, alignItems: "center" },
    headerRight: { width: layout.headerIconSize },
    backBtn: {
      width: layout.headerIconSize,
      height: layout.headerIconSize,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadowSoft,
      ...shadows.card,
    },
    title: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xl,
      fontWeight: "600",
      color: colors.textPrimary,
    },

    // ── States ───────────────────────────────────────────────────────────────
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: spacing.md,
      color: colors.textSubtle,
      fontFamily: typography.font.regular,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 50,
      color: colors.textSubtle,
      fontFamily: typography.font.regular,
    },

    // ── List ─────────────────────────────────────────────────────────────────
    listPadding: {
      padding: spacing.xxl,
      paddingTop: spacing.xs - 2,
      paddingBottom: 120,
    },

    // ── FAB ──────────────────────────────────────────────────────────────────
    writeReviewButton: {
      position: "absolute",
      bottom: 90,
      right: spacing.xl,
      backgroundColor: colors.primaryAlt,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md + 2,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.full,
      shadowColor: colors.primaryAlt,
      ...shadows.cta,
    },
    writeReviewText: {
      color: colors.textInverse,
      fontSize: typography.size.lg,
      fontWeight: "600",
      marginLeft: spacing.sm,
      fontFamily: typography.font.regular,
    },
  });
