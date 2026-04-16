import React, { useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  DeviceEventEmitter,
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
import { Minus, Plus, X, ChevronLeft } from "lucide-react-native";
import { createOrder, clearOrder } from "../../../redux/orderSlice";
import {
  useTheme,
  spacing,
  radius,
  typography,
  shadows,
  layout,
  iconSize,
} from "../../../theme";

export default function CartScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { colors } = useTheme();

  const cartItems = useSelector((state) => state.cart.items);
  const { loading, error, currentOrder } = useSelector((state) => state.order);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.total, 0),
    [cartItems],
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const tax = 5.3;
  const delivery = 1.0;
  const total = subtotal + tax + delivery;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const sanitizedItems = cartItems.map((item) => ({
      id: item.itemId || "",
      cartItemId: item.cartItemId,
      name: item.name || "",
      price: item.price || 0,
      quantity: item.quantity || 1,
      total: item.total || 0,
      image: item.image || "",
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
      router.push("/(main)/(stack)/myOrders");
      dispatch(clearOrder());
    }
  }, [currentOrder, dispatch, router]);

  useEffect(() => {
    if (error) {
      Alert.alert("Order Failed", error);
    }
  }, [error]);

  const handleBack = () => {
    DeviceEventEmitter.emit("CHANGE_TAB", { tab: "home" });
  };

  const styles = makeStyles(colors);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <Text style={styles.itemTitle}>{item.name}</Text>
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
          <X size={iconSize.md} color={colors.danger} />
        </TouchableOpacity>

        <View style={styles.verticalCounter}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => dispatch(decreaseQuantity(item.cartItemId))}
          >
            <Minus size={14} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.quantity}</Text>

          <TouchableOpacity
            style={[styles.counterBtn, styles.counterBtnActive]}
            onPress={() => dispatch(increaseQuantity(item.cartItemId))}
          >
            <Plus size={14} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ChevronLeft size={iconSize.xl} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={cartItems}
          keyExtractor={(item) => item.cartItemId}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: spacing.xxl,
            paddingBottom: spacing.xl,
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySub}>
                Looks like you haven't added anything yet.
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() =>
                  DeviceEventEmitter.emit("CHANGE_TAB", { tab: "home" })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.emptyBtnText}>Browse Food</Text>
              </TouchableOpacity>
            </View>
          }
        />

        <View
          style={{
            paddingHorizontal: spacing.xxl,
            paddingBottom: spacing.xl,
          }}
        >
          {/* Promo Code */}
          <View style={styles.promoContainer}>
            <TextInput
              placeholder="Promo Code"
              placeholderTextColor={colors.textPlaceholder}
              style={styles.promoInput}
            />
            <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Summary */}
          <View style={styles.summarySection}>
            <Row label="Subtotal" value={subtotal} colors={colors} />
            <Row label="Tax and Fees" value={tax} colors={colors} />
            <Row label="Delivery" value={delivery} colors={colors} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Total <Text style={styles.itemCount}>({cartCount} items)</Text>
              </Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={handleCheckout}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.checkoutText}>
          {loading ? "PLACING ORDER..." : "CHECKOUT"}
        </Text>
      </TouchableOpacity>
    </SafeAreaProvider>
  );
}

const Row = ({ label, value, colors }) => {
  const styles = makeStyles(colors);
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>${value.toFixed(2)}</Text>
    </View>
  );
};

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      flexDirection: "column",
    },

    // ── Header ──────────────────────────────────────────────────────────────
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: spacing.xxl,
      marginBottom: spacing.huge,
      paddingHorizontal: spacing.xxl,
    },
    headerLeft: {
      width: layout.headerIconSize,
      alignItems: "flex-start",
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
    },
    headerRight: {
      width: layout.headerIconSize,
    },
    backBtn: {
      width: layout.headerIconSize,
      height: layout.headerIconSize,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadowSoft,
      ...shadows.soft,
    },
    headerTitle: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xl,
      fontWeight: "600",
      color: colors.textPrimary,
    },

    // ── Cart Item ────────────────────────────────────────────────────────────
    itemContainer: {
      flexDirection: "row",
      marginVertical: spacing.md,
      marginHorizontal: 2,
      padding: spacing.md + 2,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      shadowColor: colors.shadowSoft,
      ...shadows.card,
    },
    itemTitle: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xl,
      fontWeight: "500",
      color: colors.textPrimary,
    },
    subText: {
      fontFamily: typography.font.regular,
      color: colors.textSubtle,
      fontSize: typography.size.md,
      marginVertical: spacing.xs,
    },
    price: {
      fontFamily: typography.font.regular,
      color: colors.primary,
      fontWeight: "400",
      fontSize: typography.size.lg,
    },

    // ── Item Controls ────────────────────────────────────────────────────────
    rightActions: {
      justifyContent: "space-between",
      alignItems: "flex-end",
      minHeight: 60,
    },
    removeBtn: {
      alignSelf: "flex-end",
    },
    verticalCounter: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: spacing.md,
    },
    counterBtn: {
      width: 28,
      height: 28,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    counterBtnActive: {
      backgroundColor: colors.primary,
    },
    qtyText: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.lg,
      fontWeight: "600",
      marginVertical: 2,
      color: colors.textPrimary,
    },

    // ── Empty State ──────────────────────────────────────────────────────────
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyTitle: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xxl,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    emptySub: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.md,
      color: colors.textDisabled,
      textAlign: "center",
      marginBottom: spacing.xxl,
    },
    emptyBtn: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md + 2,
      paddingHorizontal: spacing.huge,
      borderRadius: radius.pill,
    },
    emptyBtnText: {
      fontFamily: typography.font.regular,
      color: colors.textInverse,
      fontWeight: "600",
    },

    // ── Promo Code ───────────────────────────────────────────────────────────
    promoContainer: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.dividerWeak,
      borderRadius: radius.pill,
      padding: spacing.sm,
      marginVertical: spacing.xxl,
      alignItems: "center",
    },
    promoInput: {
      fontFamily: typography.font.regular,
      flex: 1,
      paddingLeft: spacing.xl,
      fontSize: typography.size.lg,
      color: colors.textPrimary,
    },
    applyBtn: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md + 2,
      paddingHorizontal: spacing.xxl,
      borderRadius: radius.pill,
    },
    applyText: {
      fontFamily: typography.font.regular,
      color: colors.textInverse,
      fontWeight: "600",
    },

    // ── Order Summary ────────────────────────────────────────────────────────
    summarySection: {
      borderTopWidth: 1,
      borderColor: colors.divider,
      paddingTop: spacing.xl,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: spacing.sm,
    },
    rowLabel: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xl - 1,
      color: colors.textPrimary,
    },
    rowValue: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xl,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.lg,
      borderTopWidth: 1,
      borderColor: colors.divider,
      paddingTop: spacing.lg,
    },
    totalLabel: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xl,
      fontWeight: "500",
      color: colors.textPrimary,
    },
    itemCount: {
      color: colors.textSubtle,
      fontWeight: "400",
      fontSize: typography.size.md,
    },
    totalValue: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xxl,
      fontWeight: "600",
      color: colors.textPrimary,
    },

    // ── Checkout Button ──────────────────────────────────────────────────────
    checkoutBtn: {
      marginHorizontal: spacing.xxl,
      marginBottom: spacing.huge,
      height: layout.buttonHeight,
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primaryShadow,
      ...shadows.cta,
    },
    checkoutText: {
      fontFamily: typography.font.regular,
      color: colors.textInverse,
      fontSize: typography.size.lg,
      letterSpacing: 1,
    },
  });
