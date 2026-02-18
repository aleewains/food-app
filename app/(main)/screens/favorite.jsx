import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { cancelOrder, fetchOrders } from "../../../redux/orderSlice";
import { Header } from "../../../components";
import { useRouter } from "expo-router";

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reason, setReason] = useState("We don't have time");
  const [description, setDescription] = useState("");

  const router = useRouter();

  const handleTabPress = (tab, index) => {
    setActiveTab(tab);

    Animated.timing(translateX, {
      // The index * tabWidth correctly shifts the indicator
      // without needing to worry about the container's inner padding
      toValue: index * tabWidth,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
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

  // Add "|| []" to ensure it's always an array
  const parseDate = (createdAt) => {
    if (!createdAt) return { date: "", time: "" };

    let d;
    if (createdAt.seconds) d = new Date(createdAt.seconds * 1000);
    else if (createdAt.toDate) d = createdAt.toDate();
    else d = new Date(createdAt);

    return {
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), // e.g. "20 Dec"
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // e.g. "14:30"
    };
  };

  const handleCancelBtnPress = (id) => {
    setSelectedOrderId(id);
    setModalVisible(true);
  };

  const handleFinalCancel = () => {
    dispatch(
      cancelOrder({
        orderId: selectedOrderId,
        reason,
        description,
      }),
    );
    setModalVisible(false);
    setDescription(""); // Reset for next time
  };

  const upcomingOrders = (orders || [])
    .filter((o) => o.status === "pending" || o.status === "preparing")
    .map((o) => ({
      ...o,
      restaurant: o.restaurantName,
      logo: getRestaurantLogo(o.restaurantId),
      items: o.items.length,
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
      items: o.items.length,
      date: parseDate(o.createdAt),
    }));
  const historyOrders = (orders || [])
    .filter((o) => o.status === "delivered" || o.status === "cancelled")
    .map((o) => {
      const dateObj = parseDate(o.createdAt);
      return {
        ...o,
        restaurant: o.restaurantName,
        logo: getRestaurantLogo(o.restaurantId),
        items: o.items.length,
        date: parseDate(o.createdAt),
        arrival: o.estimatedArrival || 30,
      };
    });

  const displayData =
    activeTab === "Food Items" ? upcomingOrders : historyOrders;

  const renderUpcoming = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
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
                color: item.status === "cancelled" ? "#FF4B4B" : "#00BFA5",
                marginTop: 4,
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => handleCancelBtnPress(item.id)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trackBtn}>
          <Text style={styles.trackText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHistory = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
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
                color: item.status === "cancelled" ? "#FF4B4B" : "#00BFA5",
                marginTop: 4,
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Rate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trackBtn}>
          <Text style={styles.trackText}>Re-Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <Header
        showBackButton={true}
        title="Favorites"
        onBackPress={() => router.back()}
      />
      {/* Tab Switcher */}
      <View
        style={styles.tabContainer}
        onLayout={(e) => {
          const { width } = e.nativeEvent.layout;
          const containerPadding = 12; // Total horizontal padding (5 left + 5 right)
          const usableWidth = width - containerPadding;
          setTabWidth(usableWidth / 2);
          console.log(width);
        }}
      >
        {/* Sliding Indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        />

        {["Food Items", "Resturents"].map((tab, index) => (
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
          data={displayData}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={activeTab === "Upcoming" ? renderUpcoming : renderHistory}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          onRefresh={() => dispatch(fetchOrders())}
          ListFooterComponent={() =>
            activeTab === "Upcoming" && lastedOrders.length > 0 ? (
              <View style={{ marginTop: 0 }}>
                <Text style={styles.sectionTitle}>Lasted Orders</Text>
                {lastedOrders.map((item) => (
                  <View key={item.id}>
                    {/* FIX HERE: Wrap the item in an object to match renderHistory's signature */}
                    {renderHistory({ item })}
                  </View>
                ))}
              </View>
            ) : null
          }
          ListEmptyComponent={
            <Text
              style={{
                fontFamily: "Adamina-Regular",
                textAlign: "center",
                marginTop: 50,
              }}
            >
              No orders found.
            </Text>
          }
        />
      </View>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "red", fontSize: 40 }}>×</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Select a reason</Text>
            <View style={styles.dropdownPlaceholder}>
              <Text style={styles.dropdownText}>{reason}</Text>
              <Text>▼</Text>
            </View>

            <Text style={[styles.modalTitle, { marginTop: 25 }]}>
              Write a description (Optional)
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Tell us more..."
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FCFCFD" },
  listContainer: {
    flex: 1,
    padding: 25,
    paddingBottom: 40,
    backgroundColor: "#FCFCFD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    // fontWeight: "400",
  },
  backBtn: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowOpacity: 0.1,
  },
  profileImg: { width: 40, height: 40, borderRadius: 10 },

  tabContainer: {
    flexDirection: "row",
    // backgroundColor: "#F6F6F6",
    borderColor: "#F2EAEA",
    borderWidth: 1,
    marginHorizontal: 25,
    marginTop: 30,
    borderRadius: 30,
    padding: 5,
    position: "relative",
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    top: 5,
    bottom: 5,
    left: 5,
    backgroundColor: "#FE724C",
    borderRadius: 25,
  },

  tab: {
    // backgroundColor: "#a9a19f",
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 25,
    zIndex: 1,
  },
  tabText: {
    fontFamily: "Adamina-Regular",
    color: "#9796A1",
    fontWeight: "500",
  },
  activeTabText: { color: "#fff" },

  card: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 20,
    // alignSelf: "center",
    elevation: 8,
    shadowColor: "#D3D1D840",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: {
    flexDirection: "row",
    // backgroundColor: "#bdb6b6",
    // justifyContent: "space-between",
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    // This creates the "floating" shadow for the logo box specifically
    // elevation: 10,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 5 },
    boxShadow: "11.48px 17.22px 22.96px rgba(211, 209, 216, 0.45)",
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  restaurantName: {
    fontFamily: "Adamina-Regular",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  itemCountText: {
    fontFamily: "Adamina-Regular",
    color: "#9796A1",
    fontSize: 12,
  },
  orderId: {
    fontFamily: "Adamina-Regular",
    color: "#FE724C",
    fontWeight: "600",
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  label: { fontFamily: "Adamina-Regular", color: "#9796A1", fontSize: 12 },
  arrivalValue: {
    fontFamily: "Adamina-Regular",
    fontSize: 24,
    fontWeight: "600",
  },
  minText: { fontFamily: "Adamina-Regular", fontSize: 14, fontWeight: "400" },
  statusText: {
    fontFamily: "Adamina-Regular",
    fontSize: 16,
    fontWeight: "600",
  },

  buttonRow: { flexDirection: "row", gap: 15, marginTop: 10 },
  trackBtn: {
    flex: 1,
    backgroundColor: "#FE724C",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  trackText: {
    fontFamily: "Adamina-Regular",
    color: "#fff",
    fontWeight: "600",
  },
  cancelText: {
    fontFamily: "Adamina-Regular",
    color: "#000",
    fontWeight: "500",
  },

  sectionTitle: {
    fontFamily: "Adamina-Regular",
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 15,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowOpacity: 0.05,
  },
  historyTop: { flexDirection: "row", alignItems: "center" },
  historyLogo: { width: 45, height: 45, borderRadius: 10 },
  historyDate: { color: "#9796A1", fontSize: 12 },
  priceText: {
    fontFamily: "Adamina-Regular",
    color: "#FE724C",
    fontSize: 16,
    fontWeight: "700",
  },
  deliveredRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00BFA5",
    marginRight: 6,
  },
  deliveredText: {
    fontFamily: "Adamina-Regular",
    color: "#00BFA5",
    fontSize: 12,
  },
  dateText: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "600",
    color: "#111719",
  },
  timeText: {
    fontFamily: "Adamina-Regular",
    fontSize: 14,
    color: "#9796A1", // Lighter grey for time
    fontWeight: "400",
  },
  deliveredRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  deliveredText: {
    fontFamily: "Adamina-Regular",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  rateBtn: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    borderWeight: 1,
    borderColor: "#F2F2F2",
  },
  reorderBtn: {
    flex: 1,
    backgroundColor: "#FE724C",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FBFBFB",
    borderRadius: 20,
    padding: 25,
    paddingTop: 10,
    shadowColor: "#8f8f8f",
    shadowOffset: { width: 0, height: 18.21 },
    shadowOpacity: 0.1,
    shadowRadius: 36,
    elevation: 10,
  },
  closeIcon: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
  },
  dropdownPlaceholder: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  textArea: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    fontFamily: "Adamina-Regular",
  },
  confirmCancelBtn: {
    backgroundColor: "#FF0000",
    width: "60%",
    borderRadius: 30,
    paddingVertical: 15,
    marginTop: 30,
    alignItems: "center",
    alignSelf: "center",
  },
  confirmCancelText: { color: "#FFF", fontWeight: "700", letterSpacing: 1 },
});
