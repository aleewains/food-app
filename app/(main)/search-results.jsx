import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RestaurantGridCard, Search, Header } from "../../components/index";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../../redux/restaurantSlice";

export default function SearchResultsScreen() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const reduxRestaurants = useSelector((state) => state.restaurants.data);

  useEffect(() => {
    dispatch(fetchRestaurants()).then((res) => {
      const dataWithTags = (res.payload || []).map((r) => {
        const menuTags = r.menu?.map((item) => item.name) || [];
        const uniqueTags = [...new Set(menuTags)];
        return { ...r, tags: uniqueTags };
      });

      setRestaurantList(dataWithTags);
    });
  }, [dispatch]);

  const [restaurantList, setRestaurantList] = useState(reduxRestaurants || []);

  const router = useRouter();

  const filteredRestaurants = restaurantList.filter((r) => {
    const searchLower = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(searchLower) ||
      r.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const toggleFavorite = (id) => {
    setRestaurantList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  };

  // 2. Split data into two columns for the Masonry effect
  // We start the right column first so the left has room for the text
  const leftColData = filteredRestaurants.filter((_, i) => i % 2 === 0);
  const rightColData = filteredRestaurants.filter((_, i) => i % 2 !== 0);

  return (
    <View style={styles.container}>
      <Header />

      {/* We use ScrollView for Masonry instead of FlatList */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Search
          search={search}
          setSearch={setSearch}
          onFilterPress={() => {}}
        />

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
                  onPressCard={() =>
                    router.push({
                      pathname: "/(main)/FoodDetailsScreen",
                      params: {
                        restaurant: JSON.stringify(item), // Must stringify object
                      },
                    })
                  }
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
