import { db, auth } from "../utils/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";

// Reuse your existing sanitize helper
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
export const reviewService = {
  addReview: async (restaurantId, reviewData) => {
    try {
      const user = auth.currentUser;
      //   console.log("userdata for review:", user);
      if (!user) throw new Error("Must be logged in to review");

      const reviewRef = collection(db, "restaurants", restaurantId, "reviews");

      const newReview = {
        restaurantId: restaurantId,
        userId: user.uid,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(reviewRef, newReview);
      return { id: docRef.id, ...newReview, createdAt: Date.now() };
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  fetchReviews: async (restaurantId) => {
    try {
      const q = query(
        collection(db, "restaurants", restaurantId, "reviews"),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      const reviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 1. Get unique user IDs from the reviews
      const userIds = [...new Set(reviews.map((r) => r.userId))];

      // 2. Fetch user profiles for these IDs
      const userPromises = userIds.map((id) => getDoc(doc(db, "users", id)));
      const userSnapshots = await Promise.all(userPromises);

      const userMap = {};
      userSnapshots.forEach((snap) => {
        if (snap.exists()) {
          userMap[snap.id] = snap.data();
        }
      });

      // 3. Merge user info into reviews
      return reviews.map((review) => ({
        ...sanitizeData(review),
        userName: userMap[review.userId]?.fullName || "Anonymous",
        userImage: userMap[review.userId]?.profileImage || null,
      }));
    } catch (error) {
      console.error("Error fetching reviews with user info:", error);
      throw error;
    }
  },
};
