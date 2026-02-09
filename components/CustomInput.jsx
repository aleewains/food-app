import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

const CustomInput = ({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
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
                ]}
            >
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#C4C4C4"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !showPassword}
                    style={styles.input}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Text style={styles.eye}>{showPassword ? <Ionicons name="eye-off" size={24} color="#D0D2D1" /> : <Ionicons name="eye" size={24} color="#D0D2D1" />}</Text>
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
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontFamily: "Adamina-Regular",
        color: "#000",
    },
    eye: {
        fontSize: 18,
        color: "#aaa",
        marginLeft: 8,
    },
});
