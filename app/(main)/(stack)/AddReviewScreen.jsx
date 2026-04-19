import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ChevronLeft, Star } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { postReview } from "../../../redux/reviewSlice";
import {
  useTheme,
  spacing,
  radius,
  typography,
  shadows,
  iconSize,
  layout,
} from "../../../theme";
import SlideWrapper from "../../../components/slideWrapper";

const AddReviewScreen = () => {
  const { restaurantId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { colors } = useTheme();

  const [rating, setRating] = useState(4);
  const [reviewText, setReviewText] = useState("");

  const { data: restaurants, reviewLoading } = useSelector(
    (state) => state.restaurants,
  );
  const restaurant = restaurants.find((res) => res.id === restaurantId);

  const handleSubmit = async () => {
    if (!reviewText.trim()) return alert("Please write a comment");
    const resultAction = await dispatch(
      postReview({ restaurantId, reviewData: { rating, comment: reviewText } }),
    );
    if (postReview.fulfilled.match(resultAction)) router.back();
    else alert("Failed to post review: " + resultAction.payload);
  };

  const getRatingText = () => {
    const labels = ["Poor", "Bad", "Good", "Very Good", "Excellent"];
    return labels[rating - 1] || "Select Rating";
  };

  const styles = makeStyles(colors);

  return (
    <SlideWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.surface }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container} bounces={false}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={iconSize.lg} color={colors.textPrimary} />
            </TouchableOpacity>

            {/* Restaurant Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={
                    restaurant?.logoUrl
                      ? { uri: restaurant.logoUrl }
                      : require("../../../assets/profile.png")
                  }
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>
              How was your last order{"\n"} from Pizza Hut {"\n"}?
            </Text>

            {/* Rating Label */}
            <Text style={styles.ratingLabel}>{getRatingText()}</Text>

            {/* Stars */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setRating(index)}
                  activeOpacity={0.6}
                >
                  <Star
                    size={32}
                    color={index <= rating ? colors.star : colors.textDisabled}
                    fill={index <= rating ? colors.star : "none"}
                    strokeWidth={1.5}
                    style={{ marginHorizontal: spacing.xs + 1 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Input */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Write"
                placeholderTextColor={colors.textSubtle}
                multiline
                value={reviewText}
                onChangeText={setReviewText}
                style={styles.textInput}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.submitButton, reviewLoading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={reviewLoading}
            >
              {reviewLoading ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <Text style={styles.submitText}>SUBMIT</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SlideWrapper>
  );
};

export default AddReviewScreen;

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.xxl,
      alignItems: "center",
      paddingTop: spacing.xxl,
    },

    // ── Back Button ───────────────────────────────────────────────────────────
    backButton: {
      alignSelf: "flex-start",
      width: layout.headerIconSize,
      height: layout.headerIconSize,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadowSoft,
      ...shadows.card,
    },

    // ── Logo ──────────────────────────────────────────────────────────────────
    logoContainer: {
      marginTop: 100,
      marginBottom: spacing.huge,
    },
    logoWrapper: {
      width: 80,
      height: 80,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadowSoft,
      shadowOffset: { width: 21, height: 100 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 15,
      overflow: "hidden",
    },
    logo: {
      width: "100%",
      height: "100%",
      resizeMode: "contain",
    },

    // ── Text ──────────────────────────────────────────────────────────────────
    title: {
      fontSize: typography.size.h2 + 1,
      fontFamily: typography.font.regular,
      textAlign: "center",
      color: colors.textTertiary,
      lineHeight: 44,
      marginBottom: spacing.md,
    },
    ratingLabel: {
      fontSize: typography.size.xxl + 2,
      color: colors.primaryAlt,
      fontFamily: typography.font.regular,
      marginBottom: spacing.xl,
    },

    // ── Stars ─────────────────────────────────────────────────────────────────
    starRow: {
      flexDirection: "row",
      marginBottom: 40,
    },

    // ── Input ─────────────────────────────────────────────────────────────────
    inputContainer: {
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: colors.dividerWeak,
      marginBottom: 60,
    },
    textInput: {
      fontSize: typography.size.lg,
      color: colors.textTertiary,
      paddingBottom: spacing.md,
      fontFamily: typography.font.regular,
    },

    // ── Submit ────────────────────────────────────────────────────────────────
    submitButton: {
      marginTop: "auto",
      width: "80%",
      backgroundColor: colors.primaryAlt,
      paddingVertical: spacing.lg + 3,
      borderRadius: radius.full,
      alignItems: "center",
      marginBottom: 50,
      shadowColor: colors.primaryAlt,
      ...shadows.cta,
    },
    submitText: {
      color: colors.textInverse,
      fontSize: typography.size.lg,
      fontFamily: typography.font.regular,
      letterSpacing: 1.2,
    },
  });
