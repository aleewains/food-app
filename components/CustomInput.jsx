import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../theme";

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  editable = true,
  countryCode, // "+92", etc.
  onCountryPress,
  keyboardType = "default", // Useful for phone numbers
  error,
}) => {
  const { colors, spacing, radius, typography } = useTheme();
  const styles = getStyles(colors, spacing, radius, typography);

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused
              ? colors.inputBorderFocus
              : colors.inputBorder,
          },
          !editable && { backgroundColor: colors.surfaceMuted }, // Gray out when locked
        ]}
      >
        {/* Country Code Trigger - Now INSIDE the container */}
        {countryCode && (
          <TouchableOpacity
            onPress={onCountryPress}
            disabled={!editable}
            style={styles.countrySelector}
          >
            <Text style={styles.countryText}>{countryCode}</Text>
            <Ionicons name="chevron-down" size={14} color={colors.textSubtle} />
            <View style={styles.divider} />
          </TouchableOpacity>
        )}

        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          style={[styles.input, !editable && { color: colors.textDisabled }]}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}

        {secureTextEntry && editable && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color={colors.textLight}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInput;

const getStyles = (colors, spacing, radius, typography) =>
  StyleSheet.create({
    wrapper: {
      marginHorizontal: spacing.xl,
      marginBottom: spacing.xl,
    },

    label: {
      fontSize: typography.size.lg,
      color: colors.textMuted,
      marginBottom: spacing.xs,
      fontFamily: typography.font.regular,
    },

    inputContainer: {
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
      flexDirection: "row",
      alignItems: "center",
      borderColor: colors.inputBorder,
    },

    input: {
      flex: 1,
      fontSize: typography.size.lg,
      fontFamily: typography.font.regular,
      color: colors.textPrimary,
    },

    countrySelector: {
      flexDirection: "row",
      alignItems: "center",
      paddingRight: spacing.sm,
    },

    countryText: {
      fontSize: typography.size.md,
      color: colors.textPrimary,
      marginRight: 4,
      fontFamily: typography.font.regular,
    },

    divider: {
      width: 1,
      height: 24,
      backgroundColor: colors.divider,
      marginHorizontal: spacing.sm,
    },

    errorText: {
      color: colors.textError,
      fontSize: typography.size.sm,
      fontFamily: typography.font.regular,
      marginTop: spacing.xs,
    },
  });
