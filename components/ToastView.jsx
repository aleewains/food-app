import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ToastView = ({ toast }) => {
  return (
    <View style={styles.overlay}>
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(0,0,0,0.15)", // soft dim background
  },

  toast: {
    minWidth: 200,
    maxWidth: "80%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,

    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  success: {
    backgroundColor: "#22c55e",
  },

  error: {
    backgroundColor: "#ef4444",
  },

  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
