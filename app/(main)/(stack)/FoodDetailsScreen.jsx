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
import { getReviews } from "../../../redux/restaurantSlice";
import ItemCard from "../../../components/itemCard";
import SlideWrapper from "../../../components/slideWrapper";
import { BottomNav } from "../../../components";
import { LinearGradient } from "expo-linear-gradient";
import {
  useTheme,
  spacing,
  radius,
  typography,
  shadows,
  iconSize,
  layout,
} from "../../../theme";

export default function FoodDetailsScreen() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [counts, setCounts] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();

  const { data: allRestaurants } = useSelector((state) => state.restaurants);
  const { error: cartError } = useSelector((state) => state.cart);
  const { items: favoriteItems } = useSelector((state) => state.favorites);

  const [parsedRestaurant] = React.useState(() =>
    params.restaurant ? JSON.parse(params.restaurant) : null,
  );

  const restaurantData =
    allRestaurants.find((r) => r.id === parsedRestaurant?.id) ||
    parsedRestaurant;
  const menuItems = restaurantData?.menu || [];

  useEffect(() => {
    if (restaurantData?.id) dispatch(getReviews(restaurantData.id));
  }, [restaurantData?.id]);

  useEffect(() => {
    if (menuItems.length) setCounts(Array(menuItems.length).fill(0));
  }, [menuItems.length]);

  useEffect(() => {
    if (modalVisible) setSelectedAddon(null);
  }, [modalVisible]);

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

  const styles = makeStyles(colors);

  return (
    <SlideWrapper>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <ImageBackground
            source={{ uri: restaurantData?.imageUrl }}
            style={styles.headerImage}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.48)"]}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleBack}
                style={styles.iconCircle}
                activeOpacity={0.8}
              >
                <ChevronLeft size={iconSize.lg} color={colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleToggleFavorite(restaurantData, "restaurant")
                }
                style={styles.iconCircle}
                activeOpacity={0.8}
              >
                <Heart
                  size={iconSize.lg}
                  color={colors.primary}
                  fill={isRestFav ? colors.primary : "transparent"}
                />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.restaurantName}>{restaurantData?.name}</Text>
              <View style={styles.ratingRow}>
                <Star
                  size={iconSize.sm}
                  color={colors.star}
                  fill={colors.star}
                />
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

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerImage: {
      height: 188,
      justifyContent: "space-between",
      padding: spacing.xxl - 3,
    },
    headerActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.md,
    },
    iconCircle: {
      width: layout.headerIconSize,
      height: layout.headerIconSize,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadowSoft,
      ...shadows.card,
    },
    restaurantName: {
      fontSize: typography.size.h1,
      color: colors.textInverse,
      fontFamily: typography.font.regular,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.xs + 1,
    },
    ratingText: {
      fontFamily: typography.font.regular,
      color: colors.textInverse,
      fontSize: typography.size.md,
    },
    reviewCount: {
      color: colors.divider,
      fontWeight: "normal",
    },
    seeReview: {
      fontFamily: typography.font.regular,
      color: colors.primary,
      textDecorationLine: "underline",
      marginLeft: spacing.md,
    },
    menuContainer: {
      padding: spacing.xl,
    },
    bottomActions: {
      position: "absolute",
      bottom: spacing.huge,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    addToCartBtn: {
      width: 167,
      height: 53,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.xs + 2,
      borderRadius: radius.full,
      shadowColor: colors.primaryShadow,
      ...shadows.cta,
    },
    cartIconCircle: {
      width: 40,
      height: 40,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.circle,
      marginRight: spacing.md,
    },
    addToCartText: {
      fontFamily: typography.font.regular,
      color: colors.textInverse,
      fontSize: typography.size.md + 1,
    },
    logo: {
      width: 16,
      height: 17,
    },
  });
