import { auth, db } from "../utils/firebase";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  collection,
  deleteDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const RESTAURANTS_COLLECTION = "restaurants";

/**
 * HELPER: Converts Firestore Timestamps to plain numbers (milliseconds)
 * to avoid Redux "Non-serializable value" errors.
 */
const sanitizeData = (data) => {
  if (!data) return data;
  const sanitized = { ...data };
  for (const key in sanitized) {
    if (sanitized[key] && typeof sanitized[key].toMillis === "function") {
      sanitized[key] = sanitized[key].toMillis();
    }
  }
  return sanitized;
};

const userService = {
  /**
   * Fetch user profile data
   */
  getUserProfile: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      const userDoc = await getDoc(doc(db, "users", user.uid));
      return userDoc.exists() ? sanitizeData(userDoc.data()) : null;
    } catch (error) {
      console.error("Error in getUserProfile service:", error);
      throw error;
    }
  },

  updateUserProfile: async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, data, { merge: true });
      return true;
    } catch (error) {
      console.error("Error in updateUserProfile service:", error);
      throw error;
    }
  },

  updateProfileImage: async (url) => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { profileImage: url });
      return true;
    } catch (error) {
      console.error("Error in updateProfileImage service:", error);
      throw error;
    }
  },

  fetchRestaurants: async () => {
    try {
      const q = query(
        collection(db, RESTAURANTS_COLLECTION),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const restaurants = [];

      for (const restaurantDoc of querySnapshot.docs) {
        const rawData = restaurantDoc.data();
        const data = sanitizeData(rawData); // Sanitize the restaurant data

        const menuSnapshot = await getDocs(
          collection(db, RESTAURANTS_COLLECTION, restaurantDoc.id, "menu"),
        );
        const menu = menuSnapshot.docs.map((mDoc) => ({
          id: mDoc.id,
          ...sanitizeData(mDoc.data()), // Sanitize each menu item
        }));

        restaurants.push({
          id: restaurantDoc.id,
          ...data,
          menu: menu,
        });
      }
      return restaurants;
    } catch (error) {
      console.error("Error fetching restaurants: ", error);
      return [];
    }
  },

  toggleFavorite: async (item, type) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      const favRef = doc(db, "users", user.uid, "favorites", item.id);
      const favDoc = await getDoc(favRef);

      if (favDoc.exists()) {
        await deleteDoc(favRef);
        return { id: item.id, isFavorite: false };
      } else {
        // Prepare data for Firestore
        const favData = {
          // ...item,
          id: item.id,
          type: type,
          addedAt: serverTimestamp(),
        };
        delete favData.menu;

        await setDoc(favRef, favData);

        // Return sanitized version for Redux (serverTimestamp won't be available yet, so use Date.now())
        return {
          ...favData,
          addedAt: Date.now(),
          id: item.id,
          isFavorite: true,
        };
      }
    } catch (error) {
      console.error("Error in toggleFavorite service:", error);
      throw error;
    }
  },

  getFavorites: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      const q = query(
        collection(db, "users", user.uid, "favorites"),
        orderBy("addedAt", "desc"),
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...sanitizeData(doc.data()), // Sanitize the timestamp "addedAt"
      }));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  },
};

export default userService;
