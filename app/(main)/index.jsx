import React, { useEffect, useState, useRef } from "react";
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
} from "react-native-reanimated";

import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import {
  FoodSlider,
  RestaurantCard,
  Header,
  Search,
} from "../../components/index";

import { router } from "expo-router";
import { DeviceEventEmitter } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../../redux/restaurantSlice";

const categories = [
  { title: "Burger", image: require("../../assets/slider/burger.png") },
  { title: "Donat", image: require("../../assets/slider/donat.png") },
  { title: "Pizza", image: require("../../assets/slider/pizza.png") },
  { title: "Mexican", image: require("../../assets/slider/mexican.png") },
];

export default function HomeScreen() {
  const progress = useDrawerProgress(); // Drawer animation progress (0 - closed, 1 - open)

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [foodCategory, setFoodCategory] = useState("All");

  const card = require("../../assets/resturant.png");
  const dispatch = useDispatch();

  const {
    data: restaurants,
    loading,
    error,
  } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchRestaurants()).then((res) => {
      // Assuming res.payload contains the restaurants array
      const dataWithTags = (res.payload || []).map((r) => {
        // Extract menu item names as tags
        const menuTags = r.menu?.map((item) => item.name) || [];
        const uniqueTags = [...new Set(menuTags)];
        return { ...r, tags: uniqueTags };
      });

      setRestaurantList(dataWithTags);
    });
  }, [dispatch]);

  const [restaurantList, setRestaurantList] = useState(restaurants || []);

  const filteredRestaurants = restaurantList.filter((r) => {
    const matchCategory =
      foodCategory === "All" || r.tags.includes(foodCategory);
    const searchLower = search.toLowerCase();
    const matchSearch =
      r.name.toLowerCase().includes(searchLower) ||
      r.tags.some((tag) => tag.toLowerCase().includes(searchLower));
    return matchCategory && matchSearch;
  });

  const toggleFavorite = (name) => {
    setRestaurantList((prev) =>
      prev.map((r) =>
        r.name === name ? { ...r, isFavorite: !r.isFavorite } : r,
      ),
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 0.75]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, 28]);
    const translateX = interpolate(progress.value, [0, 1], [0, 300]);
    return {
      transform: [
        { scale },
        { translateX }, // this shifts the content
      ],
      borderRadius,
    };
  });

  const scrollRef = useRef(null);

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
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Header />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.container]}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar hidden={true} />

        <Text style={styles.title}>What would you like {"\n"}to order</Text>

        {/* Search Bar */}
        <Search
          search={search}
          setSearch={setSearch}
          onFilterPress={() => console.log("Filter Pressed")}
        />

        <FoodSlider
          data={categories}
          onSelect={(item) => {
            if (!item) {
              //item as null
              setFoodCategory("All"); // deselected
            } else {
              //item passed
              setFoodCategory(item.title); // selected category
            }
          }}
          style={styles.foodSlider}
        />

        <View style={styles.featured}>
          <Text style={styles.featuredResturant}>Featured Restaurants</Text>
          <TouchableOpacity
            style={styles.ViewAll}
            onPress={() => router.push("/(main)/search-results")}
          >
            <Text style={styles.ViewAllText}>View All</Text>
            <Image
              source={require("../../assets/arrowright.png")}
              style={{ height: 7.75, width: 5, marginTop: 2, marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
        {filteredRestaurants.map((item, index) => (
          <RestaurantCard
            key={index}
            name={item.name}
            rating={item.rating}
            reviewCount={item.reviewCount}
            deliveryTime={item.deliveryTime}
            deliveryFee={item.deliveryFee}
            isVerified={item.isVerified}
            imageUrl={{ uri: item.imageUrl }}
            tags={item.tags}
            onPressCard={() =>
              router.push({
                pathname: "/(main)/FoodDetailsScreen",
                params: {
                  restaurant: JSON.stringify(item), // Must stringify object
                },
              })
            }
            isFavorite={item.isFavorite}
            onPressFavorite={() => toggleFavorite(item.name)}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#FCFCFD" },
  container: {
    // flex: 1,
    padding: 25,
    backgroundColor: "#FCFCFD",
  },

  title: {
    fontSize: 30,
    fontWeight: "400",
    fontFamily: "Adamina-Regular",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },

  foodSlider: {
    marginHorizontal: -25,
  },
  filterButton: {
    borderRadius: 15,
    height: 30,
    width: 85,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  featured: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignContent: "center",
    alignItems: "center",
  },
  featuredResturant: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: "100%",
    color: "#323643",
  },
  ViewAll: {
    flexDirection: "row",
  },
  ViewAllText: {
    fontFamily: "Adamina-Regular",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: "100%",
    color: "#F56844",
  },
});
