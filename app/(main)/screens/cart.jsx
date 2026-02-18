import React, { useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../../../redux/cartSlice";
import { useRouter } from "expo-router";
import { Minus, Plus, X, ChevronLeft, Heart } from "lucide-react-native";
import { createOrder, clearOrder } from "../../../redux/orderSlice";

export default function CartScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector((state) => state.cart.items);
  const { loading, error, currentOrder } = useSelector((state) => state.order);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const tax = 5.3; // Matches your UI screenshot specifically
  const delivery = 1.0;
  const total = subtotal + tax + delivery;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Sanitize items to ensure no 'undefined' fields hit Firebase
    const sanitizedItems = cartItems.map((item) => ({
      id: item.id || "",
      cartItemId: item.cartItemId,
      name: item.name || "",
      price: item.price || 0,
      quantity: item.quantity || 1,
      total: item.total || 0,
      image: item.image || "",
      // This is the critical fix for your previous error:
      addons: item.addons ?? [],
    }));

    const order = {
      restaurantId: cartItems[0].restaurantId,
      restaurantName: cartItems[0].restaurantName,
      items: sanitizedItems,
      subtotal,
      tax,
      delivery,
      total,
    };

    dispatch(createOrder(order));
  };

  useEffect(() => {
    if (currentOrder) {
      dispatch(clearCart());
      router.replace("/drawer/myOrders");
      dispatch(clearOrder());
    }
  }, [currentOrder, dispatch, router]);
  useEffect(() => {
    if (error) {
      Alert.alert("Order Failed", error);
    }
  }, [error]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{item.name}</Text>
          {item.addons?.length > 0 && (
            <Text style={styles.subText}>
              {item.addons.map((a) => a.name).join(", ")}
            </Text>
          )}
        </View>
        <Text style={styles.price}>${item.total.toFixed(2)}</Text>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={() => dispatch(removeFromCart(item.cartItemId))}
          style={styles.removeBtn}
        >
          <X size={18} color="#FF4B3A" />
        </TouchableOpacity>

        <View style={styles.verticalCounter}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => dispatch(decreaseQuantity(item.cartItemId))}
          >
            <Minus size={14} color="#FE724C" />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.quantity}</Text>

          <TouchableOpacity
            style={[styles.counterBtn, styles.counterBtnActive]}
            onPress={() => dispatch(increaseQuantity(item.cartItemId))}
          >
            <Plus size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Custom Header */}

      <View style={styles.header}>
        {/* Column 1: Back Button */}
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ChevronLeft size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Column 2: Centered Title */}
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Cart</Text>
        </View>

        {/* Column 3: Empty Placeholder (Important for Balance) */}
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.cartItemId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 20 }}
        ListFooterComponent={
          <>
            {/* Promo Code Section */}
            <View style={styles.promoContainer}>
              <TextInput
                placeholder="Promo Code"
                placeholderTextColor="#C4C4C4"
                style={styles.promoInput}
              />
              <TouchableOpacity style={styles.applyBtn}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>

            {/* Summary */}
            <View style={styles.summarySection}>
              <Row label="Subtotal" value={subtotal} />
              <Row label="Tax and Fees" value={tax} />
              <Row label="Delivery" value={delivery} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Total{" "}
                  <Text style={styles.itemCount}>({cartCount} items)</Text>
                </Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </>
        }
      />

      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={handleCheckout}
        disabled={loading}
      >
        <Text style={styles.checkoutText}>
          {loading ? "PLACING ORDER..." : "CHECKOUT"}
        </Text>
      </TouchableOpacity>
    </SafeAreaProvider>
  );
}

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <View style={{ flexDirection: "row", alignItems: "baseline" }}>
      <Text style={styles.rowValue}>${value.toFixed(2)}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pushes the three sections apart
    marginTop: 25,
    marginBottom: 30,
    paddingHorizontal: 25,
  },
  headerLeft: {
    width: 40,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1, // Takes up all remaining space
    alignItems: "center",
  },
  headerRight: {
    width: 40, // Must be EXACTLY the same as headerLeft width
  },
  backBtn: {
    alignSelf: "flex-start",
    width: 38,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    boxShadow: "5px 10px 20px rgba(211, 209, 216, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "600",
    color: "#111719",
  },
  headerTitle: {
    fontFamily: "Adamina-Regular",
    fontSize: 20,
    fontWeight: "600",
  },

  itemContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 2, // Gives space for the shadow to show on the sides
    padding: 12, // Internal spacing
    backgroundColor: "#fff", // REQUIRED for shadows to show on most devices
    borderRadius: 15, // Rounded corners make shadows look better

    // iOS Shadows
    shadowColor: "#dcdcdc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    // Android Shadow
    elevation: 5,
  },
  content: {
    // justifyContent: "space-between",
  },
  title: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "500",
    color: "#111719",
  },
  subText: {
    fontFamily: "Adamina-Regular",
    color: "#9796A1",
    fontSize: 14,
    marginVertical: 4,
  },
  price: {
    fontFamily: "Adamina-Regular",
    color: "#FE724C",
    fontWeight: "400",
    fontSize: 16,
  },

  rightActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 60,
  },
  removeBtn: { alignSelf: "flex-end" },

  verticalCounter: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FE724C",
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnActive: { backgroundColor: "#FE724C" },
  qtyText: {
    fontFamily: "Adamina-Regular",
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 2,
  },

  promoContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 30,
    padding: 8,
    marginVertical: 25,
    alignItems: "center",
  },
  promoInput: {
    fontFamily: "Adamina-Regular",
    flex: 1,
    paddingLeft: 20,
    fontSize: 16,
  },
  applyBtn: {
    backgroundColor: "#FE724C",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  applyText: {
    fontFamily: "Adamina-Regular",
    color: "#fff",
    fontWeight: "600",
  },

  summarySection: { borderTopWidth: 1, borderColor: "#F2F2F2", paddingTop: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  rowLabel: { fontFamily: "Adamina-Regular", fontSize: 17, color: "#111719" },
  rowValue: { fontFamily: "Adamina-Regular", fontSize: 18, fontWeight: "600" },
  currencySmall: {
    fontFamily: "Adamina-Regular",
    fontSize: 12,
    color: "#9796A1",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: "#F2F2F2",
    paddingTop: 15,
  },
  totalLabel: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "500",
  },
  itemCount: { color: "#9796A1", fontWeight: "400", fontSize: 14 },
  totalValue: {
    fontFamily: "Adamina-Regular",
    fontSize: 20,
    fontWeight: "600",
  },
  currency: {
    fontFamily: "Adamina-Regular",
    fontSize: 14,
    color: "#9796A1",
    fontWeight: "400",
  },

  checkoutBtn: {
    marginHorizontal: 25,
    marginBottom: 30,
    height: 60,
    backgroundColor: "#FE724C",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FE724C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  checkoutText: {
    fontFamily: "Adamina-Regular",
    color: "#fff",
    fontSize: 16,
    // fontWeight: "800",
    letterSpacing: 1,
  },
});
