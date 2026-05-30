import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
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
import type { ActivityPageData, StoryItem } from "@/data/pages";

function parseGradient(gradient: string): [string, string] {
  const hex = gradient.match(/#[0-9A-Fa-f]{6}/g);
  if (hex && hex.length >= 2) return [hex[0], hex[1]];
  if (hex && hex.length === 1) return [hex[0], hex[0]];
  return ["#2A1B12", "#3D1E10"];
}

function ItemCard({
  item,
  selected,
  disabled,
  onToggle,
}: {
  item: StoryItem;
  selected: boolean;
  disabled: boolean;
  onToggle: (id: string) => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    if (disabled && !selected) return;
    Haptics.impactAsync(
      selected ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    );
    scale.value = withSequence(
      withTiming(0.88, { duration: 80 }),
      withSpring(1, { damping: 10 })
    );
    onToggle(item.id);
  }, [disabled, selected, scale, onToggle, item.id]);

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.itemCard,
          {
            backgroundColor: selected ? colors.primary : colors.card,
            borderWidth: 2,
            borderColor: selected ? colors.primary : "transparent",
            opacity: disabled && !selected ? 0.45 : 1,
          },
        ]}
      >
        <Text style={styles.itemEmoji}>{item.emoji}</Text>
        <Text
          style={[
            styles.itemLabel,
            {
              color: selected ? colors.primaryForeground : colors.cardForeground,
            },
          ]}
          numberOfLines={2}
        >
          {item.label}
        </Text>
        {selected && (
          <View style={[styles.checkBadge, { backgroundColor: "rgba(0,0,0,0.2)" }]}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

interface ActivityScreenProps {
  page: ActivityPageData;
  selectedIds: string[];
  onToggle: (category: string, itemId: string) => void;
  onClear: (category: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ActivityScreen({
  page,
  selectedIds,
  onToggle,
  onClear,
  onNext,
  onBack,
}: ActivityScreenProps) {
  const colors = useColors();
  const [c1, c2] = parseGradient(page.bgColor);
  const canContinue = selectedIds.length > 0;
  const atMax = selectedIds.length >= page.maxItems;

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
        <View style={[styles.header, { backgroundColor: "rgba(0,0,0,0.35)" }]}>
          <Text style={[styles.title, { color: "#FFFDF4" }]}>{page.title}</Text>
          <Text style={[styles.instruction, { color: "rgba(255,253,244,0.85)" }]}>
            {page.instruction}
          </Text>
          <View style={styles.countRow}>
            <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.countText, { color: colors.primaryForeground }]}>
                {selectedIds.length} / {page.maxItems} chosen
              </Text>
            </View>
            {selectedIds.length > 0 && (
              <Pressable
                onPress={() => onClear(page.category)}
                style={styles.clearBtn}
              >
                <Text style={[styles.clearText, { color: "rgba(255,253,244,0.7)" }]}>
                  Clear all
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.grid}>
          {page.items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              selected={selectedIds.includes(item.id)}
              disabled={atMax}
              onToggle={(id) => onToggle(page.category, id)}
            />
          ))}
        </View>

        {selectedIds.length > 0 && (
          <View style={[styles.tray, { backgroundColor: "rgba(0,0,0,0.3)" }]}>
            <Text style={[styles.trayLabel, { color: "rgba(255,253,244,0.7)" }]}>
              {page.dropLabel}
            </Text>
            <View style={styles.trayItems}>
              {selectedIds.map((id) => {
                const item = page.items.find((i) => i.id === id);
                return item ? (
                  <Text key={id} style={styles.trayEmoji}>
                    {item.emoji}
                  </Text>
                ) : null;
              })}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.navBar, { backgroundColor: "rgba(0,0,0,0.3)" }]}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#FFFDF4" />
        </Pressable>
        <Pressable
          onPress={canContinue ? onNext : undefined}
          style={[
            styles.nextBtn,
            {
              backgroundColor: canContinue ? colors.primary : "rgba(255,255,255,0.2)",
            },
          ]}
        >
          <Text
            style={[
              styles.nextText,
              { color: canContinue ? colors.primaryForeground : "rgba(255,255,255,0.5)" },
            ]}
          >
            {canContinue ? "Let's Go!" : "Pick something first"}
          </Text>
          {canContinue && (
            <Ionicons name="chevron-forward" size={20} color={colors.primaryForeground} />
          )}
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 110,
  },
  header: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontFamily: "Fredoka_700Bold",
    marginBottom: 6,
  },
  instruction: {
    fontSize: 15,
    fontFamily: "Fredoka_400Regular",
    lineHeight: 22,
    marginBottom: 10,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  countText: {
    fontSize: 13,
    fontFamily: "Fredoka_600SemiBold",
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearText: {
    fontSize: 13,
    fontFamily: "Fredoka_400Regular",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginBottom: 16,
  },
  itemCard: {
    width: 100,
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    position: "relative",
  },
  itemEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  itemLabel: {
    fontSize: 11,
    fontFamily: "Fredoka_500Medium",
    textAlign: "center",
    lineHeight: 14,
  },
  checkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tray: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  trayLabel: {
    fontSize: 13,
    fontFamily: "Fredoka_400Regular",
    marginBottom: 8,
  },
  trayItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  trayEmoji: {
    fontSize: 32,
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
  backBtn: {
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
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
  },
  nextText: {
    fontSize: 16,
    fontFamily: "Fredoka_600SemiBold",
  },
});
