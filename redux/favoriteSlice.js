import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/firebaseService";

// Thunk to fetch all favorites from the users/{uid}/favorites subcollection
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const data = await userService.getFavorites();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Thunk to add or remove a favorite
export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async ({ item, type }, { rejectWithValue }) => {
    try {
      // Calls the userService we updated earlier
      const result = await userService.toggleFavorite(item, type);
      return { ...item, isFavorite: result.isFavorite, type };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Favorites Cases
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle Favorite Cases
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { id, isFavorite } = action.payload;
        if (isFavorite) {
          // Add to local state if it's a new favorite
          state.items.unshift(action.payload);
        } else {
          // Remove from local state if it was un-favorited
          state.items = state.items.filter((item) => item.id !== id);
        }
      });
  },
});

export default favoriteSlice.reducer;
