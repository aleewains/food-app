import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../redux/orderSlice";
import { Header } from "../../components";

export default function OrdersScreen() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const [activeTab, setActiveTab] = useState("Upcoming");

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
    if (!createdAt) return "";

    // Firebase timestamp
    if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleDateString();
    }

    // Already a Date object
    if (createdAt.toDate) {
      return createdAt.toDate().toLocaleDateString();
    }

    // Already a string
    return new Date(createdAt).toLocaleDateString();
  };

  const upcomingOrders = (orders || [])
    .filter((o) => o.status === "pending" || o.status === "preparing")
    .map((o) => ({
      id: o.id,
      items: o.items.length,
      restaurant: o.restaurantName,
      restaurantId: o.restaurantId,
      logo: getRestaurantLogo(o.restaurantId),
      arrival: o.estimatedArrival || 30,
      status: o.status,
      price: o.total,
      date: parseDate(o.createdAt),
    }));

  const historyOrders = (orders || [])
    .filter((o) => o.status === "delivered" || o.status === "cancelled")
    .map((o) => ({
      id: o.id,
      items: o.items.length,
      restaurant: o.restaurantName,
      restaurantId: o.restaurantId,
      logo: getRestaurantLogo(o.restaurantId),
      status: o.status,
      price: o.total,
      date: parseDate(o.createdAt),
    }));

  const displayData = activeTab === "Upcoming" ? upcomingOrders : historyOrders;

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
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn}>
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
          <Text style={styles.arrivalValue}>{item.date}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.statusText}>{item.status}</Text>
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
        title="My Orders"
        onBackPress={() => navigation.goBack()} // or useRouter().back()
      />
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        {["Upcoming", "History"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
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
          onRefresh={() => dispatch(fetchOrders())}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 50 }}>
              No orders found.
            </Text>
          }
        />
      </View>
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
  headerTitle: { fontSize: 18, fontWeight: "600" },
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
    backgroundColor: "#F6F6F6",
    marginHorizontal: 25,
    marginTop: 30,
    borderRadius: 30,
    padding: 5,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 25 },
  activeTab: {
    backgroundColor: "#FE724C",
    elevation: 4,
    shadowColor: "#FE724C",
    shadowOpacity: 0.3,
  },
  tabText: { color: "#9796A1", fontWeight: "500" },
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
  restaurantName: { fontSize: 16, fontWeight: "700", marginTop: 2 },
  itemCountText: { color: "#9796A1", fontSize: 12 },
  orderId: { color: "#FE724C", fontWeight: "600" },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  label: { color: "#9796A1", fontSize: 12 },
  arrivalValue: { fontSize: 24, fontWeight: "700" },
  minText: { fontSize: 14, fontWeight: "400" },
  statusText: { fontSize: 16, fontWeight: "600" },

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
  trackText: { color: "#fff", fontWeight: "600" },
  cancelText: { color: "#000", fontWeight: "500" },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginVertical: 15 },
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
  priceText: { color: "#FE724C", fontSize: 16, fontWeight: "700" },
  deliveredRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00BFA5",
    marginRight: 6,
  },
  deliveredText: { color: "#00BFA5", fontSize: 12 },
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
    flex: 1.5,
    backgroundColor: "#FE724C",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
});
