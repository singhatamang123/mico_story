import { motion } from "framer-motion";
import { SeasonSelectPageData } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";
import { useSound } from "@/hooks/useSound";

interface SeasonSelectPageProps {
  page: SeasonSelectPageData;
  onBack: () => void;
}

const SEASON_DECORATIONS: Record<string, { particles: string[]; glow: string }> = {
  sunny: { particles: ["☀️", "🌻", "🌈", "✨"], glow: "rgba(251,191,36,0.3)" },
  winter: { particles: ["❄️", "⛄", "🌨️", "💙"], glow: "rgba(56,189,248,0.3)" },
  rain:   { particles: ["🌧️", "💧", "🌂", "🐸"], glow: "rgba(148,163,184,0.3)" },
};

export default function SeasonSelectPage({ page, onBack }: SeasonSelectPageProps) {
  const { setSeason, goToPage } = useStoryStore();
  const { play } = useSound();

  const handleChoice = (optionId: string, targetPage: string) => {
    play("whoosh");
    setSeason(optionId as "sunny" | "winter" | "rain");
    goToPage(targetPage);
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Question header */}
      <motion.div
        className="text-center mb-10 z-10"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="text-amber-300/70 text-xs font-bold uppercase tracking-[0.25em] mb-3">
          Choose your adventure
        </p>
        <h1
          className="font-bold leading-tight"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "clamp(28px, 4.5vw, 56px)",
            background: "linear-gradient(135deg, #FDE68A 0%, #FCD34D 50%, #FCA5A5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 2px 8px rgba(251,191,36,0.25))",
          }}
        >
          {page.question}
        </h1>
      </motion.div>

      {/* Season cards */}
      <div className="z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-5">
        {page.options.map((option, i) => {
          const deco = SEASON_DECORATIONS[option.id] ?? SEASON_DECORATIONS.sunny;
          return (
            <motion.button
              key={option.id}
              onClick={() => handleChoice(option.id, option.targetPage)}
              className="group relative overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl flex flex-col items-center justify-center p-8 gap-4 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              style={{ background: option.bgColor, minHeight: 220 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 120, damping: 14 }}
              whileHover={{ y: -6, scale: 1.03, borderColor: "rgba(255,255,255,0.55)" }}
              whileTap={{ scale: 0.96 }}
            >
              {/* Hover shimmer */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-3xl" />

              {/* Glow ring on hover */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `0 0 40px ${deco.glow}` }}
              />

              {/* Floating decoration emoji (top-right) */}
              <span className="absolute top-3 right-4 text-2xl opacity-40 group-hover:opacity-70 transition-opacity select-none">
                {deco.particles[1]}
              </span>

              {/* Main emoji */}
              <motion.span
                className="text-7xl md:text-8xl filter drop-shadow-xl select-none relative z-10"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {option.emoji}
              </motion.span>

              {/* Label */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <h2
                  className="font-bold text-white text-center leading-tight"
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: "clamp(22px, 3vw, 32px)",
                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {option.label}
                </h2>
                <p
                  className="text-white/80 text-center font-medium"
                  style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(13px, 1.4vw, 16px)" }}
                >
                  {option.description}
                </p>
              </div>

              {/* "Pick this!" chip that appears on hover */}
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Pick this! ✨
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Back button — bottom-left, always visible */}
      <motion.button
        className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-rose-200 border border-rose-900/50 cursor-pointer hover:bg-rose-950/30 transition-colors"
        style={{ background: "rgba(74,14,27,0.5)", fontFamily: "'Fredoka', sans-serif", fontSize: 15, backdropFilter: "blur(8px)" }}
        onClick={() => { play("click"); onBack(); }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>←</span> Back
      </motion.button>
    </motion.div>
  );
}
