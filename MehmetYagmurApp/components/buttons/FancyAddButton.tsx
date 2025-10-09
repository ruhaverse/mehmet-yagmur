import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "../../config/colors";

interface FancyAddButtonProps {
  style?: any;
  sizeRatio?: number;
  onPress?: () => void;
}

export default function FancyAddButton({ 
  style, 
  sizeRatio = 1,
  onPress 
}: FancyAddButtonProps) {
  const buttonSize = 56 * sizeRatio;
  const iconSize = 24 * sizeRatio;

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.container, style, { 
        width: buttonSize, 
        height: buttonSize 
      }]}
    >
      <View style={[styles.backShade, {
        width: buttonSize,
        height: buttonSize,
        borderRadius: buttonSize / 2,
        top: 2,
        left: 2,
      }]} />
      <View style={[styles.frontShade, {
        width: buttonSize - 4,
        height: buttonSize - 4,
        borderRadius: (buttonSize - 4) / 2,
      }]} />
      <Text style={[styles.addIcon, { fontSize: iconSize }]}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  backShade: {
    backgroundColor: '#E0E0E0',
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  frontShade: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    position: "absolute",
  },
  addIcon: {
    position: "absolute",
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});