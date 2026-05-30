import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
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
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";
import type { FeedbackPageData, StoryItem } from "@/data/pages";

function parseGradient(gradient: string): [string, string] {
  const hex = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (hex && hex.length >= 2) return [hex[0], hex[1]];
  if (hex && hex.length === 1) return [hex[0], hex[0]];
  return ["#2A1B12", "#3D1E10"];
}

function AnimatedItem({ item, index }: { item: StoryItem; index: number }) {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(index * 120, withSpring(0, { damping: 12 }));
    opacity.value = withDelay(index * 120, withTiming(1, { duration: 300 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.itemBubble, animStyle]}>
      <Text style={styles.itemEmoji}>{item.emoji}</Text>
      <Text style={styles.itemLabel}>{item.label}</Text>
    </Animated.View>
  );
}

interface FeedbackScreenProps {
  page: FeedbackPageData;
  chosenItems: StoryItem[];
  onNext: () => void;
  onBack: () => void;
  narrationEnabled: boolean;
}

export function FeedbackScreen({
  page,
  chosenItems,
  onNext,
  onBack,
  narrationEnabled,
}: FeedbackScreenProps) {
  const colors = useColors();
  const [c1, c2] = parseGradient(page.bgColor);
  const charScale = useSharedValue(0.6);
  const charOpacity = useSharedValue(0);

  useEffect(() => {
    charScale.value = withSpring(1, { damping: 10 });
    charOpacity.value = withTiming(1, { duration: 400 });

    if (narrationEnabled && chosenItems.length > 0) {
      const itemNames = chosenItems.map((i) => i.label).join(", ");
      const text = `${page.dynamicPrefix} ${itemNames}. ${page.staticText}`;
      Speech.stop();
      Speech.speak(text, { language: "en-US", pitch: 1.1, rate: 0.85 });
    }
    return () => Speech.stop();
  }, [page.id]);

  const charStyle = useAnimatedStyle(() => ({
    transform: [{ scale: charScale.value }],
    opacity: charOpacity.value,
  }));

  const handleCharPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    charScale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withSpring(1, { damping: 8 })
    );
  }, [charScale]);

  const chosenNames = chosenItems.map((i) => i.label).join(", ");

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
        <Pressable onPress={handleCharPress}>
          <Animated.Text style={[styles.charEmoji, charStyle]}>
            {page.characterEmoji}
          </Animated.Text>
        </Pressable>

        <View style={[styles.panel, { backgroundColor: "rgba(0,0,0,0.35)" }]}>
          <Text style={[styles.feedbackText, { color: "#FFFDF4" }]}>
            <Text style={styles.prefix}>{page.dynamicPrefix} </Text>
            {chosenNames.length > 0 ? (
              <Text style={[styles.chosenNames, { color: colors.primary }]}>
                {chosenNames}
              </Text>
            ) : (
              <Text style={[styles.chosenNames, { color: colors.mutedForeground }]}>
                nothing yet
              </Text>
            )}
            {page.staticText ? <Text>{"  "}{page.staticText}</Text> : null}
          </Text>
        </View>

        {chosenItems.length > 0 && (
          <View style={styles.itemsRow}>
            {chosenItems.map((item, i) => (
              <AnimatedItem key={item.id} item={item} index={i} />
            ))}
          </View>
        )}

        <Text style={[styles.prompt, { color: "rgba(255,253,244,0.75)" }]}>
          {page.dragPrompt}
        </Text>
      </ScrollView>

      <View style={[styles.navBar, { backgroundColor: "rgba(0,0,0,0.3)" }]}>
        <Pressable onPress={onBack} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={28} color="#FFFDF4" />
        </Pressable>
        <Pressable
          onPress={onNext}
          style={[styles.nextBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.nextText, { color: colors.primaryForeground }]}>
            Next
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primaryForeground} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 110,
    alignItems: "center",
  },
  charEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  panel: {
    width: "100%",
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
  },
  feedbackText: {
    fontSize: 19,
    fontFamily: "Fredoka_400Regular",
    lineHeight: 28,
    textAlign: "center",
  },
  prefix: {
    fontFamily: "Fredoka_400Regular",
  },
  chosenNames: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 19,
  },
  itemsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginBottom: 16,
  },
  itemBubble: {
    alignItems: "center",
    backgroundColor: "rgba(255,253,244,0.15)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  itemEmoji: {
    fontSize: 32,
  },
  itemLabel: {
    fontSize: 12,
    fontFamily: "Fredoka_500Medium",
    color: "#FFFDF4",
  },
  prompt: {
    fontSize: 14,
    fontFamily: "Fredoka_400Regular",
    textAlign: "center",
    marginTop: 8,
  },
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  nextText: {
    fontSize: 17,
    fontFamily: "Fredoka_600SemiBold",
  },
});
