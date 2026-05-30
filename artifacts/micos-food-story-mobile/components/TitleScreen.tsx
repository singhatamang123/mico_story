import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef } from "react";
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
import type { TitlePageData } from "@/data/pages";

interface TitleScreenProps {
  page: TitlePageData;
  onNext: () => void;
}

function FlipCard({ emoji, backEmoji, color }: { emoji: string; backEmoji: string; color: string }) {
  const flipped = useRef(false);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 400 },
      { rotateY: `${rotateY.value}deg` },
      { scale: scale.value },
    ],
    backfaceVisibility: "hidden",
    opacity: rotateY.value > 90 ? 0 : 1,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 400 },
      { rotateY: `${rotateY.value + 180}deg` },
      { scale: scale.value },
    ],
    backfaceVisibility: "hidden",
    opacity: rotateY.value > 90 ? 1 : 0,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }));

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flipped.current = !flipped.current;
    rotateY.value = withSpring(flipped.current ? 180 : 0, { damping: 12 });
    scale.value = withSequence(
      withTiming(0.88, { duration: 80 }),
      withSpring(1, { damping: 10 })
    );
  }, [rotateY, scale]);

  return (
    <Pressable onPress={handlePress} style={[styles.flipCard, { backgroundColor: color }]}>
      <Animated.View style={[styles.flipCardInner, frontStyle]}>
        <Text style={styles.flipEmoji}>{emoji}</Text>
      </Animated.View>
      <Animated.View style={[styles.flipCardInner, backStyle, { backgroundColor: color }]}>
        <Text style={styles.flipEmoji}>{backEmoji}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function TitleScreen({ page, onNext }: TitleScreenProps) {
  const colors = useColors();
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleStart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    buttonScale.value = withSequence(
      withTiming(0.93, { duration: 80 }),
      withSpring(1, { damping: 10 })
    );
    setTimeout(() => onNext(), 150);
  }, [buttonScale, onNext]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: colors.accent }]}>
            <Text style={[styles.badgeText, { color: colors.accentForeground }]}>
              ✦ Interactive Storybook
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.primary }]}>
          Mico's{"\n"}Food Story
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {page.subtitle}
        </Text>

        <View style={styles.cardsRow}>
          {page.flipCards.map((card, i) => (
            <FlipCard
              key={i}
              emoji={card.emoji}
              backEmoji={card.backEmoji}
              color={card.color}
            />
          ))}
        </View>

        <Text style={[styles.tapHint, { color: colors.mutedForeground }]}>
          Tap the cards to peek inside!
        </Text>

        <Animated.View style={buttonStyle}>
          <Pressable
            style={[styles.startButton, { backgroundColor: colors.primary }]}
            onPress={handleStart}
            accessibilityRole="button"
            accessibilityLabel="Begin the story"
          >
            <Text style={[styles.startButtonText, { color: colors.primaryForeground }]}>
              Begin Adventure
            </Text>
            <Ionicons name="arrow-forward" size={22} color={colors.primaryForeground} />
          </Pressable>
        </Animated.View>

        <View style={styles.characterRow}>
          <Text style={styles.micoEmoji}>🧒</Text>
          <View style={[styles.speechBubble, { backgroundColor: colors.card }]}>
            <Text style={[styles.speechText, { color: colors.cardForeground }]}>
              Let's go on a food adventure!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 20,
    alignItems: "center",
  },
  topRow: {
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Fredoka_500Medium",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 52,
    fontFamily: "Fredoka_700Bold",
    textAlign: "center",
    lineHeight: 58,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Fredoka_400Regular",
    textAlign: "center",
    marginBottom: 36,
    lineHeight: 22,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  flipCard: {
    width: 90,
    height: 90,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  flipCardInner: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  flipEmoji: {
    fontSize: 40,
  },
  tapHint: {
    fontSize: 13,
    fontFamily: "Fredoka_400Regular",
    marginBottom: 36,
  },
  startButton: {
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
    marginBottom: 40,
  },
  startButtonText: {
    fontSize: 20,
    fontFamily: "Fredoka_600SemiBold",
  },
  characterRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  micoEmoji: {
    fontSize: 52,
  },
  speechBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  speechText: {
    fontSize: 14,
    fontFamily: "Fredoka_500Medium",
    lineHeight: 20,
  },
});
