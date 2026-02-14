import React from "react";
import { useDrawerStatus } from "@react-navigation/drawer";
import BottomNav from "../../components/BottomNav";
import { router } from "expo-router";
import { DeviceEventEmitter } from "react-native";

const ManagedBottomNav = ({ activeTab }) => {
  const isDrawerOpen = useDrawerStatus() === "open";

  // If drawer is open, we hide the bottom nav completely
  if (isDrawerOpen) return null;

  return (
    <BottomNav
      activeTab={activeTab}
      onChange={(tab) => {
        const route = tab === "home" ? "/" : `/screens/${tab}`;
        router.push(route);
      }}
      onReselect={(tab) => {
        DeviceEventEmitter.emit("SCROLL_TO_TOP", { tab });
      }}
    />
  );
};
export default ManagedBottomNav;
