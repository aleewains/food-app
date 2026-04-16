import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ErrorModal = ({ message, onClose }) => {
  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.text}>{message}</Text>

          <TouchableOpacity onPress={onClose} style={styles.btn}>
            <Text style={{ color: "#fff" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#ff6f4f",
    padding: 10,
    borderRadius: 10,
    width: 80,
    alignItems: "center",
  },
});
