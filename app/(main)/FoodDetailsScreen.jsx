import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { ChevronLeft, Heart, Star, Plus, Minus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

export default function FoodDetailsScreen({ route }) {
  const [selectedItem, setSelectedItem] = useState(null); // currently selected menu item
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();
  const { restaurant } = useLocalSearchParams(); // get params from URL/searchParams
  const parsedRestaurant = useMemo(() => {
    return restaurant ? JSON.parse(restaurant) : null;
  }, [restaurant]);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    if (parsedRestaurant?.menu?.length) {
      setCounts(Array(parsedRestaurant.menu.length).fill(0));
    }
  }, [parsedRestaurant]);

  const menuItems = parsedRestaurant?.menu || [];

  const updateCount = (index, delta) => {
    setCounts((prev) => {
      const newCounts = [...prev];
      newCounts[index] = Math.max(0, newCounts[index] + delta);
      return newCounts;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER IMAGE SECTION */}
        <ImageBackground
          source={{ uri: parsedRestaurant?.imageUrl }}
          style={styles.headerImage}
        >
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconCircle}
            >
              <ChevronLeft size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconCircle, { backgroundColor: "#FE724C" }]}
            >
              <Heart size={20} color="#fff" fill="#fff" />
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

        {/* FOOD ITEMS LIST */}
        <View style={styles.menuContainer}>
          {menuItems?.map((item, index) => (
            <View key={index} style={styles.foodCard}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodTitle}>{item.name}</Text>
                <Text style={styles.foodDesc}>{item.description}</Text>
                <Text style={styles.foodPrice}>${item.price}</Text>
              </View>

              <View style={styles.counterRow}>
                <TouchableOpacity
                  onPress={() => updateCount(index, -1)}
                  style={styles.counterBtn}
                >
                  <Minus size={18} color="#FE724C" />
                </TouchableOpacity>
                <Text style={styles.countText}>{counts[index]}</Text>
                <TouchableOpacity
                  onPress={() => updateCount(index, 1)}
                  style={[styles.counterBtn, { backgroundColor: "#FE724C" }]}
                >
                  <Plus size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
                style={{
                  marginTop: 10,
                  padding: 8,
                  backgroundColor: "#FE724C",
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Add Add-ons
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FLOATING ADD TO CART BUTTON */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.addToCartBtn}>
          <View style={styles.cartIconCircle}>
            <Image
              source={require("../../assets/icons/cart.png")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
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
    width: 40,
    height: 40,
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
    elevation: 5,
  },
  foodInfo: { flex: 1, marginRight: 10 },
  foodTitle: { fontSize: 18, fontWeight: "400", color: "#111719" },
  foodDesc: {
    fontSize: 11,
    color: "#9796A1",
    marginVertical: 5,
    lineHeight: 18,
  },
  foodPrice: { fontSize: 16, color: "#FE724C", fontWeight: "bold" },
  counterRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  counterBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FE724C",
    justifyContent: "center",
    alignItems: "center",
  },
  countText: { fontSize: 16, fontWeight: "bold" },
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
    elevation: 5,
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
  addToCartText: { color: "#fff", fontSize: 15, fontWeight: "400" },
  logo: { width: 16, height: 17 },
});
