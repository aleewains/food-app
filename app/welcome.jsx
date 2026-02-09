// app/welcome.jsx

import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const welcome = 'has_seen_welcome';
const { height } = Dimensions.get('window');

const handleNavigation = async (route) => {
    await AsyncStorage.setItem(welcome, 'true');
    // Navigate using expo-router
    router.replace(route);
};


export default function WelcomeScreen() {
    return (
        <ImageBackground
            source={require('../assets/bg.png')}
            resizeMode="cover"
            style={styles.backgroundImage}
        >
            <LinearGradient
                colors={[
                    'rgba(73, 77, 99, 0)',   // top – transparent
                    'rgba(25, 27, 47, 0.6)', // mid – semi-dark
                    'rgba(25, 27, 47, 1)',   // bottom – fully dark
                    'rgba(27, 29, 49, 1)'
                ]}
                locations={[0.0, 0.45, 0.9, 1.0]}
                style={styles.gradientOverlay}
            >
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => handleNavigation('/(auth)/logIn')}
                >
                    <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>

                <View style={styles.contentContainer}>

                    <View style={styles.textBlock}>
                        <Text style={styles.welcomeText}>
                            Welcome to
                            <Text style={styles.foodByHomeText}>{'\n'}Food by{'\n'}home</Text>
                        </Text>

                        <Text style={styles.tagline}>
                            Your favourite foods delivered {'\n'}fast at your door.
                        </Text>
                    </View>

                    <View style={styles.spacer} />

                    <View style={styles.signInBlock}>
                        <View style={styles.signInC}>
                            <View style={styles.line} />
                            <Text style={styles.signInWithText}>sign in with</Text>
                            <View style={styles.line} />
                        </View>
                        {/* Sign with email Button */}
                        <TouchableOpacity
                            style={styles.signInEmailButton}
                            onPress={() => handleNavigation('/(auth)/signUp')}
                        >
                            <Text style={styles.signInEmailButtonText}>SignUp with email</Text>
                        </TouchableOpacity>

                        {/* Already have an account? Sign In */}
                        <View style={styles.signUpPrompt}>
                            <Text style={styles.signUpPromptText}>
                                Already have an account?
                                <Text
                                    style={styles.signInLink}
                                    onPress={() => handleNavigation('/(auth)/logIn')}
                                >

                                    Sign In
                                </Text>
                            </Text>
                        </View>
                    </View>

                </View>
            </LinearGradient>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: height > 700 ? 60 : 40, // Responsive padding for notch/status bar area
        paddingBottom: 30,
    },
    skipButton: {
        position: 'absolute',
        top: height > 700 ? 60 : 40,
        right: 25,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
        zIndex: 1,
        shadowColor: "#D3D1D840"
    },
    skipButtonText: {
        fontFamily: 'Adamina-Regular',
        fontSize: 14,
        color: '#FE724C',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    textBlock: {
        marginTop: 120, // Space for the skip button and top image
        alignItems: 'flex-start',


    },
    spacer: {
        flex: 1,

    },
    welcomeText: {
        fontFamily: 'Sora-Bold',
        fontSize: 48,
        fontWeight: "700",
        color: '#111719',
        lineHeight: 43 * 1.28,
        letterSpacing: 0.1 * 43
    },
    foodByHomeText: {
        color: '#FF3600', // Orange accent color
    },
    tagline: {
        fontFamily: 'Adamina-Regular',
        fontSize: 18,
        color: '#30384F',
        marginTop: 1,
        lineHeight: 25,
    },
    signInWithText: {
        fontFamily: 'Adamina-Regular',
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 10,
    },
    signInBlock: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 8,
    },
    signInEmailButton: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.21)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 1)',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,

    },
    signInEmailButtonText: {
        fontFamily: 'Adamina-Regular',
        fontSize: 17,
        color: '#FFFFFF',
    },
    signUpPrompt: {
        width: '100%',
        alignItems: 'center',
    },
    signUpPromptText: {
        fontFamily: 'Adamina-Regular',
        fontSize: 16,
        color: '#D0D0D0',
        marginBottom: 10,
    },
    signInLink: {
        fontFamily: 'Adamina-Regular',
        color: '#FFFFFF', // Orange color for the link
        marginLeft: 4, // Little space between text
        textDecorationLine: "underline"
    },

    signInC: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 0,

    },
    line: {
        // backgroundColor: "white",
        // height: 0.2,
        // width: 100,
        //  borderWidth: 0.1,
        //  borderColor: "white",
        //  top: 7,
        // marginHorizontal: 10,
        // flex: 1,
        height: 0.9,
        width: 90,

        // borderWidth: 0.3,
        // borderColor: "rgba(255, 255, 255, 0.5)",
        backgroundColor: "#FFFFFF80",
        marginHorizontal: 22,
        marginBottom: 13,


    }
});