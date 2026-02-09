import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RestaurantGridCard, Search, Header } from "../../components/index";
import { useRouter } from "expo-router";

export default function SearchResultsScreen() {
  // 1. Mock Data
  const rawData = Array(10)
    .fill(null)
    .map((_, index) => ({
      id: index.toString(),
      name: "Starbuck",
      rating: 5.0,
      deliveryTime: "10-15 mins",
      imageUrl: require("../../assets/icons/logo.png"),
      isVerified: true,
      tags: ["Burger", "Pizza"],
      isFavorite: false,
    }));

  const router = useRouter();

  const [restaurantList, setRestaurantList] = useState(rawData);

  const toggleFavorite = (id) => {
    setRestaurantList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  };

  // 2. Split data into two columns for the Masonry effect
  // We start the right column first so the left has room for the text
  const leftColData = restaurantList.filter((_, i) => i % 2 === 0);
  const rightColData = restaurantList.filter((_, i) => i % 2 !== 0);

  useEffect(() => {
    // Subscribe to the scroll event
    const subscription = DeviceEventEmitter.addListener(
      "SCROLL_TO_TOP",
      (data) => {
        if (data.tab === "home") {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        }
      },
    );

    // Clean up listener when leaving the page
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      {/* We use ScrollView for Masonry instead of FlatList */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Search />

        <View style={styles.masonryGrid}>
          {/* LEFT COLUMN */}
          <View style={styles.column}>
            {/* Result Text - Stays at the top of the left column */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                Found{"\n"}
                <Text style={styles.countText}>56 results</Text>
              </Text>
            </View>

            {leftColData.map((item) => (
              <View key={item.id} style={styles.cardWrapper}>
                <RestaurantGridCard
                  {...item}
                  onPressFavorite={() => toggleFavorite(item.id)}
                  onPressCard={() => router.push("/FoodDetailsScreen")}
                />
              </View>
            ))}
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.column}>
            {rightColData.map((item) => (
              <View key={item.id} style={styles.cardWrapper}>
                <RestaurantGridCard
                  {...item}
                  onPressFavorite={() => toggleFavorite(item.id)}
                  onPressCard={() => router.push("/FoodDetailsScreen")}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFD",
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  masonryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  column: {
    width: "48%",
    marginBottom: 100,
  },
  resultsHeader: {
    marginBottom: 2,
    marginTop: 10,
    minHeight: 80,
  },
  resultsText: {
    fontSize: 30,
    fontFamily: "Sora",
    color: "#323643",
    lineHeight: "100%",
  },
  countText: {
    fontWeight: "700",
  },
  cardWrapper: {
    marginBottom: 20,
    // This ensures shadows from cards don't overlap awkwardly
    width: "100%",
  },
});
