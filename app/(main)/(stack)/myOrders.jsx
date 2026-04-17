import React, { useState, useEffect, useRef, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder, fetchOrders } from "../../../redux/orderSlice";
import { addToCart, clearCart } from "../../../redux/cartSlice";
import { Header } from "../../../components";
import { useRouter } from "expo-router";
import SlideWrapper from "../../../components/slideWrapper";
import { useTheme, spacing, radius, typography, shadows } from "../../../theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const INITIAL_TAB_WIDTH = (SCREEN_WIDTH - spacing.xxl * 2 - 12) / 2;

export default function OrdersScreen() {
  const activeTabRef = useRef("Upcoming");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(INITIAL_TAB_WIDTH);
  const upcomingTextRef = useRef(null);
  const historyTextRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reason, setReason] = useState("We don't have time");
  const [description, setDescription] = useState("");

  const router = useRouter();
  const { colors } = useTheme();

  const handleTabPress = (tab, index) => {
    if (activeTabRef.current === tab) return;
    activeTabRef.current = tab;

    if (index === 0) {
      upcomingTextRef.current?.setNativeProps({
        style: { color: colors.textInverse },
      });
      historyTextRef.current?.setNativeProps({
        style: { color: colors.textSubtle },
      });
    } else {
      upcomingTextRef.current?.setNativeProps({
        style: { color: colors.textSubtle },
      });
      historyTextRef.current?.setNativeProps({
        style: { color: colors.textInverse },
      });
    }

    Animated.timing(translateX, {
      toValue: index * tabWidth,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    setTimeout(() => forceUpdate(), 260);
  };

  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const restaurants = useSelector((state) => state.restaurants.data || []);

  const getRestaurantLogo = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant?.logoUrl || "https://via.placeholder.com/50";
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const parseDate = (createdAt) => {
    if (!createdAt) return { date: "", time: "" };
    let d;
    if (createdAt.seconds) d = new Date(createdAt.seconds * 1000);
    else if (createdAt.toDate) d = createdAt.toDate();
    else d = new Date(createdAt);
    return {
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const handleCancelBtnPress = (id) => {
    setSelectedOrderId(id);
    setModalVisible(true);
  };

  const handleFinalCancel = () => {
    dispatch(cancelOrder({ orderId: selectedOrderId, reason, description }));
    setModalVisible(false);
    setDescription("");
  };

  const totalItemCount = (itemsArray) =>
    (itemsArray || []).reduce((sum, item) => sum + (item.quantity || 1), 0);

  const upcomingOrders = (orders || [])
    .filter((o) => o.status === "pending" || o.status === "preparing")
    .map((o) => ({
      ...o,
      restaurant: o.restaurantName,
      logo: getRestaurantLogo(o.restaurantId),
      items: totalItemCount(o.items),
      date: parseDate(o.createdAt),
      arrival: o.estimatedArrival || 30,
    }));

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const lastedOrders = (orders || [])
    .filter((o) => {
      const orderDate = new Date(o.createdAt);
      return (
        (o.status === "delivered" || o.status === "cancelled") &&
        orderDate >= sevenDaysAgo
      );
    })
    .map((o) => ({
      ...o,
      restaurant: o.restaurantName,
      logo: getRestaurantLogo(o.restaurantId),
      items: totalItemCount(o.items),
      date: parseDate(o.createdAt),
      items_details: o.items,
    }));

  const historyOrders = (orders || [])
    .filter((o) => o.status === "delivered" || o.status === "cancelled")
    .map((o) => ({
      ...o,
      restaurant: o.restaurantName,
      logo: getRestaurantLogo(o.restaurantId),
      items: totalItemCount(o.items),
      date: parseDate(o.createdAt),
      arrival: o.estimatedArrival || 30,
      items_details: o.items,
    }));

  const handleReOrder = (item) => {
    try {
      const itemsToProcess = item.items_details || item.items || [];
      if (itemsToProcess.length === 0) {
        Alert.alert("Error", "No items found to re-order.");
        return;
      }
      dispatch(clearCart());
      itemsToProcess.forEach((product) => {
        dispatch(
          addToCart({
            cartItemId: Date.now().toString() + Math.random(),
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
            total: product.price * (product.quantity || 1),
            image: product.image || "",
            addons: product.addons ?? [],
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
          }),
        );
      });
      router.push({
        pathname: "/(main)/(stack)/mainpager",
        params: { tab: "cart" },
      });
    } catch (error) {
      Alert.alert("Error", "Could not process re-order.");
    }
  };

  const styles = makeStyles(colors);

  const renderUpcoming = ({ item }) => (
    <View style={styles.card}>
      <StatusBar hidden={true} />
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, flexDirection: "row", gap: spacing.md + 2 }}>
          <View style={styles.logoBox}>
            <Image source={{ uri: item.logo }} style={styles.logo} />
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <Text style={styles.itemCountText}>{item.items} Items</Text>
            <Text style={styles.restaurantName}>
              {item.restaurant} <Text style={{ color: "#00BFA5" }}>●</Text>
            </Text>
          </View>
        </View>
        <Text style={styles.orderId}>#{item.id}</Text>
      </View>

      <View style={styles.statusRow}>
        <View>
          <Text style={styles.label}>Estimated Arrival</Text>
          <Text style={styles.arrivalValue}>
            {item.arrival} <Text style={styles.minText}>min</Text>
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.label}>Now</Text>
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === "cancelled" ? colors.danger : "#00BFA5",
                marginTop: spacing.xs,
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.cancelBtn}
          onPress={() => handleCancelBtnPress(item.id)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trackBtn} activeOpacity={0.8}>
          <Text style={styles.trackText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHistory = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, flexDirection: "row", gap: spacing.md + 2 }}>
          <View style={styles.logoBox}>
            <Image source={{ uri: item.logo }} style={styles.logo} />
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <Text style={styles.itemCountText}>{item.items} Items</Text>
            <Text style={styles.restaurantName}>
              {item.restaurant} <Text style={{ color: "#00BFA5" }}>●</Text>
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Text style={styles.orderId}>#{item.id}</Text>
          <Text style={styles.price}>${item.total}</Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        <View>
          <Text style={styles.label}>Order Date</Text>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Text style={styles.dateText}>{item.date.date}, </Text>
            <Text style={styles.timeText}>{item.date.time}</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.label}>Status</Text>
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === "cancelled" ? colors.danger : "#00BFA5",
                marginTop: spacing.xs,
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.cancelBtn}
          onPress={() =>
            router.push({
              pathname: "/(main)/(stack)/AddReviewScreen",
              params: { restaurantId: item.restaurantId },
            })
          }
        >
          <Text style={styles.cancelText}>Rate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.trackBtn}
          onPress={() => handleReOrder(item)}
        >
          <Text style={styles.trackText}>Re-Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SlideWrapper disableEnterAnimation>
      <SafeAreaProvider style={styles.container}>
        <Header
          showBackButton={true}
          title="My Orders"
          onBackPress={() => {
            if (router.canGoBack()) router.back();
            else router.push("/(main)/(stack)/mainpager");
          }}
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
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("Upcoming", 0)}
            activeOpacity={0.8}
          >
            <Text
              ref={upcomingTextRef}
              style={[styles.tabText, { color: colors.textInverse }]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("History", 1)}
            activeOpacity={0.8}
          >
            <Text
              ref={historyTextRef}
              style={[styles.tabText, { color: colors.textSubtle }]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={
              activeTabRef.current === "Upcoming"
                ? upcomingOrders
                : historyOrders
            }
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={
              activeTabRef.current === "Upcoming"
                ? renderUpcoming
                : renderHistory
            }
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            onRefresh={() => dispatch(fetchOrders())}
            ListFooterComponent={() =>
              activeTabRef.current === "Upcoming" && lastedOrders.length > 0 ? (
                <View>
                  <Text style={styles.sectionTitle}>Lasted Orders</Text>
                  {lastedOrders.map((item) => (
                    <View key={item.id}>{renderHistory({ item })}</View>
                  ))}
                </View>
              ) : null
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No orders found.</Text>
            }
          />
        </View>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: colors.danger, fontSize: 40 }}>×</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Select a reason</Text>
              <View style={styles.dropdownPlaceholder}>
                <Text style={styles.dropdownText}>{reason}</Text>
                <Text style={{ color: colors.textPrimary }}>▼</Text>
              </View>

              <Text style={[styles.modalTitle, { marginTop: spacing.xxl }]}>
                Write a description (Optional)
              </Text>
              <TextInput
                style={styles.textArea}
                multiline
                placeholder="Tell us more..."
                placeholderTextColor={colors.textPlaceholder}
                value={description}
                onChangeText={setDescription}
              />

              <TouchableOpacity
                style={styles.confirmCancelBtn}
                onPress={handleFinalCancel}
              >
                <Text style={styles.confirmCancelText}>CANCEL ORDER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaProvider>
    </SlideWrapper>
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
      padding: spacing.xxl,
      paddingBottom: 40,
      backgroundColor: colors.background,
    },

    // ── Tab Switcher ─────────────────────────────────────────────────────────
    tabContainer: {
      flexDirection: "row",
      borderColor: colors.divider,
      borderWidth: 1,
      marginHorizontal: spacing.xxl,
      marginTop: spacing.huge,
      borderRadius: radius.full,
      padding: spacing.xs + 1,
      position: "relative",
      overflow: "hidden",
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
      borderRadius: radius.pill,
      zIndex: 1,
    },
    tabText: {
      fontFamily: typography.font.regular,
      fontWeight: "500",
    },

    // ── Order Card ────────────────────────────────────────────────────────────
    card: {
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      marginTop: spacing.xs - 1,
      marginBottom: spacing.xl,
      shadowColor: colors.shadowSoft,
      ...shadows.soft,
    },
    cardHeader: {
      flexDirection: "row",
    },
    logoBox: {
      width: 80,
      height: 80,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadowSoft,
      shadowOffset: { width: 11.48, height: 17.22 },
      shadowOpacity: 0.45,
      shadowRadius: 22.96,
      elevation: 18,
    },
    logo: {
      width: 60,
      height: 60,
      resizeMode: "contain",
    },
    restaurantName: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.lg,
      fontWeight: "600",
      marginTop: 2,
      color: colors.textPrimary,
    },
    itemCountText: {
      fontFamily: typography.font.regular,
      color: colors.textSubtle,
      fontSize: typography.size.sm,
    },
    orderId: {
      fontFamily: typography.font.regular,
      color: colors.primary,
      fontWeight: "600",
    },
    price: {
      fontFamily: typography.font.regular,
      color: colors.primary,
      fontWeight: "600",
      fontSize: typography.size.lg,
    },
    statusRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: spacing.lg,
    },
    label: {
      fontFamily: typography.font.regular,
      color: colors.textSubtle,
      fontSize: typography.size.sm,
    },
    arrivalValue: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.h3,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    minText: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.md,
      fontWeight: "400",
      color: colors.textPrimary,
    },
    statusText: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.lg,
      fontWeight: "600",
    },

    // ── Card Buttons ──────────────────────────────────────────────────────────
    buttonRow: {
      flexDirection: "row",
      gap: spacing.lg,
      marginTop: spacing.md,
    },
    trackBtn: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: spacing.md + 2,
      borderRadius: radius.pill,
      alignItems: "center",
    },
    cancelBtn: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.dividerWeak,
      paddingVertical: spacing.md + 2,
      borderRadius: radius.pill,
      alignItems: "center",
    },
    trackText: {
      fontFamily: typography.font.regular,
      color: colors.textInverse,
      fontWeight: "600",
    },
    cancelText: {
      fontFamily: typography.font.regular,
      color: colors.textPrimary,
      fontWeight: "500",
    },

    // ── Misc ──────────────────────────────────────────────────────────────────
    sectionTitle: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xxl + 2,
      fontWeight: "600",
      marginVertical: spacing.lg,
      color: colors.textPrimary,
    },
    dateText: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xl,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    timeText: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.md,
      color: colors.textSubtle,
      fontWeight: "400",
    },
    emptyText: {
      fontSize: typography.size.xl,
      fontFamily: typography.font.regular,
      textAlign: "center",
      marginTop: spacing.xl,
      marginBottom: spacing.xl,
      color: colors.textPrimary,
    },

    // ── Cancel Modal ──────────────────────────────────────────────────────────
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      padding: spacing.xl,
    },
    modalContent: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.xl,
      padding: spacing.xxl,
      paddingTop: spacing.md,
      shadowColor: colors.shadowSoft,
      shadowOffset: { width: 0, height: 18.21 },
      shadowOpacity: 0.1,
      shadowRadius: 36,
      elevation: 10,
    },
    closeIcon: {
      alignSelf: "flex-end",
    },
    modalTitle: {
      fontFamily: typography.font.regular,
      fontSize: typography.size.xl,
      textAlign: "center",
      marginBottom: spacing.lg,
      color: colors.textPrimary,
    },
    dropdownPlaceholder: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.surface,
    },
    dropdownText: {
      fontFamily: typography.font.regular,
      color: colors.textPrimary,
    },
    textArea: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.lg,
      height: 120,
      textAlignVertical: "top",
      fontFamily: typography.font.regular,
      color: colors.textPrimary,
    },
    confirmCancelBtn: {
      backgroundColor: "#FF0000",
      width: "60%",
      borderRadius: radius.full,
      paddingVertical: spacing.lg,
      marginTop: spacing.huge,
      alignItems: "center",
      alignSelf: "center",
    },
    confirmCancelText: {
      color: colors.textInverse,
      fontWeight: "700",
      letterSpacing: 1,
    },
  });
