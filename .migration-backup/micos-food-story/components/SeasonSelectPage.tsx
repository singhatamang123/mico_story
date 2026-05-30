"use client";
import { motion } from "framer-motion";
import { SeasonSelectPageData } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";
import { useSound } from "@/hooks/useSound";
import NavButtons from "./NavButtons";
import { useEffect, useState } from "react";

interface SeasonSelectPageProps {
  page: SeasonSelectPageData;
  onBack: () => void;
}

export default function SeasonSelectPage({ page, onBack }: SeasonSelectPageProps) {
  const { setSeason, goToPage } = useStoryStore();
  const { play } = useSound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChoice = (optionId: string, targetPage: string) => {
    play("whoosh");
    setSeason(optionId as "sunny" | "winter" | "rain");
    goToPage(targetPage);
  };

  if (!mounted) return null;

  return (
    <motion.div
      className="flex flex-col h-[calc(100vh-4rem)] relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-24 scrollbar-hide">
        <div className="max-w-4xl mx-auto flex flex-col h-full">
          {/* Question Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] tracking-tight">
              {page.question}
            </h1>
          </motion.div>

          {/* Cards Container */}
          <div className="flex-1 flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 min-h-[300px]">
            {page.options.map((option, index) => {
              const isDisabled = false;
              return (
                <motion.button
                  key={option.id}
                  disabled={isDisabled}
                  onClick={() => handleChoice(option.id, option.targetPage)}
                  className={`flex-1 relative group overflow-hidden rounded-[3rem] border-4 border-white/50 shadow-2xl transition-all duration-300 flex flex-col items-center justify-center p-8 backdrop-blur-md
                    ${isDisabled ? "opacity-50 cursor-not-allowed grayscale" : "hover:border-white/80 hover:-translate-y-2 active:scale-95"}`}
                  style={{ background: option.bgColor }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100 }}
                >
                  {/* Subtle glowing overlay on hover */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

                  {/* Icon */}
                  <motion.div
                    className="text-8xl md:text-9xl mb-6 filter drop-shadow-xl"
                    whileHover={!isDisabled ? { scale: 1.1, rotate: [-5, 5, -5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {option.emoji}
                  </motion.div>

                  {/* Text */}
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center drop-shadow-md">
                    {option.label}
                  </h2>
                  <p className="text-white/80 font-medium text-center text-lg md:text-xl">
                    {isDisabled ? "Coming soon..." : option.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} hideContinue />
    </motion.div>
  );
}
