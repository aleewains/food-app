import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme, typography } from "../../../theme";

const Location = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

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

const makeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    placeholderBox: {
      padding: 20,
      alignItems: "center",
    },
    title: {
      fontSize: typography.size.xxl,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: typography.size.md,
      color: colors.textSubtle,
      fontStyle: "italic",
    },
  });
