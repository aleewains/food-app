import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ marginHorizontal: 25, marginBottom: 20 }}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          { borderColor: isFocused ? "#ff6f4f" : "#e6e6e6" },
          !editable && { backgroundColor: "#F9F9FB" }, // Gray out when locked
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
            <Ionicons name="chevron-down" size={14} color="#A0A0AA" />
            <View style={styles.divider} />
          </TouchableOpacity>
        )}

        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#C4C4C4"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          style={[styles.input, !editable && { color: "#9796A1" }]}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
        />

        {secureTextEntry && editable && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#D0D2D1"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: "#A0A0AA",
    marginBottom: 6,
    fontFamily: "Adamina-Regular",
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Adamina-Regular",
    color: "#000",
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  countryText: {
    fontSize: 16,
    color: "#000",
    marginRight: 4,
    fontFamily: "Adamina-Regular",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#E6E6E6",
    marginHorizontal: 10,
  },
});
