import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  Dimensions,
  DeviceEventEmitter,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Header } from "../../../components";
import { useRouter } from "expo-router";

// Redux Actions
import { fetchFavorites, toggleFavorite } from "../../../redux/favoriteSlice";
import { fetchRestaurants } from "../../../redux/restaurantSlice";

// Components
import ItemCard from "../../../components/itemCard";
import { RestaurantCard } from "../../../components";
const { width } = Dimensions.get("window");

export default function FavoritesScreen() {
  const [activeTab, setActiveTab] = useState("Food Items");
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const router = useRouter();
  const dispatch = useDispatch();

  //  Get Favorite IDs from the favoriteSlice
  const { items: favoriteIds, loading: favLoading } = useSelector(
    (state) => state.favorites,
  );

  //  Get Full Data from the restaurantSlice
  const allRestaurants = useSelector((state) => state.restaurants.data || []);

  //  Map IDs to Full Objects
  const allFoodItems = allRestaurants.flatMap((res) =>
    (res.menu || []).map((food) => ({
      ...food,
      restaurantName: res.name,
    })),
  );
  const favoriteFoods = favoriteIds
    .filter((fav) => fav.type === "food")
    .map((fav) => allFoodItems.find((food) => food.id === fav.id))
    .filter((item) => item !== undefined);

  const favoriteRestaurants = favoriteIds
    .filter((fav) => fav.type === "restaurant")
    .map((fav) => {
      const restaurant = allRestaurants.find((res) => res.id === fav.id);
      if (!restaurant) return undefined;

      // Extract menu item names as tags (Logic from your HomeScreen)
      const menuTags = restaurant.menu?.map((item) => item.name) || [];
      const uniqueTags = [...new Set(menuTags)].slice(0, 3); // Slice to keep it clean

      return { ...restaurant, tags: uniqueTags };
    })
    .filter((item) => item !== undefined);
  useEffect(() => {
    dispatch(fetchFavorites());
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleTabPress = (tab, index) => {
    setActiveTab(tab);
    Animated.timing(translateX, {
      toValue: index * tabWidth,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const renderFoodItem = ({ item }) => (
    <ItemCard
      item={item}
      isFav={true}
      onToggleFav={() => dispatch(toggleFavorite({ item, type: "food" }))}
    />
  );

  const renderRestaurant = ({ item }) => (
    <RestaurantCard
      name={item.name}
      rating={item.rating || "4.5"}
      reviewCount={item.reviewCount || "100"}
      deliveryTime={item.deliveryTime || "25-30 min"}
      deliveryFee={item.deliveryFee} // 0 will show "Free Delivery" per your component logic
      isVerified={item.isVerified}
      imageUrl={{ uri: item.imageUrl }} // Your card expects a source object
      tags={item.tags || ["Burger", "Pizza"]}
      isFavorite={true}
      onPressFavorite={() =>
        dispatch(toggleFavorite({ item, type: "restaurant" }))
      }
      onPressCard={() => router.push(`/restaurant/${item.id}`)}
    />
  );

  const handleBack = () => {
    // Instead of router.back(), we tell the PagerView to move to index 0 (Home)
    DeviceEventEmitter.emit("CHANGE_TAB", { tab: "home" });
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        showBackButton={true}
        title="Favorites"
        onBackPress={handleBack}
      />

      <View
        style={styles.tabContainer}
        onLayout={(e) => {
          const { width: containerWidth } = e.nativeEvent.layout;
          setTabWidth((containerWidth - 12) / 2);
        }}
      >
        <Animated.View
          style={[
            styles.indicator,
            { width: tabWidth, transform: [{ translateX }] },
          ]}
        />

        {["Food Items", "Restaurants"].map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => handleTabPress(tab, index)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.listContainer}>
        <FlatList
          key={activeTab === "Food Items" ? "food-grid" : "res-list"}
          data={
            activeTab === "Food Items" ? favoriteFoods : favoriteRestaurants
          }
          numColumns={1} // Both lists are now vertical full-width cards
          keyExtractor={(item) => item.id.toString()}
          renderItem={
            activeTab === "Food Items" ? renderFoodItem : renderRestaurant
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, padding: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nothing here yet!</Text>
          }
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FCFCFD" },
  listContainer: { flex: 1, marginTop: 15 },
  tabContainer: {
    flexDirection: "row",
    borderColor: "#F2EAEA",
    borderWidth: 1,
    marginHorizontal: 25,
    marginTop: 30,
    borderRadius: 30,
    padding: 5,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: 5,
    bottom: 5,
    left: 5,
    backgroundColor: "#FE724C",
    borderRadius: 25,
  },
  tab: { flex: 1, paddingVertical: 15, alignItems: "center", zIndex: 1 },
  tabText: { fontFamily: "Adamina-Regular", color: "#9796A1" },
  activeTabText: { color: "#fff" },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#9796A1",
    fontFamily: "Adamina-Regular",
  },
});
