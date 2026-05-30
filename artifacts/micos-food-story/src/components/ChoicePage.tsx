import { motion } from "framer-motion";
import { ChoicePageData } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";
import { useSound } from "@/hooks/useSound";
import Character from "./Character";
import NavButtons from "./NavButtons";

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
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent"
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "#FFD166" }}
        />
        <div
          className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "#06D6A0" }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-10 blur-2xl"
          style={{ background: "#white" }}
        />
      </div>

      {/* Floating sparkles */}
      {["✨", "⭐", "💫", "🌟", "✨"].map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-xl select-none pointer-events-none"
          style={{
            top: `${15 + i * 17}%`,
            left: `${5 + i * 22}%`,
            opacity: 0.5,
          }}
          animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          {s}
        </motion.span>
      ))}

      {/* Character at top */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="z-10 mb-4"
        style={{ transform: "scale(0.7)", transformOrigin: "center top" }}
      >
        <Character
          emoji="🤩"
          imagePath="/images/mico-idle.png"
          animationState="idle"
          size="large"
        />
      </motion.div>

      {/* Question text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="z-10 text-center mb-8 px-4"
      >
        <span
          className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/20 block mb-3"
        >
          Choose Your Adventure
        </span>
        <h1
          className="text-white font-bold drop-shadow-lg"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "clamp(26px, 4vw, 48px)",
            textShadow: "0 2px 16px rgba(0,0,0,0.25)",
          }}
        >
          {page.question}
        </h1>
      </motion.div>

      {/* Option cards */}
      <div className="z-10 flex flex-col sm:flex-row gap-5 px-6 w-full max-w-2xl">
        {page.options.map((option, idx) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.25 + idx * 0.12,
              type: "spring",
              stiffness: 180,
              damping: 16,
            }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleChoice(option.id, option.targetPage)}
            className="flex-1 flex flex-col items-center justify-center gap-3 rounded-[3rem] p-7 cursor-pointer border-2 border-white/50 shadow-2xl relative overflow-hidden text-left backdrop-blur-md"
            style={{
              background: option.bgColor,
              minHeight: 180,
            }}
          >
            {/* Card glow */}
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-[2rem]" />

            {/* Shine streak */}
            <motion.div
              className="absolute top-0 left-[-60%] w-1/2 h-full bg-white/20 skew-x-12 pointer-events-none"
              initial={{ left: "-60%" }}
              whileHover={{ left: "120%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            <span className="text-6xl md:text-7xl filter drop-shadow-lg select-none">
              {option.emoji}
            </span>

            <div className="text-center relative z-10">
              <p
                className="font-bold text-white"
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "clamp(20px, 3vw, 32px)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                }}
              >
                {option.label}
              </p>
              <p
                className="text-white/80 font-medium mt-1"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "clamp(13px, 1.4vw, 16px)",
                }}
              >
                {option.description}
              </p>
            </div>

            {/* Arrow hint */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/60 text-xl select-none"
            >
              →
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Subtle bottom label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="z-10 mt-6 text-white/40 text-xs font-medium tracking-wider"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        Tap a card to begin your adventure
      </motion.p>

      {onBack && <NavButtons onBack={onBack} hideContinue />}
    </div>
  );
}
