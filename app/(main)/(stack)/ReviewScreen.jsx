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
import { clearReviews, getReviews } from "../../../redux/restaurantSlice"; // Import from merged slice
import { SafeAreaProvider } from "react-native-safe-area-context";

const formatReviewDate = (timestamp) => {
  if (!timestamp) return "Just now";
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return new Date(timestamp).toLocaleDateString(); // Fallback to MM/DD/YYYY
};

export default function ReviewsScreen() {
  const router = useRouter();
  const { restaurantId } = useLocalSearchParams();

  // 1. Updated Selector: Pulling from state.restaurants using the new keys
  const { reviews, reviewLoading } = useSelector((state) => state.restaurants);

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      if (restaurantId) {
        // dispatch(clearReviews());
        dispatch(getReviews(restaurantId));
      }
    }, [restaurantId]),
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("mainpager");
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <ChevronLeft size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>Reviews</Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      {/* 2. Updated Loading Logic: Using reviewLoading */}
      {reviewLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F56844" />
          <Text style={styles.loadingText}>Fetching reviews...</Text>
        </View>
      ) : (
        <FlatList
          data={reviews} // Using reviews from merged slice
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No reviews yet. Be the first!</Text>
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
          router.push({
            pathname: "/(main)/(stack)/AddReviewScreen",
            params: { restaurantId: restaurantId },
          })
        }
      >
        <Plus size={24} color="#FFF" />
        <Text style={styles.writeReviewText}>Write Review</Text>
      </TouchableOpacity>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 20,
    paddingHorizontal: 25,
  },
  headerLeft: { width: 40, alignItems: "flex-start" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerRight: { width: 40 },
  backBtn: {
    width: 38,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    // Added shadow for consistency across OS
    elevation: 5,
    shadowColor: "#0000002a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "600",
    color: "#111719",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#9796A1",
    fontFamily: "Adamina-Regular",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#9796A1",
    fontFamily: "Adamina-Regular",
  },
  writeReviewButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#F56844",
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
    fontFamily: "Adamina-Regular",
  },
  listPadding: {
    padding: 25,
    paddingTop: 4,
    paddingBottom: 120,
  },
});
