import { StyleSheet, Text, View, TouchableOpacity, Image, adress, profile } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const adress = "4102 Prety View Lane";
    const profile = require("../assets/profile.png");

    const navigation = useNavigation()
    // Using a safer selector check to prevent crashes on initial render
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.sideBar}
                onPress={() => navigation.openDrawer()}
            >
                <View>
                    <View style={
                        {
                            width: 15,
                            height: 0,
                            backgroundColor: "black",
                            borderRadius: 12,
                            borderWidth: 1.3,
                            borderColor: "#111719"
                        }}></View>
                    <View style={{
                        marginTop: 3,
                        width: 10,
                        height: 0,
                        borderRadius: 12,
                        borderWidth: 1.3,
                        borderColor: "#111719"
                    }}></View>

                </View>
            </TouchableOpacity>
            <View style={styles.deliverAdress}>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Text style={styles.deliverTo}>Deliver to</Text>
                    <Image
                        source={require("../assets/arrowDown.png")}
                        style={{ height: 5.25, width: 8, }}
                    />
                </View>
                <Text style={styles.adressTo}>{adress}</Text>
            </View>
            <TouchableOpacity style={styles.profilePhoto}>
                <Image
                    source={profile}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    header: {
        marginTop: 25,
        margin: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sideBar: {
        width: 38,
        height: 38,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        shadowColor: "#E9EDF2",
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 0.9,
        shadowRadius: 30,        // blur = 30
        elevation: 20,
        justifyContent: "center",
        alignItems: "center"

    },
    deliverAdress: {
        // alignContent: "center",
        alignItems: "center",

    },
    deliverTo: {
        fontFamily: "Adamina-Regular",
        fontWeight: "400",
        fontSize: 14,
        lineHeight: "122%",
        color: "#8C9099",
        marginRight: 2

    },
    adressTo: {
        fontFamily: "Adamina-Regular",
        fontWeight: "400",
        fontSize: 15,
        lineHeight: "122%",
        color: "#FE724C"
    },
    profilePhoto: {
        width: 38,
        height: 38,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        shadowColor: "#FFC5294D",
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 0.9,      // 80% opacity becomes around 0.5–0.6
        shadowRadius: 30,        // blur = 30
        elevation: 20,
        justifyContent: "center",
        alignItems: "center"

    },
    profileImage: {
        width: 38,
        height: 38,
        borderRadius: 14
    },
})