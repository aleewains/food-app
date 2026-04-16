import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "../theme";

const Search = ({ search, setSearch, onFilterPress }) => {
  const { colors, spacing, radius, typography } = useTheme();
  const styles = getStyles(colors, spacing, radius, typography);

  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);

  return (
    <View style={styles.searchContainer}>
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: isFocused
                ? colors.inputBorderFocus
                : colors.inputBorder,
            },
          ]}
        >
          <Image
            source={require("../assets/search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Find for food or restaurant..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
      </TouchableWithoutFeedback>

      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Image
          source={require("../assets/filterSlider.png")}
          style={styles.filterImage}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Search;

// ─────────────────────────────────────────────────────────────────────────────
const getStyles = (colors, spacing, radius, typography) =>
  StyleSheet.create({
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 51,
      gap: spacing.xl,
    },

    inputWrapper: {
      flex: 1,
      height: 51,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: radius.md,
      borderColor: colors.dividerWeak,
      borderWidth: 1,
    },

    searchIcon: {
      width: 20,
      height: 19,
      marginLeft: spacing.lg,
    },

    input: {
      flex: 1,
      fontSize: typography.size.md,
      fontFamily: typography.font.regular,
      fontWeight: "400",
      marginLeft: spacing.sm + 1,
      color: colors.textPrimary,
      padding: 0, // reset default vertical padding on Android
    },

    filterButton: {
      width: 51,
      height: 51,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      // solid shadowColor — opacity via shadowOpacity
      shadowColor: colors.shadowCard,
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.25,
      shadowRadius: 30,
      elevation: 20,
      justifyContent: "center",
      alignItems: "center",
    },

    filterImage: {
      width: 18,
      height: 18.28,
    },
  });
