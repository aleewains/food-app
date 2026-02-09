import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import {
  ChevronLeft,
  Heart,
  Star,
  Plus,
  Minus,
  ShoppingBag,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function FoodDetailsScreen() {
  const router = useRouter();
  const [counts, setCounts] = useState([0, 0, 0, 0]); // Counter for each pizza item

  const updateCount = (index, delta) => {
    setCounts((prev) => {
      const newCounts = [...prev];
      newCounts[index] = Math.max(0, newCounts[index] + delta);
      return newCounts;
    });
  };

  const foodItems = Array(4).fill({
    title: "Pizza",
    description:
      "Really convenient and the points system helps benefit loyalty. Vælg imellem, Ananas, bacon, chili",
    price: "85,00 kr",
  });

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER IMAGE SECTION */}
        <ImageBackground
          source={require("../../assets/resturant.png")}
          style={styles.headerImage}
        >
          <SafeAreaProvider style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.push("/search-results")}
              style={styles.iconCircle}
            >
              <ChevronLeft size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconCircle, { backgroundColor: "#FE724C" }]}
            >
              <Heart size={20} color="#fff" fill="#fff" />
            </TouchableOpacity>
          </SafeAreaProvider>

          <View style={styles.headerInfo}>
            <Text style={styles.restaurantName}>McDonald’s</Text>
            <View style={styles.ratingRow}>
              <Star size={16} color="#FFC529" fill="#FFC529" />
              <Text style={styles.ratingText}>
                {" "}
                4.5 <Text style={styles.reviewCount}>(30+)</Text>
              </Text>
              <TouchableOpacity>
                <Text style={styles.seeReview}> See Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* FOOD ITEMS LIST */}
        <View style={styles.menuContainer}>
          {foodItems.map((item, index) => (
            <View key={index} style={styles.foodCard}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodTitle}>{item.title}</Text>
                <Text style={styles.foodDesc}>{item.description}</Text>
                <Text style={styles.foodPrice}>{item.price}</Text>
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
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
  headerImage: {
    height: 188,
    justifyContent: "space-between",
    padding: 22,
  },
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
  headerInfo: {
    fontFamily: "Adamina-Regular",
  },
  restaurantName: {
    fontSize: 36,
    color: "#fff",
    fontFamily: "Adamina-Regular",
    fontWeight: "400",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    fontFamily: "Adamina-Regular",
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
  },
  reviewCount: {
    fontFamily: "Adamina-Regular",
    color: "#eee",
    fontWeight: "normal",
  },
  seeReview: {
    fontFamily: "Adamina-Regular",
    color: "#FE724C",
    textDecorationLine: "underline",
    marginLeft: 10,
  },
  menuContainer: {
    padding: 20,
  },
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
  foodInfo: {
    flex: 1,
    marginRight: 10,
  },
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

    marginVertical: 5,

    lineHeight: 18,
  },
  foodPrice: {
    fontSize: 16,
    color: "#FE724C",
    fontWeight: "bold",
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
  countText: {
    fontSize: 16,
    fontWeight: "bold",
  },
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
    // paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 30,
    boxShadow: "0 10px 30px rgba(254, 114, 76, 0.2)",
  },
  cartIconCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    display: "flex",
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
    textTransform: "none",
  },
  logo: {
    width: 16,
    height: 17,
  },
});
