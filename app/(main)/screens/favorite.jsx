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
  Image,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Header } from "../../../components";
import { useRouter } from "expo-router";

// Redux Actions
import { fetchFavorites, toggleFavorite } from "../../../redux/favoriteSlice";
import { fetchRestaurants } from "../../../redux/restaurantSlice";

import ItemCard from "../../../components/itemCard";

const { width } = Dimensions.get("window");

export default function FavoritesScreen() {
  const [activeTab, setActiveTab] = useState("Food Items");
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const router = useRouter();
  const dispatch = useDispatch();

  // 1. Get Favorite IDs
  const { items: favoriteIds, loading: favLoading } = useSelector(
    (state) => state.favorites,
  );

  // 2. Get Full Data
  const allRestaurants = useSelector((state) => state.restaurants.data || []);

  // Flatten menus to find food items by ID
  const allFoodItems = allRestaurants.flatMap((res) =>
    (res.menu || []).map((food) => ({
      ...food,
      restaurantName: res.name,
    })),
  );

  // 3. Map IDs to Full Objects
  const favoriteFoods = favoriteIds
    .filter((fav) => fav.type === "food")
    .map((fav) => allFoodItems.find((food) => food.id === fav.id))
    .filter((item) => item !== undefined);

  const favoriteRestaurants = favoriteIds
    .filter((fav) => fav.type === "restaurant")
    .map((fav) => allRestaurants.find((res) => res.id === fav.id))
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
      count={0} // Connect to your cart state if needed
      isFav={true}
      onUpdateCount={(delta) => console.log("Update cart", delta)}
      onToggleFav={() => dispatch(toggleFavorite({ item, type: "food" }))}
      onAddOns={() => console.log("Open Addons")}
    />
  );

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity
      style={styles.resCard}
      onPress={() => router.push(`/restaurant/${item.id}`)}
    >
      <View style={styles.resInfo}>
        <View style={styles.resLogoBox}>
          <Image
            source={{ uri: item.logoUrl || item.imageUrl }}
            style={styles.resLogo}
          />
        </View>
        <View style={styles.resTextContent}>
          <Text style={styles.resName}>{item.name}</Text>
          <Text style={styles.resSubText}>Fast Food • 1.2km</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeCircle}
        onPress={() => dispatch(toggleFavorite({ item, type: "restaurant" }))}
      >
        <Text style={{ color: "#FE724C", fontSize: 18 }}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <Header
        showBackButton={true}
        title="Favorites"
        onBackPress={() => router.back()}
      />

      {/* Tab Switcher */}
      <View
        style={styles.tabContainer}
        onLayout={(e) => {
          const { width: containerWidth } = e.nativeEvent.layout;
          setTabWidth((containerWidth - 10) / 2);
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
          key={activeTab} // Using activeTab as key to refresh list layout
          data={
            activeTab === "Food Items" ? favoriteFoods : favoriteRestaurants
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={
            activeTab === "Food Items" ? renderFoodItem : renderRestaurant
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No favorites found in this category.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FCFCFD" },
  listContainer: { flex: 1, paddingHorizontal: 25, marginTop: 25 },
  tabContainer: {
    flexDirection: "row",
    borderColor: "#F2EAEA",
    borderWidth: 1,
    marginHorizontal: 25,
    marginTop: 20,
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
  tabText: { fontFamily: "Adamina-Regular", color: "#9796A1", fontSize: 14 },
  activeTabText: { color: "#fff", fontWeight: "600" },

  // Restaurant Card Styles
  resCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#D3D1D8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  resInfo: { flexDirection: "row", alignItems: "center" },
  resLogoBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  resLogo: { width: "100%", height: "100%", resizeMode: "cover" },
  resTextContent: { marginLeft: 12 },
  resName: {
    fontFamily: "Adamina-Regular",
    fontSize: 16,
    fontWeight: "600",
    color: "#323643",
  },
  resSubText: {
    fontFamily: "Adamina-Regular",
    fontSize: 12,
    color: "#9796A1",
    marginTop: 2,
  },
  removeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(254, 114, 76, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: {
    fontFamily: "Adamina-Regular",
    color: "#9796A1",
    textAlign: "center",
  },
});
