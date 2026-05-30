import { motion } from "framer-motion";
import { ChoicePageData } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";
import { useSound } from "@/hooks/useSound";
import Character from "./Character";

interface ChoicePageProps {
  page: ChoicePageData;
  onBack?: () => void;
}

export default function ChoicePage({ page, onBack }: ChoicePageProps) {
  const { goToPage, setChosenPath } = useStoryStore();
  const { play } = useSound();

  const handleChoice = (optionId: string, targetPage: string) => {
    play("whoosh");
    setChosenPath(optionId as "park" | "beach" | "forest");
    goToPage(targetPage);
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden pt-14 md:pt-16 px-6 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Mico + question header */}
      <div className="flex flex-col items-center mb-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          style={{ transform: "scale(0.65)", transformOrigin: "center top", marginBottom: -32 }}
        >
          <Character emoji="🤩" imagePath="/images/mico-idle.png" animationState="idle" size="large" />
        </motion.div>

        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-300/70 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 block mb-3">
            Choose your adventure
          </span>
          <h1
            className="font-bold leading-tight"
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "clamp(26px, 4vw, 52px)",
              background: "linear-gradient(135deg, #FDE68A 0%, #FCD34D 50%, #FCA5A5 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              filter: "drop-shadow(0 2px 8px rgba(251,191,36,0.2))",
            }}
          >
            {page.question}
          </h1>
        </motion.div>
      </div>

      {/* Option cards */}
      <div className="z-10 flex flex-col sm:flex-row gap-4 w-full max-w-3xl">
        {page.options.map((option, idx) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.22 + idx * 0.1, type: "spring", stiffness: 180, damping: 16 }}
            whileHover={{ scale: 1.04, y: -6, borderColor: "rgba(255,255,255,0.6)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleChoice(option.id, option.targetPage)}
            className="group flex-1 flex flex-col items-center justify-center gap-3 rounded-3xl p-7 cursor-pointer border-2 border-white/25 shadow-2xl relative overflow-hidden"
            style={{ background: option.bgColor, minHeight: 190 }}
          >
            {/* Hover shimmer */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-3xl" />
            {/* Shine streak */}
            <motion.div
              className="absolute top-0 left-[-60%] w-1/2 h-full bg-white/20 skew-x-12 pointer-events-none"
              initial={{ left: "-60%" }}
              whileHover={{ left: "120%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            <motion.span
              className="text-6xl md:text-7xl filter drop-shadow-lg select-none relative z-10"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3 + idx * 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              {option.emoji}
            </motion.span>

            <div className="text-center relative z-10">
              <p
                className="font-bold text-white"
                style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(20px, 2.8vw, 30px)", textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}
              >
                {option.label}
              </p>
              <p
                className="text-white/80 font-medium mt-1"
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(13px, 1.3vw, 15px)" }}
              >
                {option.description}
              </p>
            </div>

            {/* Arrow hint */}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-white/50 text-lg select-none relative z-10"
            >→</motion.span>
          </motion.button>
        ))}
      </div>

      <motion.p
        className="mt-5 text-white/35 text-xs font-medium tracking-wider z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
      >
        Tap a card to begin your adventure
      </motion.p>

      {/* Back button — absolute bottom-left */}
      {onBack && (
        <motion.button
          className="absolute bottom-5 left-5 z-20 flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white/60 border border-white/15 cursor-pointer hover:bg-white/10 transition-colors"
          style={{ background: "rgba(0,0,0,0.3)", fontFamily: "'Fredoka', sans-serif", fontSize: 15, backdropFilter: "blur(8px)" }}
          onClick={() => { play("click"); onBack(); }}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
      )}
    </motion.div>
  );
}
