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
import { fetchFavorites, toggleFavorite } from "../../../redux/favoriteSlice";
import { fetchRestaurants } from "../../../redux/restaurantSlice";
import ItemCard from "../../../components/itemCard";
import { RestaurantCard } from "../../../components";
import { useTheme, spacing, radius, typography } from "../../../theme";

const { width } = Dimensions.get("window");

export default function FavoritesScreen() {
  const [activeTab, setActiveTab] = useState("Food Items");
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { items: favoriteIds } = useSelector((state) => state.favorites);
  const allRestaurants = useSelector((state) => state.restaurants.data || []);

  const allFoodItems = allRestaurants.flatMap((res) =>
    (res.menu || []).map((food) => ({
      ...food,
      parentRestaurant: res,
      restaurantId: res.id,
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
      const menuTags = restaurant.menu?.map((item) => item.name) || [];
      const uniqueTags = [...new Set(menuTags)].slice(0, 3);
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
      onPressCard={() =>
        router.push({
          pathname: "/(stack)/FoodDetailsScreen",
          params: { restaurant: JSON.stringify(item.parentRestaurant) },
        })
      }
    />
  );

  const renderRestaurant = ({ item }) => (
    <RestaurantCard
      name={item.name}
      rating={item.averageRating || 0}
      reviewCount={item.reviewCount || 0}
      deliveryTime={item.deliveryTime || "25-30 min"}
      deliveryFee={item.deliveryFee}
      isVerified={item.isVerified}
      imageUrl={{ uri: item.imageUrl }}
      tags={item.tags || ["Burger", "Pizza"]}
      isFavorite={true}
      onPressFavorite={() =>
        dispatch(toggleFavorite({ item, type: "restaurant" }))
      }
      onPressCard={() =>
        router.push({
          pathname: "/(stack)/FoodDetailsScreen",
          params: { restaurant: JSON.stringify(item) },
        })
      }
    />
  );

  const handleBack = () => {
    DeviceEventEmitter.emit("CHANGE_TAB", { tab: "home" });
  };

  const styles = makeStyles(colors);

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
          numColumns={1}
          keyExtractor={(item) => item.id.toString()}
          renderItem={
            activeTab === "Food Items" ? renderFoodItem : renderRestaurant
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: spacing.xl,
            padding: spacing.xl,
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nothing here yet!</Text>
          }
        />
      </View>
    </SafeAreaProvider>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContainer: {
      flex: 1,
      marginTop: spacing.lg,
    },
    tabContainer: {
      flexDirection: "row",
      borderColor: colors.divider,
      borderWidth: 1,
      marginHorizontal: spacing.xxl,
      marginTop: spacing.huge,
      borderRadius: radius.full,
      padding: spacing.xs + 1,
      position: "relative",
    },
    indicator: {
      position: "absolute",
      top: 5,
      bottom: 5,
      left: 5,
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.lg,
      alignItems: "center",
      zIndex: 1,
    },
    tabText: {
      fontFamily: typography.font.regular,
      color: colors.textSubtle,
    },
    activeTabText: {
      color: colors.textInverse,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 50,
      color: colors.textSubtle,
      fontFamily: typography.font.regular,
    },
  });
