import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ChevronLeft, Trash2, Pencil } from "lucide-react-native";
import { auth, db } from "../../../utils/firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";

export default function DeliveryAddress() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Realtime listener (runs every time screen is focused)
  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (!user) return;

      setLoading(true);

      const unsubscribe = onSnapshot(
        collection(db, "users", user.uid, "addresses"),
        (snapshot) => {
          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAddresses(list);
          setLoading(false);
        },
        (error) => {
          console.error("Address listener error:", error);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    }, []),
  );

  const deleteAddress = (id) => {
    Alert.alert("Delete Address", "Remove this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const user = auth.currentUser;
          if (!user) return;

          await deleteDoc(doc(db, "users", user.uid, "addresses", id));
          // ❌ no refetch needed — onSnapshot handles it
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
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={22} />
        </TouchableOpacity>
        <Text style={styles.title}>Delivery Address</Text>
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
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
                onPress={() =>
                  router.push({
                    pathname: "/(main)/drawer/addAddress",
                    params: { id: item.id },
                  })
                }
              >
                <Pencil size={18} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => deleteAddress(item.id)}
              >
                <Trash2 size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add Address Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/(main)/drawer/addAddress")}
      >
        <Text style={styles.addText}>ADD NEW ADDRESS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 26,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  text: {
    color: "#777",
    marginTop: 2,
  },
  actions: {
    justifyContent: "space-between",
  },
  iconBtn: {
    backgroundColor: "#FE724C",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: "#FE724C",
    margin: 20,
    padding: 18,
    borderRadius: 30,
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
