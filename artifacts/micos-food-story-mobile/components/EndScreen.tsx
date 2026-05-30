import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";
import type { EndPageData } from "@/data/pages";

function parseGradient(gradient: string): [string, string] {
  const hex = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (hex && hex.length >= 2) return [hex[0], hex[1]];
  if (hex && hex.length === 1) return [hex[0], hex[0]];
  return ["#2A1B12", "#3D1E10"];
}

interface EndScreenProps {
  page: EndPageData;
  onRestart: () => void;
}

export function EndScreen({ page, onRestart }: EndScreenProps) {
  const colors = useColors();
  const [c1, c2] = parseGradient(page.bgColor);

  const charScale = useSharedValue(0);
  const charBounce = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const textOpacity = useSharedValue(0);
  const btnScale = useSharedValue(0.8);

  useEffect(() => {
    charScale.value = withDelay(200, withSpring(1, { damping: 8 }));
    charBounce.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: 500 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      )
    );
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(400, withSpring(0, { damping: 12 }));
    textOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
    btnScale.value = withDelay(1000, withSpring(1, { damping: 10 }));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const charStyle = useAnimatedStyle(() => ({
    transform: [{ scale: charScale.value }, { translateY: charBounce.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleRestart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRestart();
  }, [onRestart]);

  return (
    <LinearGradient
      colors={[c1, c2]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.starsRow}>
          {["⭐", "🌟", "✨", "⭐", "🌟"].map((s, i) => (
            <Text key={i} style={styles.star}>{s}</Text>
          ))}
        </View>

        <Animated.Text style={[styles.charEmoji, charStyle]}>
          {page.characterEmoji}
        </Animated.Text>

        <Animated.Text style={[styles.title, { color: colors.primary }, titleStyle]}>
          {page.title}
        </Animated.Text>

        <Animated.View
          style={[styles.panel, { backgroundColor: "rgba(0,0,0,0.35)" }, textStyle]}
        >
          <Text style={[styles.endText, { color: "#FFFDF4" }]}>{page.text}</Text>
        </Animated.View>

        <Animated.View style={btnStyle}>
          <Pressable
            onPress={handleRestart}
            style={[styles.restartBtn, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="refresh" size={22} color={colors.primaryForeground} />
            <Text style={[styles.restartText, { color: colors.primaryForeground }]}>
              Play Again
            </Text>
          </Pressable>
        </Animated.View>

        <Text style={[styles.shareHint, { color: "rgba(255,253,244,0.55)" }]}>
          Great job finishing Mico's adventure! 🎉
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
  },
  starsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 20,
  },
  star: {
    fontSize: 22,
  },
  charEmoji: {
    fontSize: 90,
    marginBottom: 16,
  },
  title: {
    fontSize: 38,
    fontFamily: "Fredoka_700Bold",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 46,
  },
  panel: {
    width: "100%",
    borderRadius: 20,
    padding: 22,
    marginBottom: 28,
  },
  endText: {
    fontSize: 17,
    fontFamily: "Fredoka_400Regular",
    lineHeight: 26,
    textAlign: "center",
  },
  restartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 40,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  restartText: {
    fontSize: 20,
    fontFamily: "Fredoka_600SemiBold",
  },
  shareHint: {
    fontSize: 14,
    fontFamily: "Fredoka_400Regular",
    textAlign: "center",
  },
});
