import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./restaurantSlice";
import userReducer from "./userSlice";
import addressReducer from "./addressSlice";
import cartReducer from "./cartSlice";
import orderSlice from "./orderSlice";
import favoriteReducer from "./favoriteSlice";
export const store = configureStore({
  reducer: {
    restaurants: restaurantReducer,
    user: userReducer,
    address: addressReducer,
    cart: cartReducer,
    order: orderSlice,
    favorites: favoriteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
