import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

function parseGradientColors(gradient: string): string[] {
  const hexMatches = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (hexMatches && hexMatches.length >= 2) return hexMatches;
  if (hexMatches && hexMatches.length === 1) return [hexMatches[0], hexMatches[0]];
  return ["#2A1B12", "#3D1E10"];
}

interface BackgroundProps {
  bgColor: string;
  children: React.ReactNode;
  style?: object;
}

export function Background({ bgColor, children, style }: BackgroundProps) {
  const colors = parseGradientColors(bgColor);

  return (
    <LinearGradient
      colors={colors as [string, string, ...string[]]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.fill, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
