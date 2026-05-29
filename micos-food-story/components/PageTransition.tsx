"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PageTransitionProps {
  pageId: string;
  category?: string;
  children: React.ReactNode;
}

// Category → transition config
const TRANSITION_CONFIG: Record<string, {
  color: string;
  particles: { emoji: string; count: number } | null;
  direction: "up" | "down" | "left" | "right" | "expand" | "curtain";
  label: string;
}> = {
  breakfast: {
    color: "#FDE68A",
    particles: { emoji: "☀️", count: 6 },
    direction: "up",
    label: "breakfast",
  },
  animals: {
    color: "#86EFAC",
    particles: { emoji: "🌿", count: 8 },
    direction: "left",
    label: "animals",
  },
  beach: {
    color: "#7DD3FC",
    particles: { emoji: "🌊", count: 6 },
    direction: "right",
    label: "beach",
  },
  forest: {
    color: "#065F46",
    particles: { emoji: "✨", count: 10 },
    direction: "curtain",
    label: "forest",
  },
  snowman: {
    color: "#E0F2FE",
    particles: { emoji: "❄️", count: 12 },
    direction: "down",
    label: "snowman",
  },
  puddles: {
    color: "#BFDBFE",
    particles: { emoji: "💧", count: 10 },
    direction: "down",
    label: "puddles",
  },
  gifts: {
    color: "#FCA5A5",
    particles: { emoji: "🎁", count: 6 },
    direction: "expand",
    label: "gifts",
  },
};

const DEFAULT_CONFIG = {
  color: "#F9A8D4",
  particles: { emoji: "✨", count: 6 },
  direction: "up" as const,
  label: "story",
};

// Build the overlay animation variants based on direction
function getOverlayVariants(direction: string) {
  switch (direction) {
    case "up":
      return {
        enter: { y: "100%", opacity: 1 },
        center: { y: "0%", opacity: 1 },
        exit: { y: "-100%", opacity: 1 },
      };
    case "down":
      return {
        enter: { y: "-100%", opacity: 1 },
        center: { y: "0%", opacity: 1 },
        exit: { y: "100%", opacity: 1 },
      };
    case "left":
      return {
        enter: { x: "100%", opacity: 1 },
        center: { x: "0%", opacity: 1 },
        exit: { x: "-100%", opacity: 1 },
      };
    case "right":
      return {
        enter: { x: "-100%", opacity: 1 },
        center: { x: "0%", opacity: 1 },
        exit: { x: "100%", opacity: 1 },
      };
    case "expand":
      return {
        enter: { scale: 0, opacity: 1, borderRadius: "50%" },
        center: { scale: 2.5, opacity: 1, borderRadius: "0%" },
        exit: { scale: 0, opacity: 0, borderRadius: "50%" },
      };
    case "curtain":
      // Two panels from both sides
      return {
        enter: { scaleX: 0, opacity: 1, originX: "0%" },
        center: { scaleX: 1, opacity: 1 },
        exit: { scaleX: 0, opacity: 1, originX: "100%" },
      };
    default:
      return {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
}

export default function PageTransition({ pageId, category, children }: PageTransitionProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayKey, setOverlayKey] = useState(0);

  const cfg = (category && TRANSITION_CONFIG[category]) || DEFAULT_CONFIG;
  const variants = getOverlayVariants(cfg.direction);

  // Trigger the wipe on page change
  useEffect(() => {
    setShowOverlay(true);
    setOverlayKey((k) => k + 1);
    const t = setTimeout(() => setShowOverlay(false), 700);
    return () => clearTimeout(t);
  }, [pageId]);

  // Generate random particle positions
  const particleCount = cfg.particles?.count ?? 0;
  const particleEmoji = cfg.particles?.emoji ?? "✨";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Actual page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pageId}
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Thematic wipe overlay */}
      <AnimatePresence>
        {showOverlay && (
          <>
            {/* Main color wipe */}
            <motion.div
              key={`wipe-${overlayKey}`}
              className="absolute inset-0 z-[999] pointer-events-none flex items-center justify-center"
              style={{ background: cfg.color }}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Centre icon flash */}
              <motion.div
                className="text-6xl select-none filter drop-shadow-xl"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: [0, 1.4, 1.1], rotate: [0, 15, -5, 0] }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {particleEmoji}
              </motion.div>

              {/* Scattered particles */}
              {Array.from({ length: particleCount }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl select-none pointer-events-none"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1 + Math.random() * 0.5, 0],
                    rotate: Math.random() > 0.5 ? 180 : -180,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 + i * 0.04,
                    ease: "easeOut",
                  }}
                >
                  {particleEmoji}
                </motion.div>
              ))}
            </motion.div>

            {/* Curtain mode: second panel from the right */}
            {cfg.direction === "curtain" && (
              <motion.div
                key={`curtain-right-${overlayKey}`}
                className="absolute inset-0 z-[998] pointer-events-none"
                style={{ background: cfg.color, opacity: 0.6, transformOrigin: "right center" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
