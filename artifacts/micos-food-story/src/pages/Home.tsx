import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStoryStore } from "@/store/storyStore";
import { PAGES, getItemLabel } from "@/data/pages";
import { useSound } from "@/hooks/useSound";
import { useSpeech } from "@/hooks/useSpeech";
import ProgressBar from "@/components/ProgressBar";
import TitlePage from "@/components/TitlePage";
import StoryPage from "@/components/StoryPage";
import ActivityPage from "@/components/ActivityPage";
import FeedbackPage from "@/components/FeedbackPage";
import ChoicePage from "@/components/ChoicePage";
import SeasonSelectPage from "@/components/SeasonSelectPage";
import EndPage from "@/components/EndPage";
import PageTransition from "@/components/PageTransition";
import AnimatedBackground from "@/components/AnimatedBackground";
import StorybookLayout from "@/components/StorybookLayout";

export default function Home() {
  const { currentPageId, goToPage, soundEnabled, toggleSound, resetStory, narrationEnabled, toggleNarration, choices, chosenPath } = useStoryStore();
  const { play } = useSound();
  const { speak, stop } = useSpeech();

  const pageData = PAGES.find((p) => p.id === currentPageId);
  if (!pageData) return null;

  const isTitle = pageData.type === "title";

  const themeMap: Record<string, string> = {
    title: "title", end: "end",
    breakfast: "breakfast", animals: "animals",
    beach: "beach", forest: "forest",
    gifts: "gifts", snowman: "snowman", puddles: "puddles",
  };
  const pageTheme = "category" in pageData && pageData.category
    ? (themeMap[pageData.category] || "default") : (themeMap[pageData.type] || "default");

  // Link-based navigation — uses nextPage/prevPage from the page data directly.
  // This is branch-safe: no PAGE_ORDER index arithmetic needed.
  const navigate = (direction: "next" | "back") => {
    if (pageData.type === "choice" || pageData.type === "season-select" || pageData.type === "end") return; // handled internally
    const newId =
      direction === "next"
        ? (pageData as { nextPage: string }).nextPage
        : (pageData as { prevPage: string }).prevPage;
    if (newId) {
      play("whoosh");
      goToPage(newId);
    }
  };

  const handleBack = () => {
    // Special case: the shared giftshop page has a hardcoded prevPage of "animals-feedback"
    // but Beach/Forest players came from a different branch — route them correctly.
    if (currentPageId === "giftshop") {
      const correctPrev =
        chosenPath === "beach" ? "beach-feedback"
        : chosenPath === "forest" ? "forest-feedback"
        : "animals-feedback";
      play("whoosh");
      goToPage(correctPrev);
      return;
    }
    const prevId = (pageData as { prevPage?: string }).prevPage;
    if (prevId) {
      play("whoosh");
      goToPage(prevId);
    }
  };

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(e.key === "ArrowRight" ? "next" : "back");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageId]);

  // Voice narration triggers
  useEffect(() => {
    if (!narrationEnabled) {
      stop();
      return;
    }

    let textToSpeak = "";
    if (pageData) {
      if (pageData.type === "story") {
        textToSpeak = pageData.text;
      } else if (pageData.type === "activity") {
        textToSpeak = `${pageData.title}. ${pageData.instruction}`;
      } else if (pageData.type === "feedback") {
        // Resolve {{FOOD}}, {{ANIMAL}}, {{TREASURE}}, {{GIFT}} placeholders
        // so narration speaks real item names instead of raw template tags.
        const selectedItems = choices[pageData.category] || [];
        const itemNames =
          selectedItems.length > 0
            ? selectedItems.map((id) => getItemLabel(id)).join(", ")
            : "something special";
        const resolvedText = pageData.staticText.replace(/\{\{[A-Z]+\}\}/g, itemNames);
        textToSpeak = `${pageData.dynamicPrefix} ${resolvedText}`;
      } else if (pageData.type === "choice") {
        textToSpeak = pageData.question;
      } else if (pageData.type === "season-select") {
        textToSpeak = pageData.question;
      } else if (pageData.type === "end") {
        textToSpeak = `${pageData.title}. ${pageData.text}`;
      }
    }

    if (textToSpeak) {
      const timer = setTimeout(() => {
        speak(textToSpeak);
      }, 500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageId, narrationEnabled, speak, stop]);

  if (isTitle) {
    return (
      <main className="w-screen h-screen overflow-hidden relative">
        <AnimatedBackground theme="title" />
        <div className="absolute top-3 right-4 z-50 flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={() => { toggleNarration(); play("click"); }}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg cursor-pointer hover:bg-white/20 transition-all select-none"
            title={narrationEnabled ? "Mute Narration" : "Read Story to Me"}
          >
            <span className="text-sm">{narrationEnabled ? "📢" : "🔕"}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={toggleSound}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg cursor-pointer hover:bg-white/20 transition-all select-none"
            title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
          >
            <span className="text-sm">{soundEnabled ? "🔊" : "🔇"}</span>
          </motion.button>
        </div>
        <TitlePage
          page={pageData as import("@/data/pages").TitlePageData}
          onStart={() => { play("whoosh"); goToPage(pageData.nextPage); }}
        />
      </main>
    );
  }

  return (
    <main className="w-screen h-screen overflow-hidden relative">
      <AnimatedBackground theme={pageTheme} />
      {/* Global Settings & Sound Control */}
      <div className="absolute top-3 right-4 z-50 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            toggleNarration();
            play("click");
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg cursor-pointer hover:bg-white/20 transition-all select-none"
          title={narrationEnabled ? "Mute Narration" : "Read Story to Me"}
          aria-label={narrationEnabled ? "Mute Narration" : "Read Story to Me"}
        >
          <span className="text-sm">{narrationEnabled ? "📢" : "🔕"}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleSound}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg cursor-pointer hover:bg-white/20 transition-all select-none"
          title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
          aria-label={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
        >
          <span className="text-sm">{soundEnabled ? "🔊" : "🔇"}</span>
        </motion.button>

        {currentPageId !== "title" && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              if (confirm("Are you sure you want to start over from the beginning?")) {
                resetStory();
                play("click");
              }
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg cursor-pointer hover:bg-white/20 transition-all select-none"
            title="Start Over"
            aria-label="Start Over"
          >
            <span className="text-sm">🏠</span>
          </motion.button>
        )}
      </div>

      <StorybookLayout isTitle={isTitle}>
        {!isTitle && pageData.type !== "end" && (
          <div className="absolute top-0 left-0 right-0 z-50">
            <ProgressBar currentPageId={currentPageId} />
          </div>
        )}

        <PageTransition pageId={currentPageId} category={(pageData as any).category}>
          <div
            className="absolute inset-0 w-full h-full"
            style={{ paddingTop: !isTitle && pageData.type !== "end" ? 50 : 0 }}
          >
            {pageData.type === "title" && (
              <TitlePage
                page={pageData}
                onStart={() => {
                  play("whoosh");
                  goToPage(pageData.nextPage);
                }}
              />
            )}
            {pageData.type === "season-select" && (
              <SeasonSelectPage
                page={pageData}
                onBack={handleBack}
              />
            )}
            {pageData.type === "story" && (
              <StoryPage
                page={pageData}
                onNext={() => navigate("next")}
                onBack={() => navigate("back")}
              />
            )}
            {pageData.type === "activity" && (
              <ActivityPage
                page={pageData}
                onNext={() => navigate("next")}
                onBack={() => navigate("back")}
              />
            )}
            {pageData.type === "feedback" && (
              <FeedbackPage
                page={pageData}
                onNext={() => navigate("next")}
                onBack={() => navigate("back")}
              />
            )}
            {pageData.type === "choice" && (
              <ChoicePage 
                page={pageData} 
                onBack={handleBack}
              />
            )}
            {pageData.type === "end" && (
              <EndPage page={pageData} onRestart={() => goToPage("title")} />
            )}
          </div>
        </PageTransition>
      </StorybookLayout>
    </main>
  );
}
