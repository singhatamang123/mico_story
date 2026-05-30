import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef } from "react";
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
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";
import type { StoryPageData } from "@/data/pages";

function parseGradient(gradient: string): [string, string, ...string[]] {
  const hex = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (hex && hex.length >= 2) return hex as [string, string, ...string[]];
  if (hex && hex.length === 1) return [hex[0], hex[0]];
  return ["#2A1B12", "#3D1E10"];
}

function parsePanelGradient(gradient: string): [string, string] {
  const hex = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (hex && hex.length >= 2) return [hex[0], hex[1]];
  if (hex && hex.length === 1) return [hex[0], hex[0]];
  return ["#4A0E1B", "#6E1229"];
}

interface StoryScreenProps {
  page: StoryPageData;
  onNext: () => void;
  onBack: () => void;
  narrationEnabled: boolean;
}

export function StoryScreen({ page, onNext, onBack, narrationEnabled }: StoryScreenProps) {
  const colors = useColors();
  const charScale = useSharedValue(1);
  const charBounce = useSharedValue(0);
  const [showReaction, setShowReaction] = React.useState(false);

  const charAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: charScale.value },
      { translateY: charBounce.value },
    ],
  }));

  useEffect(() => {
    if (narrationEnabled) {
      Speech.stop();
      Speech.speak(page.text, {
        language: "en-US",
        pitch: 1.1,
        rate: 0.85,
      });
    }
    return () => {
      Speech.stop();
    };
  }, [page.id, narrationEnabled]);

  const handleCharTap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    charScale.value = withSequence(
      withTiming(1.25, { duration: 100 }),
      withSpring(1, { damping: 8 })
    );
    charBounce.value = withSequence(
      withTiming(-18, { duration: 120 }),
      withSpring(0, { damping: 6 })
    );
    setShowReaction(true);
    setTimeout(() => setShowReaction(false), 1800);
  }, [charScale, charBounce]);

  const bgColors = parseGradient(page.bgColor);
  const panelColors = parsePanelGradient(page.panelColor);

  return (
    <LinearGradient
      colors={bgColors}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.characterArea}>
          <Pressable onPress={handleCharTap}>
            <Animated.Text style={[styles.characterEmoji, charAnimStyle]}>
              {page.characterEmoji}
            </Animated.Text>
          </Pressable>
          {showReaction && (
            <View style={[styles.reactionBubble, { backgroundColor: "#FFFDF4" }]}>
              <Text style={[styles.reactionText, { color: "#3D2B1F" }]}>
                {page.tapReaction}
              </Text>
            </View>
          )}
          <Text style={[styles.tapHint, { color: "rgba(255,255,255,0.7)" }]}>
            tap to react
          </Text>
        </View>

        <LinearGradient
          colors={panelColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.storyPanel}
        >
          <Text style={[styles.storyText, { color: "#FFFDF4" }]}>
            {page.text}
          </Text>
        </LinearGradient>
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
            Continue
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
    paddingTop: 24,
    paddingBottom: 100,
    alignItems: "center",
  },
  characterArea: {
    alignItems: "center",
    marginBottom: 24,
    minHeight: 100,
  },
  characterEmoji: {
    fontSize: 72,
  },
  reactionBubble: {
    position: "absolute",
    top: -8,
    right: -60,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    maxWidth: 150,
  },
  reactionText: {
    fontSize: 13,
    fontFamily: "Fredoka_500Medium",
  },
  tapHint: {
    fontSize: 12,
    fontFamily: "Fredoka_400Regular",
    marginTop: 4,
  },
  storyPanel: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  storyText: {
    fontSize: 18,
    fontFamily: "Fredoka_400Regular",
    lineHeight: 28,
    textAlign: "center",
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
