import React, { useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '../../components/CustomDrawer';
import { View, StyleSheet } from 'react-native';
import BottomNav from "../../components/BottomNav";
import { router, usePathname } from 'expo-router';
import Header from '../../components/Header';
import { DeviceEventEmitter } from 'react-native';

export default function MainLayout() {

    const pathname = usePathname();

    // Logic to determine which tab is active based on the URL
    const activeTab = pathname.includes('favorite') ? 'favorite' :
        pathname.includes('cart') ? 'cart' :
            pathname.includes('location') ? 'location' : 'home';
    return (
        <View style={styles.outerContainer}>
            <View style={styles.drawerWrapper}>
                <Drawer
                    drawerContent={(props) => <CustomDrawer {...props} />}
                    screenOptions={{
                        headerShown: false, drawerStyle: {
                            width: '50%',
                            backgroundColor: '#fff', // Important for seeing the background
                        },
                        sceneContainerStyle: {
                            backgroundColor: '#fff',
                        },
                        overlayColor: 'transparent',
                    }}
                >
                    <Drawer.Screen name="index" options={{ title: 'Home' }} />
                    <Drawer.Screen name="screens/favorite" options={{ title: 'Favorite' }} />
                    <Drawer.Screen name="screens/location" options={{ title: 'Location' }} />
                    <Drawer.Screen name="screens/cart" options={{ title: 'Cart' }} />
                </Drawer>
            </View>
            <BottomNav
                activeTab={activeTab}
                onChange={(tab) => {
                    const route = tab === "home" ? "/" : `/screens/${tab}`;
                    router.push(route);
                }}
                onReselect={(tab) => {
                    // Emit a global event that the current page can listen for
                    DeviceEventEmitter.emit('SCROLL_TO_TOP', { tab });
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    drawerWrapper: {
        flex: 1, // This forces the Drawer to take all available space, pushing the Nav down
    },
});