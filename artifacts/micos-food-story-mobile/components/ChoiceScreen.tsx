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
import type { ChoiceOption, ChoicePageData } from "@/data/pages";

function ChoiceCard({
  option,
  onSelect,
}: {
  option: ChoiceOption;
  onSelect: (opt: ChoiceOption) => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    scale.value = withSequence(
      withTiming(0.94, { duration: 80 }),
      withSpring(1, { damping: 10 })
    );
    setTimeout(() => onSelect(option), 140);
  }, [scale, onSelect, option]);

  return (
    <Animated.View style={[styles.cardWrap, animStyle]}>
      <Pressable
        onPress={handlePress}
        style={[styles.card, { backgroundColor: option.bgColor }]}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.choiceEmoji}>{option.emoji}</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.choiceLabel, { color: "#FFFFFF" }]}>
            {option.label}
          </Text>
          <Text style={[styles.choiceDesc, { color: "rgba(255,255,255,0.8)" }]}>
            {option.description}
          </Text>
        </View>
        <View style={[styles.arrowCircle, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
          <Text style={{ color: "#fff", fontSize: 18 }}>→</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

interface ChoiceScreenProps {
  page: ChoicePageData;
  onSelect: (targetPage: string, choiceId: string) => void;
  onBack: () => void;
}

export function ChoiceScreen({ page, onSelect, onBack }: ChoiceScreenProps) {
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

        <Text style={styles.micoEmoji}>🧒</Text>

        <View style={[styles.questionBubble, { backgroundColor: colors.card }]}>
          <Text style={[styles.questionText, { color: colors.cardForeground }]}>
            {page.question}
          </Text>
        </View>

        <Text style={[styles.chooseHint, { color: colors.mutedForeground }]}>
          Where should Mico go?
        </Text>

        <View style={styles.options}>
          {page.options.map((opt) => (
            <ChoiceCard
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
    marginBottom: 20,
  },
  backText: {
    fontSize: 15,
    fontFamily: "Fredoka_500Medium",
  },
  micoEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  questionBubble: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    maxWidth: "90%",
  },
  questionText: {
    fontSize: 20,
    fontFamily: "Fredoka_600SemiBold",
    textAlign: "center",
    lineHeight: 28,
  },
  chooseHint: {
    fontSize: 14,
    fontFamily: "Fredoka_400Regular",
    marginBottom: 24,
  },
  options: {
    width: "100%",
    gap: 14,
  },
  cardWrap: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 14,
  },
  cardLeft: {
    width: 56,
    alignItems: "center",
  },
  choiceEmoji: {
    fontSize: 42,
  },
  cardRight: {
    flex: 1,
  },
  choiceLabel: {
    fontSize: 21,
    fontFamily: "Fredoka_700Bold",
    marginBottom: 2,
  },
  choiceDesc: {
    fontSize: 13,
    fontFamily: "Fredoka_400Regular",
    lineHeight: 18,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
