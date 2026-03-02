import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Heart, Star, Plus, Minus } from "lucide-react-native";

const ItemCard = ({
  item,
  count,
  isFav,
  onUpdateCount,
  onToggleFav,
  onAddOns,
  onPressCard,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPressCard}
      activeOpacity={0.8}
    >
      {/* Favorite Heart */}
      <TouchableOpacity style={styles.heartAction} onPress={onToggleFav}>
        <Heart
          size={20}
          color={isFav ? "#FE724C" : "#D3D1D8"}
          fill={isFav ? "#FE724C" : "transparent"}
        />
      </TouchableOpacity>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{item.name}</Text>
          </View>

          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>
            <Text style={styles.currency}>$</Text>
            {item.price}
          </Text>

          {onUpdateCount ? (
            <View style={styles.actions}>
              {/* Counter Section */}
              <View style={styles.counterGroup}>
                <TouchableOpacity
                  onPress={() => onUpdateCount(-1)}
                  style={styles.btnSmall}
                >
                  <Minus size={14} color="#FE724C" />
                </TouchableOpacity>
                <Text style={styles.countText}>{count}</Text>
                <TouchableOpacity
                  onPress={() => onUpdateCount(1)}
                  style={[styles.btnSmall, styles.btnOrange]}
                >
                  <Plus size={14} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Add-ons Button */}
              <TouchableOpacity onPress={onAddOns} style={styles.addonBtn}>
                <Text style={styles.addonText}>+ Add-ons</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    // padding: 12,
    marginBottom: 20,
    flexDirection: "row",
    shadowColor: "#00000041",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
    overflow: "hidden",
  },
  heartAction: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    // backgroundColor: "#F6F6F6",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    padding: 12,
    paddingLeft: 4,
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 25, // Space for heart
  },
  title: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    // fontWeight: "bold",
    color: "#323643",
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#111719",
    marginLeft: 4,
    fontWeight: "600",
  },
  desc: {
    // backgroundColor: "red",
    fontFamily: "Adamina-Regular",
    fontSize: 12,
    color: "#9796A1",
    marginVertical: 4,
    lineHeight: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  price: {
    fontFamily: "Adamina-Regular",
    fontSize: 18,
    fontWeight: "600",
    color: "#FE724C",
  },
  currency: {
    fontSize: 14,
    color: "#FE724C",
  },
  actions: {
    // backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
  },
  counterGroup: {
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    padding: 2,
    marginRight: 8,
  },
  btnSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnOrange: {
    backgroundColor: "#FE724C",
  },
  countText: {
    fontFamily: "Adamina-Regular",
    fontSize: 14,
    fontWeight: "400",
    marginHorizontal: 8,
  },
  addonBtn: {
    justifyContent: "center",
    height: 28,
    backgroundColor: "rgba(254, 114, 76, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    boxShadow: "inset 0 0 0 1px #FE724C",
  },
  addonText: {
    fontFamily: "Adamina-Regular",
    color: "#FE724C",
    fontSize: 10,
    fontWeight: "600",
  },
});

export default ItemCard;
