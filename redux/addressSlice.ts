import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../utils/firebase";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  countryCode: string;
  state: string;
  city: string;
  street: string;
  isDefault: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

// Fetch All Addresses
export const fetchAddresses = createAsyncThunk<
  Address[],
  void,
  { rejectValue: string }
>("address/fetchAddresses", async (_, { rejectWithValue }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const snapshot = await getDocs(
      collection(db, "users", user.uid, "addresses"),
    );

    const addresses: Address[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<Address, "id">;
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toMillis() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toMillis() : null,
      };
    });

    return addresses;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Add Address
export const addAddress = createAsyncThunk<
  Address,
  Omit<Address, "id" | "createdAt" | "updatedAt">,
  { rejectValue: string }
>("address/addAddress", async (data, { rejectWithValue }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(
      collection(db, "users", user.uid, "addresses"),
      {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    );

    return {
      id: docRef.id,
      ...data,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Update Address
// Update the first generic parameter here
export const updateAddress = createAsyncThunk<
  { id: string; data: Partial<Address> }, // <--- Changed from Address
  { id: string; data: Partial<Address> },
  { rejectValue: string }
>("address/updateAddress", async ({ id, data }, { rejectWithValue }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    await updateDoc(doc(db, "users", user.uid, "addresses", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { id, data };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Delete Address
export const deleteAddress = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("address/deleteAddress", async (id, { rejectWithValue }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    await deleteDoc(doc(db, "users", user.uid, "addresses", id));

    return id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

/* =========================
   Slice
========================= */

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAddresses.fulfilled,
        (state, action: PayloadAction<Address[]>) => {
          state.loading = false;
          state.addresses = action.payload;
        },
      )
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch addresses";
      })

      // ADD
      .addCase(
        addAddress.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.addresses.push(action.payload);
        },
      )

      // UPDATE
      .addCase(updateAddress.fulfilled, (state, action) => {
        const { id, data } = action.payload;

        const index = state.addresses.findIndex((a) => a.id === id);

        if (index !== -1) {
          state.addresses[index] = {
            ...state.addresses[index],
            ...data,
          };
        }
      })

      // DELETE
      .addCase(
        deleteAddress.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.addresses = state.addresses.filter(
            (addr) => addr.id !== action.payload,
          );
        },
      );
  },
});

export default addressSlice.reducer;
