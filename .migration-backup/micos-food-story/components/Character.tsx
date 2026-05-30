"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";

export type MicoAnimState = "idle" | "happy" | "eating" | "sitting" | "sad";
export type MicoEmotion = "curious" | "excited" | "cozy" | "happy" | "sad" | "magical" | "splashy" | "warm";

// Emotion → visual config mapping
const EMOTION_CONFIG: Record<MicoEmotion, {
  glowColor: string;
  particles: string[];
  ringColor: string;
}> = {
  curious:  { glowColor: "rgba(251,191,36,0.35)",  particles: ["❓","💭","🤔","✨","🌟"], ringColor: "#FDE68A" },
  excited:  { glowColor: "rgba(239,68,68,0.35)",   particles: ["⭐","🎉","💥","✨","🌈"], ringColor: "#FCA5A5" },
  cozy:     { glowColor: "rgba(147,197,253,0.35)",  particles: ["❄️","⛄","🧣","☃️","💙"], ringColor: "#BAE6FD" },
  happy:    { glowColor: "rgba(134,239,172,0.40)",  particles: ["💚","🌸","🎊","💫","🍀"], ringColor: "#86EFAC" },
  sad:      { glowColor: "rgba(148,163,184,0.30)",  particles: ["💧","😢","🌧️","💦","😞"], ringColor: "#CBD5E1" },
  magical:  { glowColor: "rgba(167,139,250,0.40)",  particles: ["✨","🔮","🌟","💜","🪄"], ringColor: "#C4B5FD" },
  splashy:  { glowColor: "rgba(96,165,250,0.40)",   particles: ["💧","🐸","🌈","⛵","☔"], ringColor: "#93C5FD" },
  warm:     { glowColor: "rgba(251,146,60,0.40)",   particles: ["🔥","☕","🍞","🧡","⭐"], ringColor: "#FED7AA" },
};

interface CharacterProps {
  emoji: string;
  imagePath?: string;
  animationState?: MicoAnimState;
  emotion?: MicoEmotion;
  tapReaction?: string;
  size?: "normal" | "large";
  onTap?: () => void;
  className?: string;
}

interface FloatingParticle {
  id: number;
  x: number;
  emoji: string;
}

interface Bubble {
  id: number;
  text: string;
}

export default function Character({
  emoji,
  imagePath,
  animationState,
  emotion,
  tapReaction,
  size = "normal",
  onTap,
  className = "",
}: CharacterProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [isSquishing, setIsSquishing] = useState(false);
  const { play } = useSound();

  // Resolve emotion config (fallback to excited sparkles if no emotion set)
  const emotionCfg = emotion ? EMOTION_CONFIG[emotion] : null;
  const particlePool = emotionCfg?.particles ?? ["✨", "⭐", "💫", "🍪", "🥞", "🍭", "🍀"];
  const glowColor = emotionCfg?.glowColor ?? "rgba(236,72,153,0.12)";
  const ringColor = emotionCfg?.ringColor ?? "#F9A8D4";

  const handleTap = useCallback(() => {
    if (tapReaction) {
      play("pop");
      setIsSquishing(true);
      setTimeout(() => setIsSquishing(false), 500);

      const newBubble: Bubble = { id: Date.now(), text: tapReaction };
      setBubbles((prev) => [...prev, newBubble]);
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
      }, 2400);

      // Spawn floating decorative emojis (emotion-aware pool)
      const newParticles: FloatingParticle[] = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i + Math.random(),
        x: (Math.random() - 0.5) * 160,
        emoji: particlePool[Math.floor(Math.random() * particlePool.length)],
      }));
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, 1600);
    }
    onTap?.();
  }, [tapReaction, onTap, play]);

  // Map our animation states to framer-motion keyframes
  let animProps: any = {};
  let transitionProps: any = { duration: 0.5 };

  // Emotion-driven idle animation (overrides default idle when no squish)
  const emotionIdleAnim = emotion === "curious"
    ? { rotate: [-2, 5, -2], y: [0, -8, 0], transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }
    : emotion === "cozy"
    ? { scale: [1, 1.04, 1], y: [0, -4, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
    : emotion === "sad"
    ? { rotate: [-4, 0, -4], y: [0, 4, 0], transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } }
    : emotion === "magical"
    ? { rotate: [0, 6, -6, 0], scale: [1, 1.05, 0.98, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } }
    : emotion === "splashy"
    ? { y: [0, -10, 2, -6, 0], transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }
    : emotion === "excited"
    ? { y: [0, -20, 0, -10, 0], scale: [1, 1.08, 1, 1.04, 1], transition: { duration: 0.9, repeat: Infinity, repeatDelay: 1.2 } }
    : null;

  if (isSquishing) {
    animProps = { scaleY: [1, 0.7, 1.2, 0.95, 1], scaleX: [1, 1.2, 0.85, 1.05, 1] };
  } else if (animationState === "eating") {
    animProps = { scaleY: [1, 0.75, 1.15, 0.9, 1], scaleX: [1, 1.25, 0.9, 1.05, 1] };
  } else if (animationState === "happy") {
    animProps = { y: [0, -30, 0, -15, 0], scale: [1, 1.1, 1, 1.05, 1] };
    transitionProps = { duration: 0.8, ease: "easeOut", repeat: Infinity, repeatDelay: 1.5 };
  } else if (animationState === "sitting") {
    animProps = { scaleY: 0.85, y: 15 };
  } else if (animationState === "sad") {
    animProps = { scaleY: 0.9, opacity: 0.8, rotate: -5 };
  } else if (emotionIdleAnim && !isSquishing) {
    animProps = emotionIdleAnim;
    transitionProps = {}; // transition is embedded in emotionIdleAnim
  } else {
    animProps = { scaleY: 1, scaleX: 1, y: 0 };
  }

  const sizeClass = size === "large" ? "w-44 h-44 text-[120px]" : "w-32 h-32 text-[80px] md:text-[96px]";

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${className}`}
      style={{ minHeight: size === "large" ? 220 : 180 }}
    >
      {/* Floating tap particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none text-2xl z-20 select-none"
            style={{ left: "50%", top: "30%" }}
            initial={{ x: p.x * 0.2, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: -120, opacity: 0, scale: 0.2 }}
            exit={{}}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Comic speech bubble */}
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute z-20 speech-bubble-tail whitespace-pre-wrap rounded-2xl px-5 py-3 text-sm font-bold shadow-xl border border-rose-100 bg-white/95 text-[#4A0E1B] text-center max-w-[220px]"
            style={{
              bottom: size === "large" ? "88%" : "82%",
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: "0 10px 25px -5px rgba(74, 14, 27, 0.15), 0 8px 10px -6px rgba(74, 14, 27, 0.1)",
            }}
            initial={{ y: 15, opacity: 0, scale: 0.8, x: "-50%" }}
            animate={{ y: 0, opacity: 1, scale: 1, x: "-50%" }}
            exit={{ y: -15, opacity: 0, scale: 0.8, x: "-50%" }}
            transition={{ type: "spring", damping: 14, stiffness: 220 }}
          >
            {bubble.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Ambient glowing ring behind character — color driven by emotion */}
      <div
        className="absolute w-36 h-36 rounded-full border blur-sm pointer-events-none z-0 transition-colors duration-700"
        style={{ background: `${glowColor}`, borderColor: `${ringColor}40` }}
      />
      <motion.div
        className="absolute w-52 h-52 rounded-full blur-2xl pointer-events-none z-0 transition-colors duration-700"
        style={{ background: glowColor }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: emotion === "cozy" ? 4 : emotion === "excited" ? 2 : 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Emotion badge — tiny indicator top-right */}
      {emotion && (
        <motion.div
          className="absolute -top-1 -right-1 text-base select-none z-20 pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          title={emotion}
        >
          {emotion === "curious" ? "❓" : emotion === "excited" ? "🌟" : emotion === "cozy" ? "❄️" : emotion === "happy" ? "💚" : emotion === "sad" ? "💧" : emotion === "magical" ? "✨" : emotion === "splashy" ? "💦" : emotion === "warm" ? "🔥" : null}
        </motion.div>
      )}

      {/* ── Character Image Renderer ────────────────────────────────────────────── */}
      <motion.div
        className={`${animationState === "idle" ? "animate-bob" : ""} z-10`}
        style={{ animationDelay: "0.2s" }}
      >
        <motion.div
          className={`${sizeClass} flex items-center justify-center cursor-pointer select-none`}
          animate={animProps}
          transition={transitionProps}
          onClick={handleTap}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          role={tapReaction ? "button" : undefined}
          aria-label={tapReaction ? `Tap ${emoji} character` : undefined}
          tabIndex={tapReaction ? 0 : undefined}
          onKeyDown={(e) => e.key === "Enter" && handleTap()}
        >
          {imagePath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePath} alt="Mico character" className="w-full h-full object-contain filter drop-shadow-2xl" />
          ) : (
            <span className="drop-shadow-lg filter">{emoji}</span>
          )}
        </motion.div>
      </motion.div>

      {/* "Tap me!" hint label */}
      {tapReaction && !bubbles.length && (
        <motion.p
          className="text-xs mt-3 opacity-60 text-white font-medium italic z-10"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap me! 👇
        </motion.p>
      )}
    </div>
  );
}
