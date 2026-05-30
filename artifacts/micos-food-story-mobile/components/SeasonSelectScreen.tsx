import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
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
import type { SeasonSelectPageData, SeasonOption } from "@/data/pages";

function parseGradient(gradient: string): [string, string] {
  const hex = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (hex && hex.length >= 2) return [hex[0], hex[1]];
  if (hex && hex.length === 1) return [hex[0], hex[0]];
  return ["#4A2E1A", "#2A1B12"];
}

function SeasonCard({
  option,
  onSelect,
}: {
  option: SeasonOption;
  onSelect: (opt: SeasonOption) => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const [c1, c2] = parseGradient(option.bgColor);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withTiming(0.95, { duration: 80 }),
      withSpring(1, { damping: 10 })
    );
    setTimeout(() => onSelect(option), 150);
  }, [scale, onSelect, option]);

  return (
    <Animated.View style={[styles.cardWrap, animStyle]}>
      <Pressable onPress={handlePress} style={styles.cardPressable}>
        <LinearGradient
          colors={[c1, c2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.seasonEmoji}>{option.emoji}</Text>
          <View style={styles.cardText}>
            <Text style={[styles.seasonLabel, { color: "#FFFFFF" }]}>
              {option.label}
            </Text>
            <Text style={[styles.seasonDesc, { color: "rgba(255,255,255,0.85)" }]}>
              {option.description}
            </Text>
          </View>
          <View style={[styles.arrowBadge, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
            <Text style={{ fontSize: 18, color: "#fff" }}>→</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

interface SeasonSelectScreenProps {
  page: SeasonSelectPageData;
  onSelect: (targetPage: string, seasonId: string) => void;
  onBack: () => void;
}

export function SeasonSelectScreen({ page, onSelect, onBack }: SeasonSelectScreenProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.mutedForeground }]}>← Back</Text>
        </Pressable>

        <Text style={[styles.micoIcon]}>🧒</Text>
        <Text style={[styles.question, { color: colors.foreground }]}>
          {page.question}
        </Text>
        <Text style={[styles.subHint, { color: colors.mutedForeground }]}>
          Pick a season to begin your story
        </Text>

        <View style={styles.cards}>
          {page.options.map((opt) => (
            <SeasonCard
              key={opt.id}
              option={opt}
              onSelect={(o) => onSelect(o.targetPage, o.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    paddingTop: 16,
    alignItems: "center",
  },
  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  backText: {
    fontSize: 15,
    fontFamily: "Fredoka_500Medium",
  },
  micoIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  question: {
    fontSize: 28,
    fontFamily: "Fredoka_700Bold",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 8,
  },
  subHint: {
    fontSize: 15,
    fontFamily: "Fredoka_400Regular",
    textAlign: "center",
    marginBottom: 28,
  },
  cards: {
    width: "100%",
    gap: 14,
  },
  cardWrap: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  cardPressable: {
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 20,
    gap: 16,
  },
  seasonEmoji: {
    fontSize: 44,
  },
  cardText: {
    flex: 1,
  },
  seasonLabel: {
    fontSize: 22,
    fontFamily: "Fredoka_700Bold",
    marginBottom: 2,
  },
  seasonDesc: {
    fontSize: 14,
    fontFamily: "Fredoka_400Regular",
  },
  arrowBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
