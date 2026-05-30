import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  theme?: string;
}

const THEME_COLORS: Record<string, { base: string; glows: string[]; particles: string[]; sparkleEmojis: string[] }> = {
  default: {
    base: "from-[#1a0f0a] via-[#3d2015] to-[#1a0f0a]",
    glows: ["bg-amber-400/10", "bg-purple-400/10", "bg-pink-400/8"],
    particles: ["#FFD700", "#FF69B4", "#87CEEB", "#98FB98", "#DDA0DD", "#FFA07A"],
    sparkleEmojis: ["⭐", "✨", "🌟", "💫", "🌸", "🦋"],
  },
  title: {
    base: "from-[#1a0f0a] via-[#4a1a2e] to-[#1a0f0a]",
    glows: ["bg-amber-300/15", "bg-pink-500/12", "bg-rose-400/10"],
    particles: ["#FFD700", "#FF69B4", "#FFB6C1", "#FFA07A", "#DDA0DD", "#FFDAB9"],
    sparkleEmojis: ["⭐", "✨", "🌟", "🎉", "🌸", "💖"],
  },
  breakfast: {
    base: "from-[#1a0f0a] via-[#4a2a10] to-[#1a0f0a]",
    glows: ["bg-yellow-400/15", "bg-orange-400/12", "bg-amber-300/10"],
    particles: ["#FFD700", "#FFA500", "#FF8C00", "#FFE4B5", "#FFFACD", "#FFDAB9"],
    sparkleEmojis: ["⭐", "✨", "🥞", "🍳", "☀️", "💛"],
  },
  animals: {
    base: "from-[#0a1a0a] via-[#1a3a1a] to-[#0a1a0a]",
    glows: ["bg-green-400/12", "bg-emerald-400/10", "bg-yellow-400/8"],
    particles: ["#98FB98", "#7CFC00", "#ADFF2F", "#FFD700", "#90EE90", "#3CB371"],
    sparkleEmojis: ["🌸", "🌿", "✨", "🦋", "🐝", "🌼"],
  },
  beach: {
    base: "from-[#0a1628] via-[#0d2b4a] to-[#0a1628]",
    glows: ["bg-sky-400/15", "bg-cyan-400/10", "bg-blue-400/8"],
    particles: ["#87CEEB", "#00BFFF", "#7FFFD4", "#FFD700", "#FFA07A", "#E0FFFF"],
    sparkleEmojis: ["⭐", "🌊", "☀️", "🐚", "💙", "✨"],
  },
  forest: {
    base: "from-[#0a1a0f] via-[#1a3a22] to-[#0a1a0f]",
    glows: ["bg-emerald-400/12", "bg-green-400/10", "bg-amber-400/8"],
    particles: ["#50C878", "#00FF7F", "#ADFF2F", "#FFD700", "#8FBC8F", "#98FB98"],
    sparkleEmojis: ["🍄", "✨", "🌿", "🍀", "🌟", "🪲"],
  },
  gifts: {
    base: "from-[#1a0a14] via-[#3a1a2e] to-[#1a0a14]",
    glows: ["bg-pink-400/15", "bg-rose-400/12", "bg-purple-400/10"],
    particles: ["#FF69B4", "#FF1493", "#FFB6C1", "#FFD700", "#DDA0DD", "#FFA07A"],
    sparkleEmojis: ["🎀", "✨", "💖", "🌟", "🎁", "💝"],
  },
  snowman: {
    base: "from-[#0a1420] via-[#14283d] to-[#0a1420]",
    glows: ["bg-sky-300/15", "bg-blue-200/12", "bg-white/8"],
    particles: ["#E0FFFF", "#B0E0E6", "#ADD8E6", "#FFD700", "#FFFFFF", "#C0C0C0"],
    sparkleEmojis: ["❄️", "⭐", "✨", "☃️", "💠", "🌨️"],
  },
  puddles: {
    base: "from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a1a]",
    glows: ["bg-indigo-400/12", "bg-blue-400/10", "bg-slate-400/8"],
    particles: ["#87CEEB", "#6A5ACD", "#7B68EE", "#FFD700", "#ADD8E6", "#B0C4DE"],
    sparkleEmojis: ["💧", "🌧️", "✨", "🌈", "🐸", "⛱️"],
  },
  end: {
    base: "from-[#1a0f0a] via-[#2d1a2e] to-[#0a1a1a]",
    glows: ["bg-pink-400/15", "bg-yellow-400/12", "bg-green-400/10", "bg-blue-400/8"],
    particles: ["#FFD700", "#FF69B4", "#00FF7F", "#87CEEB", "#FFA500", "#DDA0DD", "#FF4500"],
    sparkleEmojis: ["🎉", "🎊", "✨", "🌟", "💫", "🎈", "🏆", "🌈"],
  },
};

export default function AnimatedBackground({ theme = "default" }: AnimatedBackgroundProps) {
  const themeColors = THEME_COLORS[theme] || THEME_COLORS.default;
  const [particles, setParticles] = useState<{ id: number; x: number; speed: number; size: number; color: string; emoji?: string; type: "dot" | "emoji" }[]>([]);

  useEffect(() => {
    const dots = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      speed: Math.random() * 18 + 12,
      size: Math.random() * 5 + 2,
      color: themeColors.particles[Math.floor(Math.random() * themeColors.particles.length)],
      type: "dot" as const,
    }));
    const emojiParts = Array.from({ length: 12 }, (_, i) => ({
      id: i + 100,
      x: Math.random() * 100,
      speed: Math.random() * 22 + 18,
      size: Math.random() * 8 + 14,
      color: themeColors.particles[Math.floor(Math.random() * themeColors.particles.length)],
      emoji: themeColors.sparkleEmojis[Math.floor(Math.random() * themeColors.sparkleEmojis.length)],
      type: "emoji" as const,
    }));
    setParticles([...dots, ...emojiParts]);
  }, [theme]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Animated gradient base */}
      <div className={`absolute inset-0 bg-gradient-to-br ${themeColors.base} animate-bg-flow`} />

      {/* Colorful ambient glows */}
      {themeColors.glows.map((glowClass, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${glowClass} blur-[150px]`}
          style={{
            top: `${15 + i * 25}%`,
            left: `${10 + i * 30}%`,
            width: "60%",
            height: "60%",
          }}
        />
      ))}

      {/* Subtle wooden texture */}
      <div
        className="absolute inset-0 opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Floating colorful particles */}
      {particles.map((p) =>
        p.type === "dot" ? (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.7, 0],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: p.speed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.id * 0.25,
            }}
          />
        ) : (
          <motion.span
            key={p.id}
            className="absolute select-none"
            style={{
              left: `${p.x}%`,
              fontSize: p.size,
              filter: "drop-shadow(0 0 4px rgba(255,255,255,0.3))",
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.8, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: p.speed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.id * 0.15,
            }}
          >
            {p.emoji}
          </motion.span>
        )
      )}

      {/* Soft corner vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(10,5,3,0.5)_100%)]" />
    </div>
  );
}
