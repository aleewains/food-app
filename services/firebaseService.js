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
 * HELPER: Waits for Firebase Auth to initialize and returns the current user.
 * Fixes the race condition where auth.currentUser is null on app start.
 */
const getAuthUser = () => {
  return new Promise((resolve, reject) => {
    // If auth is already resolved, use it immediately
    if (auth.currentUser) return resolve(auth.currentUser);

    // Otherwise wait for the first auth state emission
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) resolve(user);
      else reject(new Error("No authenticated user found"));
    });
  });
};

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
  getUserProfile: async () => {
    try {
      const user = await getAuthUser(); // ← fixed
      const userDoc = await getDoc(doc(db, "users", user.uid));
      return userDoc.exists() ? sanitizeData(userDoc.data()) : null;
    } catch (error) {
      console.error("Error in getUserProfile service:", error);
      throw error;
    }
  },

  updateUserProfile: async (data) => {
    try {
      const user = await getAuthUser(); // ← fixed
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
      const user = await getAuthUser(); // ← fixed
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
        const data = sanitizeData(restaurantDoc.data());
        const menuSnapshot = await getDocs(
          collection(db, RESTAURANTS_COLLECTION, restaurantDoc.id, "menu"),
        );
        const menu = menuSnapshot.docs.map((mDoc) => ({
          id: mDoc.id,
          ...sanitizeData(mDoc.data()),
        }));

        restaurants.push({ id: restaurantDoc.id, ...data, menu });
      }
      return restaurants;
    } catch (error) {
      console.error("Error fetching restaurants: ", error);
      return [];
    }
  },

  toggleFavorite: async (item, type) => {
    try {
      const user = await getAuthUser(); // ← fixed
      const favRef = doc(db, "users", user.uid, "favorites", item.id);
      const favDoc = await getDoc(favRef);

      if (favDoc.exists()) {
        await deleteDoc(favRef);
        return { id: item.id, isFavorite: false };
      } else {
        const favData = {
          id: item.id,
          type: type,
          addedAt: serverTimestamp(),
        };
        delete favData.menu;
        await setDoc(favRef, favData);

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
      const user = await getAuthUser(); // ← fixed
      const q = query(
        collection(db, "users", user.uid, "favorites"),
        orderBy("addedAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...sanitizeData(doc.data()),
      }));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  },
};

export default userService;
