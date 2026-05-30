import { motion, AnimatePresence } from "framer-motion";
import { PARK_PATH, BEACH_PATH, FOREST_PATH, WINTER_PATH, RAIN_PATH } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";

interface ProgressBarProps {
  currentPageId: string;
  soundEnabled: boolean;
  toggleSound: () => void;
  narrationEnabled: boolean;
  toggleNarration: () => void;
  onReset: () => void;
  onPlay: (sound: string) => void;
}

export default function ProgressBar({
  currentPageId,
  soundEnabled,
  toggleSound,
  narrationEnabled,
  toggleNarration,
  onReset,
  onPlay,
}: ProgressBarProps) {
  const { chosenPath, selectedSeason } = useStoryStore();

  let activePath = PARK_PATH;
  if (selectedSeason === "winter") activePath = WINTER_PATH;
  else if (selectedSeason === "rain") activePath = RAIN_PATH;
  else if (chosenPath === "beach") activePath = BEACH_PATH;
  else if (chosenPath === "forest") activePath = FOREST_PATH;

  const totalPages = activePath.length;
  const currentIndex = activePath.indexOf(currentPageId);
  const safeIndex = currentIndex < 0 ? 0 : currentIndex;
  const progress = (safeIndex / (totalPages - 1)) * 100;

  let chapters: { pageId: string; label: string; index: number; emoji: string }[] = [];

  if (selectedSeason === "winter") {
    chapters = [
      { pageId: "title",         label: "Start",     index: activePath.indexOf("title"),         emoji: "🎬" },
      { pageId: "winter-morning",label: "Breakfast", index: activePath.indexOf("winter-morning"), emoji: "🥣" },
      { pageId: "winter-story",  label: "Snow",      index: activePath.indexOf("winter-story"),   emoji: "⛄" },
      { pageId: "winter-giftshop",label:"Gift",      index: activePath.indexOf("winter-giftshop"),emoji: "🎁" },
      { pageId: "winter-end",    label: "End",       index: activePath.indexOf("winter-end"),     emoji: "🏆" },
    ];
  } else if (selectedSeason === "rain") {
    chapters = [
      { pageId: "title",          label: "Start",     index: activePath.indexOf("title"),          emoji: "🎬" },
      { pageId: "rain-morning",   label: "Breakfast", index: activePath.indexOf("rain-morning"),   emoji: "🥣" },
      { pageId: "rainy-day-story",label: "Puddles",   index: activePath.indexOf("rainy-day-story"),emoji: "☔" },
      { pageId: "rain-giftshop",  label: "Gift",      index: activePath.indexOf("rain-giftshop"),  emoji: "🎁" },
      { pageId: "rain-end",       label: "End",       index: activePath.indexOf("rain-end"),       emoji: "🏆" },
    ];
  } else {
    const isBeach = chosenPath === "beach";
    const isForest = chosenPath === "forest";
    const midId    = isBeach ? "beach"  : isForest ? "forest"  : "meadow";
    const midLabel = isBeach ? "Beach"  : isForest ? "Forest"  : "Picnic";
    const midEmoji = isBeach ? "🏖️"    : isForest ? "🌲"      : "🧺";
    chapters = [
      { pageId: "title",    label: "Start",     index: activePath.indexOf("title"),    emoji: "🎬" },
      { pageId: "morning",  label: "Breakfast", index: activePath.indexOf("morning"),  emoji: "🥞" },
      { pageId: midId,      label: midLabel,    index: activePath.indexOf(midId),      emoji: midEmoji },
      { pageId: "giftshop", label: "Gift",      index: activePath.indexOf("giftshop"), emoji: "🎁" },
      { pageId: "end",      label: "End",       index: activePath.indexOf("end"),      emoji: "🏆" },
    ];
  }

  let activeChapterLabel = chapters[0].label;
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (safeIndex >= chapters[i].index) { activeChapterLabel = chapters[i].label; break; }
  }

  const btnCls = "w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow cursor-pointer hover:bg-white/25 transition-all select-none flex-shrink-0";

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full px-4 py-2"
      style={{
        background: "linear-gradient(to bottom, rgba(10,5,3,0.88) 0%, rgba(10,5,3,0.0) 100%)",
        backdropFilter: "blur(8px)",
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Story progress: ${Math.round(progress)}%`}
    >
      <div className="max-w-5xl mx-auto flex items-center gap-3">

        {/* Chapter label pill */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300/70 hidden md:block whitespace-nowrap">
            Mico's Journey
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeChapterLabel}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 whitespace-nowrap"
            >
              {activeChapterLabel}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Bar track */}
        <div className="relative flex-1 h-2.5 rounded-full bg-white/10 border border-white/10 shadow-inner overflow-visible">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #F59E0B 0%, #EC4899 50%, #8B5CF6 100%)",
              boxShadow: "0 0 10px rgba(245,158,11,0.5), 0 0 20px rgba(236,72,153,0.3)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />

          {chapters.map((ch) => {
            const dotPct = (ch.index / (totalPages - 1)) * 100;
            const isReached = safeIndex >= ch.index;
            const nextIdx = chapters[chapters.indexOf(ch) + 1]?.index ?? totalPages;
            const isActive = safeIndex >= ch.index && safeIndex < nextIdx;

            return (
              <div
                key={ch.pageId}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group"
                style={{ left: `${dotPct}%` }}
              >
                <motion.div
                  className="flex items-center justify-center rounded-full border-2 shadow-lg"
                  style={{
                    width: isActive ? 28 : 22,
                    height: isActive ? 28 : 22,
                    background: isReached
                      ? "linear-gradient(135deg, #FDE68A, #F59E0B)"
                      : "rgba(30,15,10,0.85)",
                    borderColor: isActive
                      ? "#FDE68A"
                      : isReached
                      ? "rgba(245,158,11,0.6)"
                      : "rgba(255,255,255,0.15)",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(253,230,138,0.3), 0 0 14px rgba(245,158,11,0.5)"
                      : isReached
                      ? "0 0 8px rgba(245,158,11,0.3)"
                      : "none",
                  }}
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  title={ch.label}
                >
                  <span className="text-[10px] select-none leading-none">{ch.emoji}</span>
                </motion.div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none bg-black/85 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 shadow-lg whitespace-nowrap z-30">
                  {ch.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Control buttons — live in the same strip, no overlap */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => { toggleNarration(); onPlay("click"); }}
            className={btnCls}
            title={narrationEnabled ? "Mute Narration" : "Read Story to Me"}
          >
            <span className="text-xs">{narrationEnabled ? "📢" : "🔕"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={toggleSound}
            className={btnCls}
            title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
          >
            <span className="text-xs">{soundEnabled ? "🔊" : "🔇"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (confirm("Start over from the beginning?")) {
                onReset();
                onPlay("click");
              }
            }}
            className={btnCls}
            title="Start Over"
          >
            <span className="text-xs">🏠</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
