import { auth, db } from "../utils/firebase";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  collection,
  addDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
const RESTAURANTS_COLLECTION = "restaurants";

const userService = {
  /**
   * Fetch user profile data from Firestore
   */
  getUserProfile: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error in getUserProfile service:", error);
      throw error;
    }
  },

  /**
   * Update text-based profile fields
   */
  updateUserProfile: async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      const userRef = doc(db, "users", user.uid);
      // We use setDoc with merge: true to create the doc if it doesn't exist
      await setDoc(userRef, data, { merge: true });
      return true;
    } catch (error) {
      console.error("Error in updateUserProfile service:", error);
      throw error;
    }
  },

  /**
   * Specifically update the profile image URL
   */
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

  fetchRestaurants: async (url) => {
    try {
      const q = query(
        collection(db, RESTAURANTS_COLLECTION),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);

      const restaurants = [];

      for (const restaurantDoc of querySnapshot.docs) {
        const data = restaurantDoc.data();

        // Fetch menu sub-collection for each restaurant
        const menuSnapshot = await getDocs(
          collection(db, RESTAURANTS_COLLECTION, restaurantDoc.id, "menu"),
        );
        const menu = menuSnapshot.docs.map((mDoc) => ({
          id: mDoc.id,
          ...mDoc.data(),
        }));

        restaurants.push({
          id: restaurantDoc.id,
          name: data.name,
          rating: data.rating,
          reviewCount: data.reviewCount,
          deliveryFee: data.deliveryFee,
          deliveryTime: data.deliveryTime,
          imageUrl: data.imageUrl,
          logoUrl: data.logoUrl,
          imagePath: data.imagePath,
          tags: data.tags,
          createdAt: data.createdAt?.toMillis?.() || Date.now(),
          menu: menu,
        });
      }

      return restaurants;
    } catch (error) {
      console.error("Error fetching restaurants: ", error);
      return [];
    }
  },
};

export default userService;
