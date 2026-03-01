import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
  error: null,
};

// Calculate unit price safely
const calculateUnitPrice = (item) => {
  const addonTotal =
    item.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0;

  return item.price + addonTotal;
};

// Generate deterministic key for item comparison
const generateCartKey = (item) => {
  const addonIds =
    item.addons
      ?.map((a) => a.id)
      .sort()
      .join("-") || "";

  return `${item.productId}-${addonIds}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      // console.log(newItem);

      state.error = null;

      //  Restaurant restriction
      if (state.restaurantId && state.restaurantId !== newItem.restaurantId) {
        state.error = "You can only order from one restaurant at a time.";
        return;
      }

      // Set restaurant if first item
      if (!state.restaurantId) {
        state.restaurantId = newItem.restaurantId;
        state.restaurantName = newItem.restaurantName;
      }

      const cartKey = generateCartKey(newItem);

      const existingItem = state.items.find((item) => item.cartKey === cartKey);

      const unitPrice = calculateUnitPrice(newItem);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.total = existingItem.quantity * unitPrice;
      } else {
        state.items.push({
          ...newItem,
          cartItemId: nanoid(), // unique instance id
          cartKey,
          total: newItem.quantity * unitPrice,
        });
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.cartItemId === action.payload);

      if (item) {
        item.quantity += 1;
        const unitPrice = calculateUnitPrice(item);
        item.total = item.quantity * unitPrice;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.cartItemId === action.payload);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        const unitPrice = calculateUnitPrice(item);
        item.total = item.quantity * unitPrice;
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.cartItemId !== action.payload);

      // Reset restaurant if cart empty
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = null;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
