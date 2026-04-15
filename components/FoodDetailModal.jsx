import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
const FoodDetailModal = ({
  visible,
  onClose,
  selectedItem,
  selectedAddon,
  setSelectedAddon,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalFoodTitle}>
                    {selectedItem?.name}
                  </Text>
                  <Text style={styles.modalDescription}>
                    {selectedItem?.description}
                  </Text>
                </View>

                <Text style={styles.modalPrice}>${selectedItem?.price}</Text>
              </View>

              <Text style={styles.choiceTitle}>Choice of Add On</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedItem?.addOns?.length > 0 ? (
                  selectedItem.addOns.map((addon, index) => {
                    const isSelected = selectedAddon === index;

                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.addonRow}
                        onPress={() => setSelectedAddon(index)}
                      >
                        <View style={styles.addonLeft}>
                          <Image
                            source={{ uri: addon.image }}
                            style={styles.addonImage}
                          />
                          <Text style={styles.font}>{addon.name}</Text>
                        </View>

                        <View style={styles.addonRight}>
                          <Text style={styles.font}>+${addon.price}</Text>

                          <View
                            style={[
                              styles.radioOuter,
                              isSelected && styles.radioOuterActive,
                            ]}
                          >
                            {isSelected && <View style={styles.radioInner} />}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={{ color: "#888" }}>No add-ons available.</Text>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.closeModalBtn} onPress={onClose}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FoodDetailModal;
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end", //  THIS pushes modal to bottom
  },

  modalContainer: {
    backgroundColor: "#fff",
    boxShadow: "0 -6px 13px rgba(184, 184, 184, 0.21)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    height: "40%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 20,
  },

  modalFoodTitle: {
    fontFamily: "Adamina-Regular",
    fontSize: 24,
    fontWeight: "600",
  },

  modalDescription: {
    fontFamily: "Adamina-Regular",
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 4,
  },

  modalPrice: {
    fontFamily: "Adamina-Regular",
    fontSize: 22,
    fontWeight: "600",
    color: "#FE724C",
  },

  choiceTitle: {
    fontFamily: "Adamina-Regular",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },

  addonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  addonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  font: {
    fontFamily: "Adamina-Regular",
    fontSize: 14,
  },

  addonRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  addonImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },

  radioOuterActive: {
    borderColor: "#FE724C",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FE724C",
  },
  closeModalBtn: {
    alignSelf: "center",
    backgroundColor: "#FE724C",
    width: "248",
    height: "60",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  doneText: {
    fontFamily: "Adamina-Regular",
    fontSize: 15,
    color: "#FFF",
  },
});
