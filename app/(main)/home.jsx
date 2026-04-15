import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  Image,
  ScrollView,
} from "react-native";

import { useDrawerProgress } from "@react-navigation/drawer";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import {
  FoodSlider,
  RestaurantCard,
  Header,
  Search,
} from "../../components/index";

import { router, Redirect } from "expo-router";
import { DeviceEventEmitter } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../../redux/restaurantSlice";
import { toggleFavorite, fetchFavorites } from "../../redux/favoriteSlice";

const categories = [
  { title: "Burger", image: require("../../assets/slider/burger.png") },
  { title: "Donat", image: require("../../assets/slider/donat.png") },
  { title: "Pizza", image: require("../../assets/slider/pizza.png") },
  { title: "Mexican", image: require("../../assets/slider/mexican.png") },
];

export default function HomeScreen() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const {
    data: restaurants,
    loading,
    error,
  } = useSelector((state) => state.restaurants);
  const { items: favoriteItems } = useSelector((state) => state.favorites);

  const [search, setSearch] = useState("");
  const [foodCategory, setFoodCategory] = useState("All");
  const showSkeletons = loading || (restaurants.length === 0 && !error);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const filteredRestaurants = useMemo(() => {
    return restaurants
      .map((r) => {
        const menuTags = r.menu?.map((item) => item.name) || [];
        return { ...r, tags: [...new Set(menuTags)] };
      })
      .filter((r) => {
        const matchCategory =
          foodCategory === "All" || r.tags.includes(foodCategory);
        const searchLower = search.toLowerCase();
        const matchSearch =
          r.name.toLowerCase().includes(searchLower) ||
          r.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        return matchCategory && matchSearch;
      });
  }, [restaurants, foodCategory, search]);

  const isRestaurantFavorite = (id) => {
    return favoriteItems.some((fav) => fav.id === id);
  };

  const handleToggleFavorite = (item) => {
    const currentlyFavorite = isRestaurantFavorite(item.id);
    dispatch(
      toggleFavorite({
        item: { ...item, isFavorite: currentlyFavorite },
        type: "restaurant",
      }),
    );
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "SCROLL_TO_TOP",
      (data) => {
        if (data.tab === "home") {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        }
      },
    );
    return () => subscription.remove();
  }, []);

  const RestaurantSkeleton = () => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 800 }),
          withTiming(0.3, { duration: 800 }),
        ),
        -1,
        true,
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    return (
      <Animated.View
        style={[
          styles.skeletonCard,
          { height: 229, marginBottom: 20 },
          animatedStyle,
        ]}
      >
        <View style={styles.skeletonImage} />
        <View style={{ padding: 15 }}>
          <View style={styles.skeletonLine} />
          <View
            style={[styles.skeletonLine, { width: "60%", marginTop: 10 }]}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.wrapper]}>
      <Header />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.container]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What would you like {"\n"}to order</Text>

        <Search
          search={search}
          setSearch={setSearch}
          onFilterPress={() => console.log("Filter Pressed")}
        />

        <FoodSlider
          data={categories}
          onSelect={(item) => {
            if (!item) {
              setFoodCategory("All");
            } else {
              setFoodCategory(item.title);
            }
          }}
          style={styles.foodSlider}
        />

        <View style={styles.featured}>
          <Text style={styles.featuredResturant}>Featured Restaurants</Text>
          <TouchableOpacity
            style={styles.ViewAll}
            onPress={() => router.push("/(main)/(stack)/search-results")}
          >
            <Text style={styles.ViewAllText}>View All</Text>
            <Image
              source={require("../../assets/arrowright.png")}
              style={{ height: 7.75, width: 5, marginTop: 2, marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>

        {showSkeletons ? (
          [1, 2, 3].map((key) => <RestaurantSkeleton key={key} />)
        ) : filteredRestaurants.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No restaurants found</Text>
            <Text style={styles.emptyStateSubText}>
              Try searching for something else
            </Text>
          </View>
        ) : (
          filteredRestaurants.map((item, index) => (
            <RestaurantCard
              key={item.id || index}
              name={item.name}
              // These are now populated immediately from the fetchRestaurants thunk
              rating={item.averageRating || 0}
              reviewCount={item.reviewCount || 0}
              deliveryTime={item.deliveryTime}
              deliveryFee={item.deliveryFee}
              isVerified={item.isVerified}
              imageUrl={{ uri: item.imageUrl }}
              tags={item.tags}
              onPressCard={() =>
                router.push({
                  pathname: "/(main)/(stack)/FoodDetailsScreen",
                  params: {
                    restaurant: JSON.stringify(item),
                  },
                })
              }
              isFavorite={isRestaurantFavorite(item.id)}
              onPressFavorite={() => handleToggleFavorite(item)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#FCFCFD" },
  container: {
    padding: 25,
    backgroundColor: "#FCFCFD",
  },
  title: {
    fontSize: 30,
    fontWeight: "400",
    fontFamily: "Adamina-Regular",
  },
  foodSlider: {
    marginHorizontal: -25,
  },
  featured: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredResturant: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "400",
    color: "#323643",
  },
  ViewAll: {
    flexDirection: "row",
  },
  ViewAllText: {
    fontFamily: "Adamina-Regular",
    fontSize: 13,
    fontWeight: "400",
    color: "#F56844",
  },
  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  skeletonImage: {
    height: 136,
    backgroundColor: "#f2f8fcee",
  },
  skeletonLine: {
    height: 20,
    width: "90%",
    backgroundColor: "#f2f8fcee",
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    marginTop: 60,
  },
  emptyStateText: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "400",
    color: "#323643",
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontFamily: "Adamina-Regular",
    fontSize: 14,
    color: "#9A9A9A",
  },
});
