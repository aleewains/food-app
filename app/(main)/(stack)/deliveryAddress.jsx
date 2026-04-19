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
import { auth, db } from "../../../utils/firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import {
  fetchAddresses,
  deleteAddress,
  setDefaultAddress,
} from "../../../redux/addressSlice";
import { useSelector, useDispatch } from "react-redux";
import SlideWrapper from "../../../components/slideWrapper";

export default function DeliveryAddress() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultAddress(id)).unwrap();
    } catch (e) {
      Alert.alert("Error", "Could not update default address");
    }
  };

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

  // if (loading) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#FE724C" />
  //     </View>
  //   );
  // }

  return (
    <SlideWrapper disableEnterAnimation>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Column 1: Back Button */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  DeviceEventEmitter.emit("CHANGE_TAB", { tab: "home" });
                  router.replace("/(main)/(stack)/mainpager");
                }
              }}
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
          // ... inside your FlatList renderItem
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                item.isDefault && styles.activeCard, // Highlight the card if it's default
              ]}
              onPress={() => handleSetDefault(item.id)}
            >
              {/* Selection Radio Button */}
              <View style={styles.selectionContainer}>
                <View
                  style={[
                    styles.outerCircle,
                    item.isDefault && styles.activeOuter,
                  ]}
                >
                  {item.isDefault && <View style={styles.innerCircle} />}
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.fullName}</Text>
                <Text style={styles.text} numberOfLines={1}>
                  {item.street}
                </Text>
                <Text style={styles.text}>{item.city}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleDelete(item.id)}
                >
                  <Image
                    style={styles.icon}
                    source={require("../../../assets/icons/trash.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/addAddress",
                      params: { id: item.id, data: JSON.stringify(item) },
                    })
                  }
                >
                  <Image
                    style={styles.icon}
                    source={require("../../../assets/icons/edit2.png")}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Add Address Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/addAddress")}
        >
          <Text style={styles.addText}>ADD NEW ADDRESS</Text>
        </TouchableOpacity>
      </View>
    </SlideWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFD",
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
    width: 38,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    shadowColor: "#E9EDF2",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.9,
    shadowRadius: 30, // blur = 30
    elevation: 20,
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
    marginBottom: 60,
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

  // Add this to your styles object
  activeCard: {
    borderColor: "#FE724C",
    borderWidth: 1.5,
    backgroundColor: "#fff", // ensures it stays white
  },
  selectionContainer: {
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C4C4C4",
    justifyContent: "center",
    alignItems: "center",
  },
  activeOuter: {
    borderColor: "#FE724C",
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#FE724C",
  },
});
