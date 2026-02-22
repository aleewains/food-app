import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Location = () => {
  return (
    <View style={styles.container}>
      <View style={styles.placeholderBox}>
        <Text style={styles.title}>Location Screen</Text>
        <Text style={styles.subtitle}>
          This feature will be implemented soon.
        </Text>
      </View>
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa", // Light neutral background
  },
  placeholderBox: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
});
