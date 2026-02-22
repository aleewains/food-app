import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { ChevronLeft } from "lucide-react-native"; // Use the library we fixed earlier!
import ReviewCard from "../../../components/ReviewCard";
import { Header } from "../../../components";
import { Plus } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { getReviews } from "../../../redux/reviewSlice";

export default function ReviewsScreen() {
  const router = useRouter();
  const { restaurantId } = useLocalSearchParams();
  const { items, loading } = useSelector((state) => state.review);
  // console.log(items);
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      if (restaurantId) {
        dispatch(getReviews(restaurantId));
      }
    }, [restaurantId]),
  );
  const handleBack = () => {
    // Check if we can actually pop the stack
    if (router.canGoBack()) {
      router.back(); // This will slide the detail screen to the RIGHT (correct back animation)
    } else {
      // Only if the app was opened directly on this page, replace it with the home
      router.replace("mainpager");
    }
  };
  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        {/* Column 1: Back Button */}
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <ChevronLeft size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Column 2: Centered Title */}
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Reviews</Text>
        </View>

        {/* Column 3: Empty Placeholder (Important for Balance) */}
        <View style={styles.headerRight} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ReviewCard
            id={item.id}
            name={item.userName} // Now comes from the user collection merge
            date={item.date || "Just now"}
            rating={item.rating}
            comment={item.comment}
            profileImage={item.userImage} // Now comes from the user collection merge
          />
        )}
      />
      <TouchableOpacity
        style={styles.writeReviewButton}
        onPress={() =>
          router.push({
            pathname: "/(main)/(stack)/AddReviewScreen",
            params: { restaurantId: restaurantId }, // Make sure this key matches!
          })
        }
      >
        <Plus size={24} color="#FFF" />
        <Text style={styles.writeReviewText}>Write Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pushes the three sections apart
    marginTop: 25,
    marginBottom: 30,
    paddingHorizontal: 25,
  },
  headerLeft: {
    width: 40,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1, // Takes up all remaining space
    alignItems: "center",
  },
  headerRight: {
    width: 40,
  },
  backBtn: {
    alignSelf: "flex-start",
    width: 38,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    boxShadow: "5px 10px 20px rgba(211, 209, 216, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "600",
    color: "#111719",
  },
  headerTitle: {
    fontFamily: "Adamina-Regular",
    fontSize: 20,
    fontWeight: "600",
  },
  writeReviewButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#F56844", // Your app's orange/coral theme color
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#F56844",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  writeReviewText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: "Sora-SemiBold",
  },
  listPadding: {
    padding: 25,
    paddingBottom: 100, // Important: extra space so reviews don't hide under the button
  },
});
