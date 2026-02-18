import { auth, db } from "../utils/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
const orderService = {
  createOrder: async (orderData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      // 1. SANITIZE THE DATA: Firestore hates 'undefined'
      const cleanItems = (orderData.items || []).map((item) => ({
        id: item.id || "",
        name: item.name || "Unknown Item",
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: item.image || "",
        // Ensure addons is ALWAYS an array, never undefined
        addons: item.addons ?? [],
        total: item.total || 0,
      }));

      // 2. BUILD THE FINAL OBJECT
      const finalOrderData = {
        restaurantId: orderData.restaurantId || "",
        restaurantName: orderData.restaurantName || "Unknown Restaurant",
        subtotal: orderData.subtotal || 0,
        tax: orderData.tax || 0,
        delivery: orderData.delivery || 0,
        total: orderData.total || 0,
        items: cleanItems, // Use the sanitized items
        userId: user.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, "orders"), finalOrderData);

      return {
        id: orderRef.id,
        ...finalOrderData,
        createdAt: new Date().toISOString(), // Serializable for Redux
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
  getUserOrders: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"), // Show newest first
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to serializable string for Redux
        createdAt:
          doc.data().createdAt?.toDate().toISOString() ||
          new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },
  cancelOrder: async (orderId, cancellationData) => {
    try {
      const orderRef = doc(db, "orders", orderId);

      const updateData = {
        status: "cancelled",
        cancellationDetails: {
          reason: cancellationData.reason,
          description: cancellationData.description,
          cancelledAt: new Date().toISOString(),
        },
      };

      await updateDoc(orderRef, updateData);
      return updateData;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  },
};

export default orderService;
