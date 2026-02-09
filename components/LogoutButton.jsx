import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native'
import React from 'react'

const LogoutButton = ({ onPress }) => {
    const icon = require("../assets/drawer/logout.png")
    const bg = require("../assets/drawer/logButton.png")

    return (
        <View style={styles.button} onPress={onPress}>
            <Image
                source={bg}
                style={styles.bg}

            />
            <View style={styles.inner}>
                <Image
                    source={icon}
                    style={styles.icon}
                />
                <Text style={styles.text}>Log{"\n"}Out</Text>
            </View>

        </View>
    )
}

export default LogoutButton

const styles = StyleSheet.create({
    button: {
        // backgroundColor: "#FE724C",
        borderRadius: 28.5,

        // shadowColor: "#FE724C",
        // shadowOpacity: 0.2,
        // shadowRadius: 12,
        // elevation: 6,
        // shadowOffset: { height: 10, width: 200 },
        // alignItems: "center",
        width: 117,
        height: 43,
        overflow: 'visible',
        justifyContent: "center",


    },
    bg: {
        position: "absolute",
        marginTop: 12,
        // marginRight: 17,
        marginLeft: -16,
        width: 155,
        height: 95,
    },


    inner: {
        flexDirection: "row",
        alignItems: "center",
    },

    icon: {
        width: 26,
        height: 26,
        marginLeft: 8,
        marginRight: 10,
    },

    text: {
        color: "#FFFFFF",
        fontFamily: "Adamina-Regular",
        fontSize: 16,
    },
})
