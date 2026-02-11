import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/firebaseService";

/* ---------------- Async Thunk ---------------- */

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await userService.fetchRestaurants();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
const initialState = {
  data: [],
  loading: false,
  error: null,
};
/* ---------------- Slice ---------------- */

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default restaurantSlice.reducer;
