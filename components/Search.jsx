import React, { useRef } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const Search = ({ search, setSearch, onFilterPress }) => {

    const inputRef = useRef(null);

    const handleContainerPress = () => {
        inputRef.current?.focus();
    };

    return (
        <View style={styles.searchContainer}>
            <TouchableWithoutFeedback onPress={handleContainerPress}>
                <View style={styles.inputWrapper}>

                    <Image
                        source={require("../assets/search.png")}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder="Find for food or restaurant..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </TouchableWithoutFeedback>
            <TouchableOpacity style={styles.filterIcon} onPress={onFilterPress}>
                <Image
                    source={require("../assets/filterSlider.png")}
                    style={styles.filterImage}
                />
            </TouchableOpacity>
        </View>
    )
}

export default Search
const styles = StyleSheet.create({
    searchContainer: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        // alignContent: 'space-between',
        // width: "100%",
        height: 51,
        // backgroundColor: "red",
        // marginBottom: 20,
        gap: 20
    },
    inputWrapper: {
        flex: 1, // Takes up most of the space
        width: 256,
        height: 51,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FCFCFD',
        borderRadius: 10, // Highly rounded corners
        borderColor: "#EFEFEF",
        borderWidth: 1,
        // marginLeft: -12,
        // paddingVertical: 10,
        // paddingRight: 34, // Padding on the right to leave space for the button/gap
        // marginRight: 15, // Space between input and filter button
        // marginBottom: 30,
        // --- Shadow Styles (Based on your previous conversion) ---
        // iOS Shadow
        // shadowColor: '#D3D1D8',
        // shadowOffset: {
        //     width: 0, // Keeping X at 0 for a more centralized shadow effect
        //     height: 4, // Y-offset for depth
        // },
        // shadowOpacity: 0.3,
        // shadowRadius: 8, // A lighter blur radius for a subtle lift

        // Android Shadow
        // elevation: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        fontFamily: "Adamina-Regular",
        fontWeight: 400,
        marginLeft: 9,
        color: '#111719',
        padding: 0, // Important: Reset default vertical padding on Android
    },
    searchIcon: {
        width: 20,
        height: 19,
        marginLeft: 15

    },
    filterIcon: {
        width: 51,
        height: 51,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        shadowColor: "#E9EDF2",
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 0.9,      // 80% opacity becomes around 0.5–0.6
        shadowRadius: 30,        // blur = 30
        elevation: 20,
        justifyContent: "center",
        alignItems: "center"
        // right: -30,
        // alignContent: "center",
        // alignSelf: "center",
        // alignItems: "center"
    },
    filterImage: {
        width: 18,
        height: 18.28,


    },
    filters: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        alignContent: 'center'
    },
});