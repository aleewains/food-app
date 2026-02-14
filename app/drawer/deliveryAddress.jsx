import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ChevronLeft, Trash2, Pencil } from "lucide-react-native";
import { auth, db } from "../../utils/firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { fetchAddresses, deleteAddress } from "../../redux/addressSlice";
import { useSelector, useDispatch } from "react-redux";

export default function DeliveryAddress() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleDelete = (id) => {
    Alert.alert("Delete Address", "Remove this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteAddress(id)).unwrap();
          } catch (e) {
            console.error(e);
            Alert.alert("Error", "Could not delete address");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FE724C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
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
          <Text style={styles.title}>Delivery Address</Text>
        </View>

        {/* Column 3: Empty Placeholder (Important for Balance) */}
        <View style={styles.headerRight} />
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: 10, // Fixes the top card shadow
          paddingBottom: 20, // Optional: space at the bottom
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No addresses added yet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.text}>{item.street}</Text>
              <Text style={styles.text}>{item.city}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => handleDelete(item.id)}
              >
                <Image
                  style={styles.icon}
                  source={require("../../assets/icons/trash.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  router.push({
                    pathname: "/drawer/addAddress",
                    params: { id: item.id, data: JSON.stringify(item) },
                  })
                }
              >
                <Image
                  style={styles.icon}
                  source={require("../../assets/icons/edit2.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add Address Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/drawer/addAddress")}
      >
        <Text style={styles.addText}>ADD NEW ADDRESS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
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
  card: {
    backgroundColor: "#fff",

    width: 324,
    height: 94,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
    shadowColor: "rgba(184, 181, 181, 0.38)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 13,
    elevation: 9,
  },
  name: {
    fontFamily: "Adamina-Regular",
    fontSize: 17,
    fontWeight: "400",
  },
  text: {
    fontFamily: "Adamina-Regular",
    fontSize: 17,
    fontWeight: "400",
    color: "#777",
    marginTop: 2,
  },
  actions: {
    gap: 10,
  },
  iconBtn: {
    backgroundColor: "#FE724C",
    padding: 10,
    borderRadius: 20,
    width: 30.6,
    height: 30.6,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 16,
    height: 16,
  },
  addBtn: {
    backgroundColor: "#FE724C",
    margin: 20,
    padding: 18,
    borderRadius: 30,
    marginBottom: 30,
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    color: "#999",
    fontSize: 16,
  },
});
