import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ToastView = ({ toast }) => {
  if (!toast) return null;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.toast,
          toast.type === "error" ? styles.error : styles.success,
        ]}
      >
        <Text style={styles.text}>{toast.message}</Text>
      </View>
    </View>
  );
};

export default ToastView;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },

  toast: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  success: { backgroundColor: "#22c55e" },
  error: { backgroundColor: "#ef4444" },

  text: {
    color: "#fff",
    fontWeight: "600",
  },
});
