import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import { ChevronLeft, Heart, Star } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import FoodDetailModal from "../../../components/FoodDetailModal";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart, clearError } from "../../../redux/cartSlice";
import { toggleFavorite } from "../../../redux/favoriteSlice";
import { getReviews, clearReviews } from "../../../redux/restaurantSlice"; // Merged Slice
import ItemCard from "../../../components/itemCard";
import SlideWrapper from "../../../components/slideWrapper";
import { BottomNav } from "../../../components";
import { LinearGradient } from "expo-linear-gradient";

export default function FoodDetailsScreen() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [counts, setCounts] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();

  // 1. SELECTORS: Get live data from the merged restaurant slice
  const { data: allRestaurants } = useSelector((state) => state.restaurants);
  const { error: cartError } = useSelector((state) => state.cart);
  const { items: favoriteItems } = useSelector((state) => state.favorites);

  // Parse local params safely
  const [parsedRestaurant] = React.useState(() =>
    params.restaurant ? JSON.parse(params.restaurant) : null,
  );

  // 2. FIND LIVE DATA: Find this restaurant in the global list to get updated ratings/reviews
  const restaurantData =
    allRestaurants.find((r) => r.id === parsedRestaurant?.id) ||
    parsedRestaurant;
  const menuItems = restaurantData?.menu || [];

  // 3. INITIAL FETCH: Get reviews when screen loads
  useEffect(() => {
    if (restaurantData?.id) {
      dispatch(getReviews(restaurantData.id));
    }
  }, [restaurantData?.id]);

  // Handle Menu Item Counters
  useEffect(() => {
    if (menuItems.length) {
      setCounts(Array(menuItems.length).fill(0));
    }
  }, [menuItems.length]);

  // Modal logic
  useEffect(() => {
    if (modalVisible) {
      setSelectedAddon(null);
    }
  }, [modalVisible]);

  // Handle Cart Errors
  useEffect(() => {
    if (cartError) {
      Alert.alert("Cart Error", cartError, [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => dispatch(clearError()),
        },
        {
          text: "Clear Cart",
          style: "destructive",
          onPress: () => {
            dispatch(clearError());
            dispatch(clearCart());
            setCounts(Array(menuItems.length).fill(0));
          },
        },
      ]);
    }
  }, [cartError]);

  const updateCount = (index, delta) => {
    setCounts((prev) => {
      const newCounts = [...prev];
      newCounts[index] = Math.max(0, newCounts[index] + delta);
      return newCounts;
    });
  };

  const handleAddToCart = () => {
    if (!restaurantData) return;

    const itemsToAdd = menuItems
      .map((item, index) => {
        if (counts[index] === 0) return null;

        const selectedAddonObj =
          selectedItem && selectedAddon !== null
            ? selectedItem.addOns[selectedAddon]
            : null;

        const addonsArray = selectedAddonObj ? [selectedAddonObj] : [];

        const newItem = {
          cartItemId: `${item.id}-${Date.now()}-${Math.random()}`,
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: counts[index],
          addons: addonsArray.map((a) => ({
            id: a.id,
            name: a.name,
            price: a.price,
          })),
          restaurantId: restaurantData.id,
          restaurantName: restaurantData.name,
        };

        // console.log(newItem);

        newItem.total =
          newItem.quantity *
          (newItem.price + newItem.addons.reduce((sum, a) => sum + a.price, 0));
        newItem.cartKey =
          newItem.itemId +
          "-" +
          (newItem.addons
            .map((a) => a.id)
            .sort()
            .join("-") || "");

        return newItem;
      })
      .filter(Boolean);

    if (itemsToAdd.length === 0) return;

    itemsToAdd.forEach((item) => dispatch(addToCart(item)));

    // Reset UI
    setCounts(Array(menuItems.length).fill(0));
    setSelectedAddon(null);
    setSelectedItem(null);
  };

  const isRestFav = favoriteItems.some((fav) => fav.id === restaurantData?.id);
  const isFoodFav = (id) => favoriteItems.some((fav) => fav.id === id);

  const handleToggleFavorite = (item, type) => {
    const isFav = favoriteItems.some((fav) => fav.id === item.id);
    dispatch(toggleFavorite({ item: { ...item, isFavorite: isFav }, type }));
  };

  const handleBack = () => {
    router.canGoBack() ? router.back() : router.replace("mainpager");
  };

  const handleTabChangeFromDetails = (tabName) => {
    router.push({
      pathname: "/(main)/(stack)/mainpager",
      params: { tab: tabName },
    });
  };

  return (
    <SlideWrapper>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* HEADER IMAGE */}
          <ImageBackground
            source={{ uri: restaurantData?.imageUrl }}
            style={styles.headerImage}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.15)", "rgba(0, 0, 0, 0.48)"]}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleBack}
                style={styles.iconCircle}
                activeOpacity={0.8}
              >
                <ChevronLeft size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleToggleFavorite(restaurantData, "restaurant")
                }
                style={styles.iconCircle}
                activeOpacity={0.8}
              >
                <Heart
                  size={20}
                  color={isRestFav ? "#FE724C" : "#FE724C"}
                  fill={isRestFav ? "#FE724C" : "transparent"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.restaurantName}>{restaurantData?.name}</Text>
              <View style={styles.ratingRow}>
                <Star size={16} color="#FFC529" fill="#FFC529" />
                <Text style={styles.ratingText}>
                  {" "}
                  {restaurantData?.averageRating || 0}{" "}
                  <Text style={styles.reviewCount}>
                    ({restaurantData?.reviewCount || 0}+)
                  </Text>
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(main)/(stack)/ReviewScreen",
                      params: { restaurantId: restaurantData?.id },
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.seeReview}> See Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          {/* MENU ITEMS */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <ItemCard
                key={item.id || index}
                item={item}
                count={counts[index]}
                isFav={isFoodFav(item.id)}
                onUpdateCount={(delta) => updateCount(index, delta)}
                onToggleFav={() => handleToggleFavorite(item, "food")}
                onAddOns={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
              />
            ))}
          </View>
        </ScrollView>

        {/* ADD TO CART BUTTON */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={handleAddToCart}
          >
            <View style={styles.cartIconCircle}>
              <Image
                source={require("../../../assets/icons/cart.png")}
                style={styles.logo}
              />
            </View>
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity>
        </View>

        <FoodDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedItem={selectedItem}
          selectedAddon={selectedAddon}
          setSelectedAddon={setSelectedAddon}
        />
      </View>
      <BottomNav activeTab={null} onChange={handleTabChangeFromDetails} />
    </SlideWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FCFCFD" },
  headerImage: { height: 188, justifyContent: "space-between", padding: 22 },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerInfo: {},
  restaurantName: {
    fontSize: 36,
    color: "#fff",
    fontFamily: "Adamina-Regular",
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  ratingText: { fontFamily: "Adamina-Regular", color: "#fff", fontSize: 14 },
  reviewCount: { color: "#eee", fontWeight: "normal" },
  seeReview: {
    fontFamily: "Adamina-Regular",
    color: "#FE724C",
    textDecorationLine: "underline",
    marginLeft: 10,
  },
  menuContainer: { padding: 20 },
  bottomActions: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  addToCartBtn: {
    width: 167,
    height: 53,
    backgroundColor: "#FE724C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#FE724C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cartIconCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginRight: 10,
  },
  addToCartText: { fontFamily: "Adamina-Regular", color: "#fff", fontSize: 15 },
  logo: { width: 16, height: 17 },
});
