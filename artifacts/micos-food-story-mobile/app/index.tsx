import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ActivityScreen } from "@/components/ActivityScreen";
import { ChoiceScreen } from "@/components/ChoiceScreen";
import { EndScreen } from "@/components/EndScreen";
import { FeedbackScreen } from "@/components/FeedbackScreen";
import { SeasonSelectScreen } from "@/components/SeasonSelectScreen";
import { StoryScreen } from "@/components/StoryScreen";
import { TitleScreen } from "@/components/TitleScreen";
import {
  PAGES,
  type ActivityPageData,
  type AnyPageData,
} from "@/data/pages";
import { useColors } from "@/hooks/useColors";
import { useStoryStore } from "@/store/storyStore";

function ControlBar() {
  const colors = useColors();
  const { narrationEnabled, toggleNarration, currentPageId, resetStory } =
    useStoryStore();

  const isTitle = currentPageId === "title";

  return (
    <View
      style={[
        styles.controlBar,
        { backgroundColor: isTitle ? colors.background : "transparent" },
      ]}
    >
      {!isTitle && (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            resetStory();
          }}
          style={[styles.controlBtn, { backgroundColor: "rgba(0,0,0,0.3)" }]}
          accessibilityLabel="Return to start"
        >
          <Ionicons name="home-outline" size={20} color="#FFFDF4" />
        </Pressable>
      )}
      <View style={{ flex: 1 }} />
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          toggleNarration();
        }}
        style={[
          styles.controlBtn,
          {
            backgroundColor: narrationEnabled
              ? colors.primary
              : "rgba(0,0,0,0.3)",
          },
        ]}
        accessibilityLabel={narrationEnabled ? "Disable narration" : "Enable narration"}
      >
        <Ionicons
          name={narrationEnabled ? "volume-high" : "volume-mute"}
          size={20}
          color={narrationEnabled ? colors.primaryForeground : "#FFFDF4"}
        />
      </Pressable>
    </View>
  );
}

export default function StoryContainer() {
  const colors = useColors();
  const {
    currentPageId,
    choices,
    narrationEnabled,
    goToPage,
    addChoice,
    removeChoice,
    clearChoices,
    markPageComplete,
    resetStory,
    setSeason,
    setChosenPath,
  } = useStoryStore();

  const currentPage: AnyPageData | undefined = useMemo(
    () => PAGES.find((p) => p.id === currentPageId),
    [currentPageId]
  );

  const handleBack = useCallback(() => {
    if (!currentPage) return;
    const prevPage = (currentPage as any).prevPage as string | undefined;
    if (prevPage) goToPage(prevPage);
    else goToPage("title");
  }, [currentPage, goToPage]);

  const handleNext = useCallback(() => {
    if (!currentPage) return;
    const nextPage = (currentPage as any).nextPage as string | undefined;
    if (nextPage) {
      markPageComplete(currentPage.id);
      goToPage(nextPage);
    }
  }, [currentPage, goToPage, markPageComplete]);

  const handleToggleItem = useCallback(
    (category: string, itemId: string) => {
      const selected = choices[category] || [];
      const page = PAGES.find(
        (p) => p.type === "activity" && (p as ActivityPageData).category === category
      ) as ActivityPageData | undefined;
      const maxItems = page?.maxItems ?? 3;

      if (selected.includes(itemId)) {
        removeChoice(category, itemId);
      } else if (selected.length < maxItems) {
        addChoice(category, itemId);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    },
    [choices, addChoice, removeChoice]
  );

  const getChosenItemsForFeedback = useCallback(
    (category: string) => {
      const activityPage = PAGES.find(
        (p) =>
          p.type === "activity" &&
          (p as ActivityPageData).category === category
      ) as ActivityPageData | undefined;
      const chosenIds = choices[category] || [];
      return activityPage?.items.filter((i) => chosenIds.includes(i.id)) ?? [];
    },
    [choices]
  );

  if (!currentPage) {
    return (
      <View style={[styles.errorView, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.foreground }]}>
          Oops! Page not found.
        </Text>
        <Pressable
          onPress={resetStory}
          style={[styles.errorBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.errorBtnText, { color: colors.primaryForeground }]}>
            Go Home
          </Text>
        </Pressable>
      </View>
    );
  }

  const renderPage = () => {
    switch (currentPage.type) {
      case "title":
        return (
          <TitleScreen
            page={currentPage}
            onNext={handleNext}
          />
        );

      case "season-select":
        return (
          <SeasonSelectScreen
            page={currentPage}
            onSelect={(targetPage, seasonId) => {
              setSeason(seasonId as "sunny" | "winter" | "rain");
              markPageComplete(currentPage.id);
              goToPage(targetPage);
            }}
            onBack={handleBack}
          />
        );

      case "story":
        return (
          <StoryScreen
            page={currentPage}
            onNext={handleNext}
            onBack={handleBack}
            narrationEnabled={narrationEnabled}
          />
        );

      case "activity":
        return (
          <ActivityScreen
            page={currentPage}
            selectedIds={choices[currentPage.category] || []}
            onToggle={handleToggleItem}
            onClear={clearChoices}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case "feedback":
        return (
          <FeedbackScreen
            page={currentPage}
            chosenItems={getChosenItemsForFeedback(currentPage.category)}
            onNext={handleNext}
            onBack={handleBack}
            narrationEnabled={narrationEnabled}
          />
        );

      case "choice":
        return (
          <ChoiceScreen
            page={currentPage}
            onSelect={(targetPage, choiceId) => {
              setChosenPath(choiceId as "park" | "beach" | "forest");
              markPageComplete(currentPage.id);
              goToPage(targetPage);
            }}
            onBack={handleBack}
          />
        );

      case "end":
        return (
          <EndScreen
            page={currentPage}
            onRestart={resetStory}
          />
        );

      default:
        return (
          <View style={[styles.errorView, { backgroundColor: colors.background }]}>
            <Text style={[styles.errorText, { color: colors.foreground }]}>
              Unknown page type.
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ControlBar />
      <View style={styles.pageArea}>{renderPage()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    zIndex: 10,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pageArea: {
    flex: 1,
  },
  errorView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Fredoka_500Medium",
    textAlign: "center",
  },
  errorBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
  },
  errorBtnText: {
    fontSize: 16,
    fontFamily: "Fredoka_600SemiBold",
  },
});
