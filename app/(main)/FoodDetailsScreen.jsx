import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { ChevronLeft, Heart, Star, Plus, Minus } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import FoodDetailModal from "../../components/FoodDetailModal";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart, clearError } from "../../redux/cartSlice";
import { toggleFavorite } from "../../redux/favoriteSlice";
import ItemCard from "../../components/itemCard";

export default function FoodDetailsScreen() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [counts, setCounts] = useState([]);

  const dispatch = useDispatch();
  const { items, error } = useSelector((state) => state.cart);
  const { items: favoriteItems } = useSelector((state) => state.favorites);

  useEffect(() => {
    if (error) {
      Alert.alert(
        "Cart Error",
        error,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => dispatch(clearError()), // just clear the error
          },
          {
            text: "Clear Cart",
            style: "destructive",
            onPress: () => {
              dispatch(clearError()); // clear the error
              dispatch(clearCart()); // clear all items in cart
              setCounts(Array(menuItems.length).fill(0)); // reset counters
              setSelectedItem(null); // reset selected item
              setSelectedAddon(null); // reset selected addon
            },
          },
        ],
        { cancelable: true },
      );
    }
  }, [error]);

  const router = useRouter();
  const { restaurant } = useLocalSearchParams();

  const parsedRestaurant = useMemo(() => {
    return restaurant ? JSON.parse(restaurant) : null;
  }, [restaurant]);

  const menuItems = parsedRestaurant?.menu || [];

  useEffect(() => {
    if (parsedRestaurant?.menu?.length) {
      // Initialize counts per menu item
      setCounts(Array(parsedRestaurant.menu.length).fill(0));
    }
  }, [parsedRestaurant]);

  useEffect(() => {
    if (modalVisible) {
      setSelectedAddon(null); // reset selected addon when modal opens
    }
  }, [modalVisible]);

  const updateCount = (index, delta) => {
    setCounts((prev) => {
      const newCounts = [...prev];
      newCounts[index] = Math.max(0, newCounts[index] + delta);
      return newCounts;
    });
  };

  const handleAddToCart = () => {
    if (!parsedRestaurant) return;

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
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: counts[index],
          addons: addonsArray.map((a) => ({
            id: a.id,
            name: a.name,
            price: a.price,
          })),
          restaurantId: parsedRestaurant.id,
          restaurantName: parsedRestaurant.name,
        };

        // Calculate total
        newItem.total =
          newItem.quantity *
          (newItem.price + newItem.addons.reduce((sum, a) => sum + a.price, 0));

        // Generate cartKey so cartSlice dedup works immediately
        newItem.cartKey =
          newItem.productId +
          "-" +
          (newItem.addons
            .map((a) => a.id)
            .sort()
            .join("-") || "");

        return newItem;
      })
      .filter(Boolean);

    if (itemsToAdd.length === 0) return;

    itemsToAdd.forEach((item) => {
      dispatch(addToCart(item));
    });

    // Reset counters & addon selection
    setCounts(Array(menuItems.length).fill(0));
    setSelectedAddon(null);
    setSelectedItem(null);
  };

  const isRestFav = favoriteItems.some(
    (fav) => fav.id === parsedRestaurant?.id,
  );
  const isFoodFav = (id) => favoriteItems.some((fav) => fav.id === id);
  const handleToggleFavorite = (item, type) => {
    const isFav = favoriteItems.some((fav) => fav.id === item.id);
    dispatch(
      toggleFavorite({
        item: { ...item, isFavorite: isFav },
        type,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER IMAGE */}
        <ImageBackground
          source={{ uri: parsedRestaurant?.imageUrl }}
          style={styles.headerImage}
        >
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.replace("/search-results")}
              style={styles.iconCircle}
            >
              <ChevronLeft size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleToggleFavorite(parsedRestaurant, "restaurant")
              }
              style={[styles.iconCircle, { backgroundColor: "#fff" }]}
            >
              <Heart
                size={20}
                color={isRestFav ? "#FE724C" : "#FE724C"}
                fill={isRestFav ? "#FE724C" : "transparent"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.restaurantName}>{parsedRestaurant?.name}</Text>
            <View style={styles.ratingRow}>
              <Star size={16} color="#FFC529" fill="#FFC529" />
              <Text style={styles.ratingText}>
                {" "}
                {parsedRestaurant?.rating}{" "}
                <Text style={styles.reviewCount}>
                  ({parsedRestaurant?.reviewCount}+)
                </Text>
              </Text>
              <TouchableOpacity>
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
                // If count is 0, we open the modal to pick add-ons
                // This also handles the first "Add to cart" action
                setSelectedItem(item);
                setModalVisible(true);
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* ADD TO CART BUTTON */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <View style={styles.cartIconCircle}>
            <Image
              source={require("../../assets/icons/cart.png")}
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
        styles={styles}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerImage: { height: 188, justifyContent: "space-between", padding: 22 },
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
  },
  headerInfo: {},
  restaurantName: {
    fontSize: 36,
    color: "#fff",
    fontFamily: "Adamina-Regular",
    fontWeight: "400",
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
  foodCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 13px rgba(184, 181, 181, 0.25)",
  },
  foodInfo: { flex: 1, marginRight: 10 },
  foodTitle: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "400",
    color: "#111719",
  },
  foodDesc: {
    fontFamily: "Adamina-Regular",
    fontSize: 11,
    color: "#9796A1",
    // marginVertical: 1,
    lineHeight: 18,
  },
  foodPrice: {
    fontFamily: "Adamina-Regular",
    fontSize: 16,
    color: "#FE724C",
    fontWeight: "400",
  },
  actions: {
    flexDirection: "column",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  counterBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FE724C",
    justifyContent: "center",
    alignItems: "center",
  },
  countText: { fontFamily: "Adamina-Regular", fontSize: 16, fontWeight: "400" },
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
    boxShadow: "0 0px 10px rgba(254, 114, 76, 0.2)",
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
  addToCartText: {
    fontFamily: "Adamina-Regular",
    color: "#fff",
    fontSize: 15,
    fontWeight: "400",
  },
  logo: { width: 16, height: 17 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  closeModalBtn: {
    backgroundColor: "#FE724C",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    alignItems: "center",
  },
  foodCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    // Premium soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  foodHeart: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  foodInfo: { flex: 1, paddingRight: 10 },
  foodTitle: {
    fontFamily: "Adamina-Regular",
    fontSize: 16,
    color: "#111719",
    fontWeight: "600",
  },
  foodDesc: {
    fontFamily: "Adamina-Regular",
    fontSize: 11,
    color: "#9796A1",
    marginBottom: 8,
    lineHeight: 16,
  },
  foodPrice: {
    fontFamily: "Adamina-Regular",
    fontSize: 17,
    color: "#FE724C",
    fontWeight: "600",
  },
  actions: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6", // Light background for counter
    borderRadius: 20,
    padding: 4,
    marginBottom: 8,
  },
  counterBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontFamily: "Adamina-Regular",
    fontSize: 14,
    marginHorizontal: 8,
    color: "#111719",
  },
  addOnButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: "rgba(254, 114, 76, 0.1)", // Subtle orange tint
    borderWidth: 1,
    borderColor: "#FE724C",
  },
  addOnText: {
    fontFamily: "Adamina-Regular",
    color: "#FE724C",
    fontSize: 11,
    fontWeight: "600",
  },
});
