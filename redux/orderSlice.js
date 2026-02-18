import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../services/orderService";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const result = await orderService.createOrder(orderData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getUserOrders();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async ({ orderId, reason, description }, { rejectWithValue }) => {
    try {
      const updateData = await orderService.cancelOrder(orderId, {
        reason,
        description,
      });
      return { orderId, ...updateData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
      });
    builder
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (o) => o.id === action.payload.orderId,
        );
        if (index !== -1) {
          // This will automatically move the order from "Upcoming" to "History"
          // because your screen filters by status
          state.orders[index].status = "cancelled";
          state.orders[index].cancellationDetails =
            action.payload.cancellationDetails;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
