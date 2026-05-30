import { motion } from "framer-motion";
import { PARK_PATH, BEACH_PATH, FOREST_PATH, WINTER_PATH, RAIN_PATH } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";

interface ProgressBarProps {
  currentPageId: string;
}

export default function ProgressBar({ currentPageId }: ProgressBarProps) {
  const { chosenPath, selectedSeason } = useStoryStore();

  // Pick the correct path based on the branch the player is on.
  let activePath = PARK_PATH;
  if (selectedSeason === "winter") {
    activePath = WINTER_PATH;
  } else if (selectedSeason === "rain") {
    activePath = RAIN_PATH;
  } else if (chosenPath === "beach") {
    activePath = BEACH_PATH;
  } else if (chosenPath === "forest") {
    activePath = FOREST_PATH;
  }

  const totalPages = activePath.length;
  const currentIndex = activePath.indexOf(currentPageId);
  // If page isn't in the active path yet (e.g. title), fall back to 0
  const safeIndex = currentIndex < 0 ? 0 : currentIndex;
  const progress = (safeIndex / (totalPages - 1)) * 100;

  // Chapter dots — labels adapt to the chosen path
  let chapters: { pageId: string; label: string; index: number; emoji: string }[] = [];

  if (selectedSeason === "winter") {
    chapters = [
      { pageId: "title", label: "Start", index: activePath.indexOf("title"), emoji: "🎬" },
      { pageId: "winter-morning", label: "Breakfast", index: activePath.indexOf("winter-morning"), emoji: "🥣" },
      { pageId: "winter-story", label: "Snow", index: activePath.indexOf("winter-story"), emoji: "⛄" },
      { pageId: "winter-giftshop", label: "Gift", index: activePath.indexOf("winter-giftshop"), emoji: "🎁" },
      { pageId: "winter-end", label: "End", index: activePath.indexOf("winter-end"), emoji: "🏆" },
    ];
  } else if (selectedSeason === "rain") {
    chapters = [
      { pageId: "title", label: "Start", index: activePath.indexOf("title"), emoji: "🎬" },
      { pageId: "rain-morning", label: "Breakfast", index: activePath.indexOf("rain-morning"), emoji: "🥣" },
      { pageId: "rainy-day-story", label: "Puddles", index: activePath.indexOf("rainy-day-story"), emoji: "☔" },
      { pageId: "rain-giftshop", label: "Gift", index: activePath.indexOf("rain-giftshop"), emoji: "🎁" },
      { pageId: "rain-end", label: "End", index: activePath.indexOf("rain-end"), emoji: "🏆" },
    ];
  } else {
    // Sunny Season defaults
    const isBeach = chosenPath === "beach";
    const isForest = chosenPath === "forest";
    const midChapterPageId = isBeach ? "beach" : isForest ? "forest" : "meadow";
    const midChapterLabel = isBeach ? "Beach" : isForest ? "Forest" : "Picnic";
    const midChapterEmoji = isBeach ? "🏖️" : isForest ? "🌲" : "🧺";
    const midChapterIndex = activePath.indexOf(midChapterPageId);

    chapters = [
      { pageId: "title", label: "Start", index: activePath.indexOf("title"), emoji: "🎬" },
      { pageId: "morning", label: "Breakfast", index: activePath.indexOf("morning"), emoji: "🥞" },
      { pageId: midChapterPageId, label: midChapterLabel, index: midChapterIndex, emoji: midChapterEmoji },
      { pageId: "giftshop", label: "Gift", index: activePath.indexOf("giftshop"), emoji: "🎁" },
      { pageId: "end", label: "End", index: activePath.indexOf("end"), emoji: "🏆" },
    ];
  }

  // Find the active chapter label based on currentIndex
  let activeChapterLabel = chapters[0].label;
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (safeIndex >= chapters[i].index) {
      activeChapterLabel = chapters[i].label;
      break;
    }
  }

  return (
    <div
      className="w-full px-8 py-3 bg-white/5 backdrop-blur-md border-b border-white/10"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Story progress: ${Math.round(progress)}%`}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-semibold tracking-wider text-pink-200/80 uppercase px-1">
          <span>Mico's Journey</span>
          <span className="bg-pink-500/20 px-2 py-0.5 rounded-full text-pink-300 border border-pink-500/20">
            {activeChapterLabel}
          </span>
        </div>

        <div className="relative h-3 rounded-full mt-1 bg-white/10 border border-white/5 shadow-inner">
          {/* Progress fill */}
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Chapter dots */}
          {chapters.map((ch) => {
            const dotProgress = (ch.index / (totalPages - 1)) * 100;
            const isReached = safeIndex >= ch.index;
            // Determine if we're currently "within" a chapter's pages
            const nextChapterIndex = chapters[chapters.indexOf(ch) + 1]?.index ?? totalPages;
            const isActive = safeIndex >= ch.index && safeIndex < nextChapterIndex;
            const isCurrentSpecific = currentPageId === ch.pageId;

            return (
              <div
                key={ch.pageId}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group"
                style={{ left: `${dotProgress}%` }}
              >
                {/* Dot Element */}
                <motion.button
                  disabled
                  className="w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300"
                  style={{
                    background: isReached
                      ? "linear-gradient(135deg, #FFF0F6 0%, #FFE3E3 100%)"
                      : "#3D1A25",
                    borderColor: isActive
                      ? "#F5C842"
                      : isReached
                      ? "#FFA5B8"
                      : "rgba(255,255,255,0.15)",
                    boxShadow: isActive ? "0 0 15px #F5C842" : "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  animate={{
                    scale: isCurrentSpecific ? 1.25 : isActive ? 1.15 : 1,
                  }}
                  transition={{ type: "spring", damping: 10 }}
                  title={ch.label}
                >
                  <span className="text-[13px] select-none leading-none">{ch.emoji}</span>
                </motion.button>

                {/* Bubble label */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-pink-950/90 text-white text-[10px] font-bold px-2 py-1 rounded border border-pink-800 shadow-md whitespace-nowrap z-30">
                  {ch.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
