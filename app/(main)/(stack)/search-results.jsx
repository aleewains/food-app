import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RestaurantGridCard, Search, Header } from "../../../components/index";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import SlideWrapper from "../../../components/slideWrapper";
import { toggleFavorite as toggleFavoriteAction } from "../../../redux/favoriteSlice";
import { useTheme, spacing, radius, typography } from "../../../theme";

export default function SearchResultsScreen() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const reduxRestaurants = useSelector((state) => state.restaurants.data);
  const { items: favoriteItems } = useSelector((state) => state.favorites);
  const router = useRouter();

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
    return dataWithTags.filter(
      (r) =>
        r.name.toLowerCase().includes(searchLower) ||
        r.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    );
  }, [search, reduxRestaurants]);

  const leftColData = filteredRestaurants.filter((_, i) => i % 2 === 0);
  const rightColData = filteredRestaurants.filter((_, i) => i % 2 !== 0);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("mainpager");
  };

  const styles = makeStyles(colors);

  return (
    <SlideWrapper>
      <View style={styles.container}>
        <Header showBackButton={true} onBackPress={handleBack} />

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
                    isFavorite={isFavorite(item.id)}
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
                    isFavorite={isFavorite(item.id)}
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
          </View>
        </ScrollView>
      </View>
    </SlideWrapper>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: spacing.xxl,
      paddingBottom: 40,
    },
    masonryGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.xl,
    },
    column: {
      width: "48%",
      marginBottom: 100,
    },
    resultsHeader: {
      marginBottom: 2,
      marginTop: spacing.md,
      minHeight: 80,
    },
    resultsText: {
      fontSize: typography.size.h2,
      fontFamily: typography.font.semiBold,
      color: colors.textTertiary,
      lineHeight: typography.size.h2,
    },
    countText: {
      fontWeight: "700",
    },
    cardWrapper: {
      marginBottom: spacing.xl,
      width: "100%",
    },
  });
