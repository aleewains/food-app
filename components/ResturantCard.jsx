import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Star, Heart, Bike, Clock, CheckCircle } from "lucide-react-native";

const CARD_WIDTH = "100%";
const CARD_HEIGHT = 229;
const IMAGE_HEIGHT = 136;

const RestaurantCard = ({
  name,
  rating,
  reviewCount,
  deliveryTime,
  deliveryFee,
  isVerified,
  imageUrl,
  tags = [],
  isFavorite,
  onPressFavorite,
  onPressCard,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPressCard}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: "white",
        borderRadius: 20,
        marginTop: 5,
        marginBottom: 20,
        overflow: "hidden",
        alignSelf: "center",
        elevation: 8,
        shadowColor: "#D3D1D840",
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      {/* IMAGE SECTION */}
      <View style={{ width: CARD_WIDTH, height: IMAGE_HEIGHT }}>
        <Image
          source={imageUrl}
          style={{
            width: "100%",
            height: "100%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />

        {/* Rating badge */}
        <View
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "white",
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              marginRight: 6,
              fontFamily: "Adamina-Regular",
              fontWeight: "400",
              lineHeight: "100%",
            }}
          >
            {rating}
          </Text>

          <Star size={13} color="#FFC529" fill="#FFC529" />

          <Text
            style={{
              fontSize: 12,
              marginLeft: 6,
              color: "#9796A1",
              fontWeight: "400",
              fontFamily: "Adamina-Regular",
            }}
          >
            ({reviewCount}+)
          </Text>
        </View>

        {/* Heart Button */}
        <TouchableOpacity
          onPress={onPressFavorite}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "#FE724C",
            padding: 10,
            borderRadius: 100,
            elevation: 5,
          }}
        >
          <Heart
            size={20}
            color={isFavorite ? "#FFFFFF" : "red"}
            fill={isFavorite ? "#FFFFFF" : "red"}
          />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 5,
          width: 246.62,
          height: 67,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#000000",
              fontWeight: "400",
              fontFamily: "Adamina-Regular",
            }}
          >
            {name}
          </Text>

          {isVerified && (
            <CheckCircle
              size={18}
              color="white"
              fill="#10b981"
              style={{ marginLeft: 6 }}
            />
          )}
        </View>

        {/* Delivery info */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 0,
          }}
        >
          {/* Free delivery */}
          {deliveryFee !== undefined && deliveryFee !== null && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 6,
              }}
            >
              <Bike size={18} color="#ff7043" />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 12,
                  color: "#7E8392",
                  fontWeight: "400",
                  fontWeight: "400",
                  fontFamily: "Adamina-Regular",
                }}
              >
                {deliveryFee === 0 ? (
                  <Text>Free Delivery</Text>
                ) : (
                  <Text>{deliveryFee}</Text>
                )}
              </Text>
            </View>
          )}

          {/* Delivery time */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Clock size={18} color="#ff7043" />
            <Text
              style={{
                marginLeft: 6,
                fontSize: 12,
                color: "#7E8392",
                fontWeight: "500",
                fontWeight: "400",
                fontFamily: "Adamina-Regular",
              }}
            >
              {deliveryTime}
            </Text>
          </View>
        </View>

        {/* TAGS */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            gap: 10,
          }}
        >
          {tags.map((tag, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#F6F6F6",
                paddingVertical: 6,
                paddingHorizontal: 14,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: "#8A8E9B",
                  fontWeight: "600",
                  fontWeight: "400",
                  fontFamily: "Adamina-Regular",
                  fontSize: 12,
                }}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;
