import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewService } from "../services/reviewService";

export const postReview = createAsyncThunk(
  "reviews/postReview",
  async ({ restaurantId, reviewData }, { rejectWithValue }) => {
    try {
      return await reviewService.addReview(restaurantId, reviewData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (restaurantId, { rejectWithValue }) => {
    try {
      return await reviewService.fetchReviews(restaurantId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearReviews: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // Add new review to top of list
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
