import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    Pressable,
    Animated,
    Easing,
} from "react-native";

const FoodSliderItem = ({ item, index, isActive, onPress }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isActive ? 1 : 0,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false, // required for color animation
        }).start();
    }, [isActive]);

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#ffffff", "#F47C5C"],
    });

    const textColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#F47C5C", "#ffffff"],
    });

    const scale = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.06],
    });

    return (
        <Pressable onPress={onPress}>
            <Animated.View
                style={[
                    styles.card,
                    {
                        backgroundColor,
                        transform: [{ scale }],
                        shadowColor: isActive ? "#F47C5C" : "#00000010",
                    },
                ]}
            >
                <Image source={item.image} style={styles.image} />
                <Animated.Text style={[styles.title, { color: textColor }]}>
                    {item.title}
                </Animated.Text>
            </Animated.View>
        </Pressable>
    );
};

const FoodSlider = ({ data, style, onSelect }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleSelect = (item, index) => {
        if (activeIndex === index) {
            setActiveIndex(null);
            onSelect && onSelect(null);
        } else {
            setActiveIndex(index);
            onSelect && onSelect(item);
        }
    };

    return (
        <Pressable
            onPress={() => {
                setActiveIndex(null);
                onSelect && onSelect(null);
            }}
        >
            <FlatList
                data={data}
                style={style}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 25 }}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <FoodSliderItem
                        item={item}
                        index={index}
                        isActive={index === activeIndex}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleSelect(item, index);
                        }}
                    />
                )}
            />
        </Pressable>
    );
};

export default FoodSlider;

const styles = StyleSheet.create({
    card: {
        width: 58,
        height: 98,
        borderRadius: 30,
        marginRight: 15,
        alignItems: "center",
        paddingVertical: 10,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
        marginTop: 20,
        marginBottom: 20,
        paddingTop: 4,
    },

    image: {
        width: 49,
        height: 49,
        borderRadius: 50,
    },

    title: {
        marginTop: 12,
        fontSize: 11,
        fontWeight: "500",
        fontFamily: "Adamina-Regular",
    },
});
