import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import CustomInput from "../../components/CustomInput";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CountryPicker } from "react-native-country-codes-picker";
import { ChevronLeft } from "lucide-react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  Address,
} from "../../redux/addressSlice"; // adjust path

const AddAddressScreen = () => {
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const addressId = typeof params.id === "string" ? params.id : undefined;

  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.address.addresses);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    state: "",
    city: "",
    street: "",
  });

  const [countryCode, setCountryCode] = useState("+92");
  const [loading, setLoading] = useState(false);

  // Load address if editing
  useEffect(() => {
    if (!addressId) return;

    const addr = addresses.find((a) => a.id === addressId);
    if (addr) {
      setForm({
        fullName: addr.fullName,
        phone: addr.phone.replace(addr.countryCode, ""),
        state: addr.state,
        city: addr.city,
        street: addr.street,
      });
      setCountryCode(addr.countryCode);
    }
  }, [addressId, addresses]);

  // Save or Update using Redux Slice
  const saveAddress = async () => {
    const cleanForm = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      state: form.state.trim(),
      city: form.city.trim(),
      street: form.street.trim(),
    };

    if (!cleanForm.fullName || !cleanForm.phone || !cleanForm.street) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (!/^[0-9]{7,15}$/.test(cleanForm.phone)) {
      Alert.alert("Error", "Enter a valid phone number");
      return;
    }

    try {
      setLoading(true);

      const fullPhone = `${countryCode}${cleanForm.phone}`;

      if (addressId) {
        // UPDATE
        await dispatch(
          updateAddress({
            id: addressId,
            data: {
              ...cleanForm,
              phone: fullPhone,
              countryCode,
            },
          }),
        ).unwrap();
      } else {
        // CREATE
        await dispatch(
          addAddress({
            ...cleanForm,
            phone: fullPhone,
            countryCode,
          }),
        ).unwrap();
      }

      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || "Could not save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          {/* Column 1: Back Button */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <ChevronLeft size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Column 2: Centered Title */}
          <View style={styles.headerCenter}>
            <Text style={styles.title}>
              {addressId ? "Edit address" : "Add new address"}
            </Text>
          </View>

          {/* Column 3: Empty Placeholder (Important for Balance) */}
          <View style={styles.headerRight} />
        </View>
        <View style={styles.container}>
          <CustomInput
            label="Full Name"
            placeholder="Enter your full name"
            value={form.fullName}
            onChangeText={(t) => setForm((p) => ({ ...p, fullName: t }))}
          />

          <CustomInput
            label="Phone Number"
            placeholder="3001234567"
            value={form.phone}
            onChangeText={(t) => setForm((p) => ({ ...p, phone: t }))}
            keyboardType="phone-pad"
            countryCode={countryCode}
            onCountryPress={() => setShowPicker(true)}
          />

          <CustomInput
            label="State"
            placeholder="Enter state"
            value={form.state}
            onChangeText={(t) => setForm((p) => ({ ...p, state: t }))}
          />

          <CustomInput
            label="City"
            placeholder="Enter city"
            value={form.city}
            onChangeText={(t) => setForm((p) => ({ ...p, city: t }))}
          />

          <CustomInput
            label="Street (Include house number)"
            placeholder="Street name"
            value={form.street}
            onChangeText={(t) => setForm((p) => ({ ...p, street: t }))}
          />

          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.6 }]}
            onPress={saveAddress}
            disabled={loading}
          >
            <Text style={styles.saveText}>
              {loading ? "Saving..." : "Save Address"}
            </Text>
          </TouchableOpacity>
        </View>
        <CountryPicker
          show={showPicker}
          onBackdropPress={() => setShowPicker(false)}
          pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setShowPicker(false);
          }}
          style={{
            modal: { height: 500 },
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pushes the three sections apart
    marginTop: 25,
    marginBottom: 30,
    paddingHorizontal: 25,
  },
  headerLeft: {
    width: 40, // Match your button width
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1, // Takes up all remaining space
    alignItems: "center",
  },
  headerRight: {
    width: 40, // Must be EXACTLY the same as headerLeft width
  },
  backBtn: {
    alignSelf: "flex-start",
    width: 38,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    boxShadow: "5px 10px 20px rgba(211, 209, 216, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Adamina-Regular",
    fontSize: 22,
    fontWeight: "400",
    textAlign: "center",
  },
  saveButton: {
    marginHorizontal: 25,
    marginTop: 30,
    backgroundColor: "#ff6f4f",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
