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

const AddReviewScreen = () => {
  const { restaurantId } = useLocalSearchParams(); // Get ID from navigation
  const dispatch = useDispatch();
  const router = useRouter();
  const [rating, setRating] = useState(4); // Default to 4 stars like the image
  const [reviewText, setReviewText] = useState("");

  const { loading } = useSelector((state) => state.review);

  const handleSubmit = async () => {
    if (!reviewText.trim()) return alert("Please write a comment");

    const resultAction = await dispatch(
      postReview({
        restaurantId,
        reviewData: { rating, comment: reviewText },
      }),
    );

    if (postReview.fulfilled.match(resultAction)) {
      router.back(); // Return to previous screen on success
    } else {
      alert("Failed to post review: " + resultAction.payload);
    }
  };

  // Helper to render the star row
  const renderStars = () => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((index) => (
          <TouchableOpacity key={index} onPress={() => setRating(index)}>
            <Star
              size={32}
              color={index <= rating ? "#FFC529" : "#D3D1D8"}
              fill={index <= rating ? "#FFC529" : "none"}
              strokeWidth={1.5}
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getRatingText = () => {
    const labels = ["Poor", "Bad", "Good", "Very Good", "Excellent"];
    return labels[rating - 1] || "Select Rating";
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} bounces={false}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={20} color="#000" />
          </TouchableOpacity>

          {/* Restaurant Logo Card */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../../assets/profile.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            How was your last order{"\n"} from Pizza Hut {"\n"}?
          </Text>

          {/* Dynamic Rating Label */}
          <Text style={styles.ratingLabel}>{getRatingText()}</Text>

          {/* Stars */}
          {renderStars()}

          {/* Write Review Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Write"
              placeholderTextColor="#9796A1"
              multiline
              value={reviewText}
              onChangeText={setReviewText}
              style={styles.textInput}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitText}>SUBMIT</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddReviewScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 25,
    alignItems: "center",
    paddingTop: 25,
  },
  backButton: {
    alignSelf: "flex-start",
    width: 38,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    boxShadow: "5px 10px 20px rgba(211, 209, 216, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginTop: 100,
    marginBottom: 30,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    backgroundColor: "#FFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 21, // Horizontal offset
      height: 100, // Vertical offset
    },
    shadowOpacity: 1,
    shadowRadius: 20, // Blur radius

    // Android
    // Note: Android doesn't support custom shadow colors or offsets natively.
    // Elevation is the only way to get a shadow without a library.
    elevation: 15,
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  title: {
    fontSize: 31,
    fontFamily: "Adamina-Regular",
    textAlign: "center",
    color: "#323643",
    lineHeight: 44,
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 22,
    color: "#F56844", // Orange color from image
    fontFamily: "Adamina-Regular",
    marginBottom: 20,
  },
  starRow: {
    flexDirection: "row",
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    marginBottom: 60,
  },
  textInput: {
    fontSize: 16,
    color: "#323643",
    paddingBottom: 10,
    fontFamily: "Adamina-Regular",
  },
  submitButton: {
    marginTop: "auto",
    width: "80%",
    backgroundColor: "#F56844",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#F56844",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 50,
  },
  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Adamina-Regular",
    letterSpacing: 1.2,
  },
});
