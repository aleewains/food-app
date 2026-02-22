import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RestaurantGridCard, Search, Header } from "../../../components/index";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../../../redux/restaurantSlice";
import SlideWrapper from "../../../components/slideWrapper";
import {
  toggleFavorite as toggleFavoriteAction,
  fetchFavorites,
} from "../../../redux/favoriteSlice";

export default function SearchResultsScreen() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const reduxRestaurants = useSelector((state) => state.restaurants.data);
  const { items: favoriteItems } = useSelector((state) => state.favorites);
  const router = useRouter();

  // useEffect(() => {
  //   dispatch(fetchRestaurants());
  //   dispatch(fetchFavorites());
  // }, [dispatch]);

  const isFavorite = (id) => favoriteItems.some((fav) => fav.id === id);

  const handleToggleFavorite = (item) => {
    const currentlyFav = isFavorite(item.id);
    dispatch(
      toggleFavoriteAction({
        item: { ...item, isFavorite: currentlyFav },
        type: "restaurant",
      }),
    );
  };

  const filteredRestaurants = React.useMemo(() => {
    const searchLower = search.toLowerCase();

    const dataWithTags = reduxRestaurants.map((r) => {
      const menuTags = r.menu?.map((item) => item.name) || [];
      return { ...r, tags: [...new Set(menuTags)] };
    });

    return dataWithTags.filter((r) => {
      return (
        r.name.toLowerCase().includes(searchLower) ||
        r.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });
  }, [search, reduxRestaurants]);

  // 4. Split for Masonry (Calculated fresh on every filter/fav change)
  const leftColData = filteredRestaurants.filter((_, i) => i % 2 === 0);
  const rightColData = filteredRestaurants.filter((_, i) => i % 2 !== 0);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back(); // This will slide LEFT to RIGHT
    } else {
      router.replace("mainpager");
    }
  };

  return (
    <SlideWrapper>
      <View style={styles.container}>
        <Header showBackButton={true} onBackPress={handleBack} />

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
                  <Text style={styles.countText}>
                    {filteredRestaurants.length} results
                  </Text>
                </Text>
              </View>

              {leftColData.map((item) => (
                <View key={item.id} style={styles.cardWrapper}>
                  <RestaurantGridCard
                    {...item}
                    isFavorite={isFavorite(item.id)} // Dynamic check from Redux
                    onPressFavorite={() => handleToggleFavorite(item)}
                    onPressCard={() =>
                      router.push({
                        pathname: "/FoodDetailsScreen",
                        params: {
                          restaurant: JSON.stringify(item),
                          from: "search",
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
                    isFavorite={isFavorite(item.id)} // Dynamic check from Redux
                    onPressFavorite={() => handleToggleFavorite(item)}
                    onPressCard={() =>
                      router.push({
                        pathname: "/FoodDetailsScreen",
                        params: {
                          restaurant: JSON.stringify(item), // Must stringify object
                          from: "search",
                        },
                      })
                    }
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SlideWrapper>
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
