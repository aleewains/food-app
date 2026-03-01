import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/firebaseService";
import { reviewService } from "../services/reviewService";

/* ---------------- Async Thunks ---------------- */

// Fetch all restaurants for the home/search screen
export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      //  Fetch the basic restaurant list
      const restaurants = await userService.fetchRestaurants();

      //  Map through each restaurant and fetch its reviews in parallel
      const enrichedRestaurants = await Promise.all(
        restaurants.map(async (restaurant) => {
          try {
            const reviews = await reviewService.fetchReviews(restaurant.id);

            if (reviews && reviews.length > 0) {
              const avg =
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
              return {
                ...restaurant,
                averageRating: Math.round(avg * 10) / 10,
                reviewCount: reviews.length,
              };
            }
            return { ...restaurant, averageRating: 0, reviewCount: 0 };
          } catch (err) {
            // If one restaurant reviews fail, still return the restaurant
            return { ...restaurant, averageRating: 0, reviewCount: 0 };
          }
        }),
      );

      return enrichedRestaurants;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch reviews for a specific restaurant
export const getReviews = createAsyncThunk(
  "restaurants/getReviews",
  async (restaurantId, { rejectWithValue }) => {
    try {
      return await reviewService.fetchReviews(restaurantId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Post a new review
export const postReview = createAsyncThunk(
  "restaurants/postReview",
  async ({ restaurantId, reviewData }, { rejectWithValue }) => {
    try {
      return await reviewService.addReview(restaurantId, reviewData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ---------------- Slice ---------------- */

const initialState = {
  data: [], // List of all restaurants
  reviews: [], // Reviews for the currently viewed restaurant
  loading: true, // Global loading state
  reviewLoading: false, // Specific loading for reviews
  error: null,
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Restaurants
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })

      // Get Reviews
      .addCase(getReviews.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviews = action.payload || [];

        // Update stats in the main list
        if (action.payload && action.payload.length > 0) {
          const rId = action.payload[0].restaurantId;
          const avg =
            action.payload.reduce((sum, r) => sum + (r.rating || 0), 0) /
            action.payload.length;
          const index = state.data.findIndex((res) => res.id === rId);
          if (index !== -1) {
            state.data[index].averageRating = Math.round(avg * 10) / 10;
            state.data[index].reviewCount = action.payload.length;
          }
        }
      })

      // Post Review
      .addCase(postReview.fulfilled, (state, action) => {
        // 1. Safety check for payload
        if (!action.payload) return;

        // 2. Add to the local reviews array so it shows up on the ReviewsScreen immediately
        // We use unshift to put the newest review at the very top
        state.reviews.unshift(action.payload);

        // 3. Update the specific restaurant in the 'data' array (for the Home Screen rating)
        const rId = action.payload.restaurantId;
        const index = state.data.findIndex((res) => res.id === rId);

        if (index !== -1) {
          const currentRes = state.data[index];
          // Use current values or fallback to 0
          const currentCount = currentRes.reviewCount || 0;
          const currentAvg = currentRes.averageRating || 0;

          const newCount = currentCount + 1;
          const newAvg =
            (currentAvg * currentCount + action.payload.rating) / newCount;

          state.data[index].averageRating = Math.round(newAvg * 10) / 10;
          state.data[index].reviewCount = newCount;
        }
      });
  },
});

export const { clearReviews } = restaurantSlice.actions;
export default restaurantSlice.reducer;
