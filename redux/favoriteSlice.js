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
      /* ---------------- Toggle Favorite Cases ---------------- */

      .addCase(toggleFavorite.pending, (state, action) => {
        // action.meta.arg contains the { item, type } you passed to the thunk
        const { item, type } = action.meta.arg;
        const exists = state.items.find((i) => i.id === item.id);

        if (exists) {
          // If it exists, remove it immediately (Optimistic Delete)
          state.items = state.items.filter((i) => i.id !== item.id);
        } else {
          // If it doesn't exist, add it immediately (Optimistic Add)
          state.items.unshift({ ...item, type });
        }
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        // We don't need to do anything here because the UI updated in 'pending'.
        // But we can ensure state is perfectly synced if the server returned extra data.
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        // IMPORTANT: If Firebase fails (no internet, etc.),
        // you might want to alert the user or refresh the list to undo the change.
        state.error = action.payload;
      });
  },
});

export default favoriteSlice.reducer;
