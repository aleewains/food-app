import { auth, db } from "../utils/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
const orderService = {
  createOrder: async (orderData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      const orderRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        userId: user.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      return {
        id: orderRef.id,
        ...orderData,
        userId: user.uid,
        status: "pending",
        createdAt: new Date().toISOString(),
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
};

export default orderService;
