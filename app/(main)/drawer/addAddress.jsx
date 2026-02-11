import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth, db } from "../../../utils/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function AddAddress() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const addressId = typeof params.id === "string" ? params.id : undefined;

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    state: "",
    city: "",
    street: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!addressId) return;

    const loadAddress = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const snap = await getDoc(
          doc(db, "users", user.uid, "addresses", addressId),
        );
        if (snap.exists()) {
          setForm(snap.data());
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadAddress();
  }, [addressId]);

  const saveAddress = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!form.fullName || !form.phone || !form.street) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const ref = doc(
        db,
        "users",
        user.uid,
        "addresses",
        addressId || Date.now().toString(),
      );

      await setDoc(
        ref,
        {
          ...form,
          updatedAt: serverTimestamp(),
          ...(addressId ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true },
      );

      router.back(); //  realtime listener will update list
    } catch (e) {
      Alert.alert("Error", "Could not save address");
      console.error(e);
    } finally {
      setLoading(false);
      setForm({
        fullName: "",
        phone: "",
        state: "",
        city: "",
        street: "",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={22} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {addressId ? "Edit Address" : "Add New Address"}
        </Text>
      </View>

      {/* Form */}
      {["fullName", "phone", "state", "city", "street"].map((key) => (
        <TextInput
          key={key}
          placeholder={key.replace(/^\w/, (c) => c.toUpperCase())}
          value={form[key]}
          onChangeText={(t) => setForm((p) => ({ ...p, [key]: t }))}
          style={styles.input}
        />
      ))}

      <TouchableOpacity
        style={[styles.saveBtn, loading && { opacity: 0.6 }]}
        onPress={saveAddress}
        disabled={loading}
      >
        <Text style={styles.saveText}>{loading ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 15,
    padding: 16,
    marginTop: 15,
  },
  saveBtn: {
    backgroundColor: "#FE724C",
    marginTop: 30,
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
