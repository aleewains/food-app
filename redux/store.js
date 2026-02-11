import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./restaurantSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    restaurants: restaurantReducer,
    user: userReducer,
  },
});
