"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EndPageData, getItemEmoji, getItemLabel, getItemImagePath } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";
import { useSound } from "@/hooks/useSound";
import Character from "./Character";

interface EndPageProps {
  page: EndPageData;
  onRestart: () => void;
}

interface Confetti {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
}

const CONFETTI_COLORS = ["#F5C842", "#FF90C1", "#4CAF50", "#2196F3", "#FF5722", "#9C27B0"];

// Polaroid Card Helper component
function PolaroidCard({ 
  title, 
  itemIds, 
  rotation 
}: { 
  title: string; 
  itemIds: string[]; 
  rotation: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
      className={`bg-white p-3 pb-5 shadow-2xl rounded-sm border border-stone-200 flex flex-col items-center justify-center relative select-none w-28 md:w-36 ${rotation}`}
      transition={{ type: "spring", damping: 12 }}
    >
      {/* Adhesive Tape decoration */}
      <div 
        className="w-12 h-5 bg-amber-200/40 backdrop-blur-xs shadow-sm absolute -top-2.5 left-1/2 -translate-x-1/2 border-x border-dashed border-stone-300/40 rotate-[2deg] pointer-events-none"
        style={{ transform: "translate(-50%, 0) rotate(1deg)" }}
      />
      
      {/* Photo frame placeholder */}
      <div className="w-full aspect-square bg-stone-50 rounded-sm flex items-center justify-center gap-1.5 flex-wrap p-2 shadow-inner overflow-hidden border border-stone-100">
        {itemIds.map((id, idx) => (
          <motion.span 
            key={id} 
            className="text-2xl md:text-3xl filter drop-shadow-sm select-none"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8 + idx * 0.15, type: "spring" }}
          >
            {getItemImagePath(id) ? (
              <img src={getItemImagePath(id)} alt="" className="w-8 h-8 object-contain pointer-events-none" />
            ) : (
              getItemEmoji(id)
            )}
          </motion.span>
        ))}
      </div>
      
      {/* Captions */}
      <span 
        className="text-[10px] md:text-xs font-bold text-stone-700/80 mt-3 tracking-wide text-center"
        style={{ fontFamily: "'Fredoka', sans-serif" }}
      >
        {title}
      </span>
    </motion.div>
  );
}

export default function EndPage({ page, onRestart }: EndPageProps) {
  const { choices, resetStory, selectedSeason, chosenPath } = useStoryStore();
  const { play } = useSound();
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [shown, setShown] = useState(false);
  const [signature, setSignature] = useState("");

  useEffect(() => {
    if (!shown) {
      setShown(true);
      play("cheer");
      const pieces: Confetti[] = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: Math.random() * 12 + 8,
        delay: Math.random() * 1.2,
      }));
      setConfetti(pieces);
      setTimeout(() => setConfetti([]), 5000);
    }
  }, [shown, play]);

  const handleRestart = () => {
    if (signature.trim()) {
      const existing = localStorage.getItem("micos-scrapbook");
      const entries = existing ? JSON.parse(existing) : [];

      const newEntry = {
        id: Date.now(),
        signature: signature.trim(),
        season: selectedSeason || "sunny",
        chosenPath: chosenPath || (selectedSeason === "winter" ? "snowman" : selectedSeason === "rain" ? "puddles" : "park"),
        breakfast: choices["breakfast"] || [],
        adventureItems: selectedSeason === "winter"
          ? (choices["snowman"] || [])
          : selectedSeason === "rain"
          ? (choices["puddles"] || [])
          : chosenPath === "beach"
          ? (choices["beach"] || [])
          : chosenPath === "forest"
          ? (choices["forest"] || [])
          : (choices["animals"] || []),
        gifts: choices["gifts"] || [],
        date: new Date().toLocaleDateString(),
      };

      localStorage.setItem("micos-scrapbook", JSON.stringify([...entries, newEntry]));
    }

    play("click");
    resetStory();
    onRestart();
  };

  const staticLines = page.text.split("\n");
  const breakfast = choices["breakfast"] || [];
  const animals = choices["animals"] || [];
  const beach = choices["beach"] || [];
  const forest = choices["forest"] || [];
  const snowman = choices["snowman"] || [];
  const puddles = choices["puddles"] || [];
  const gifts = choices["gifts"] || [];

  // Build a personalized summary sentence from the user's choices
  const buildPersonalizedEnding = () => {
    const parts: string[] = [];
    if (breakfast.length > 0) {
      const names = breakfast.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(" & ");
      parts.push(`started the day with ${names}`);
    }
    if (animals.length > 0) {
      const names = animals.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(", ");
      parts.push(`spotted ${names} in the meadow`);
    }
    if (beach.length > 0) {
      const names = beach.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(", ");
      parts.push(`found ${names} on the beach`);
    }
    if (forest.length > 0) {
      const names = forest.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(", ");
      parts.push(`gathered ${names} in the forest`);
    }
    if (snowman.length > 0) {
      const names = snowman.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(", ");
      parts.push(`decorated the snowman with ${names}`);
    }
    if (puddles.length > 0) {
      const names = puddles.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(", ");
      parts.push(`splashed and collected ${names} in the rain`);
    }
    if (gifts.length > 0) {
      const names = gifts.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(" & ");
      parts.push(`brought home ${names} as a surprise gift`);
    }
    if (parts.length === 0) return null;
    return `Mico ${parts.join(", and ")}. What a day!`;
  };

  const personalizedEnding = buildPersonalizedEnding();

  return (
    <div className="flex flex-col md:flex-row w-full h-full relative overflow-hidden">
      
      {/* Flying Confetti */}
      <AnimatePresence>
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            className="absolute z-30 rounded-sm pointer-events-none"
            style={{
              background: c.color,
              width: c.size,
              height: c.size * 0.5,
              left: `${c.x}%`,
              top: -30,
            }}
            initial={{ y: -30, rotate: 0, opacity: 1 }}
            animate={{ y: "110vh", rotate: 1080, opacity: 0 }}
            transition={{ duration: 4 + c.delay, delay: c.delay, ease: "easeIn" }}
          />
        ))}
      </AnimatePresence>

      {/* Decorative radial gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Left panel: Narrative + restart */}
      <div className="flex flex-col justify-between w-full md:w-1/2 p-6 md:p-12 overflow-y-auto z-10 bg-transparent">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="my-auto max-w-xl mx-auto w-full p-4 md:p-8 flex flex-col gap-6"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200/50">
              Adventure Completed
            </span>
            <h1
              className="text-[#4A0E1B] font-bold mt-4 mb-3 tracking-tight"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(42px, 5vw, 68px)",
                lineHeight: 1.1,
              }}
            >
              {page.title}
            </h1>
            <p
              className="leading-relaxed text-[#4A0E1B]"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(15px, 1.7vw, 22px)",
                lineHeight: 1.55,
              }}
            >
              {staticLines.map((line, i) =>
                line === "" ? (
                  <br key={i} />
                ) : (
                  <span key={i} className="block">
                    {line}
                  </span>
                )
              )}
            </p>

            {/* Personalized story summary */}
            {personalizedEnding && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-4 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200/60 text-[#4A0E1B]"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "clamp(13px, 1.4vw, 17px)",
                  lineHeight: 1.5,
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block mb-1">Your Story ✨</span>
                {personalizedEnding}
              </motion.div>
            )}

            {/* Adventure Diary/Scrapbook Polaroids Row */}
            <div className="flex gap-4 mt-6 justify-center flex-wrap">
              {breakfast.length > 0 && (
                <PolaroidCard title="🍳 Breakfast" itemIds={breakfast} rotation="rotate-[-4deg]" />
              )}
              {animals.length > 0 && (
                <PolaroidCard title="🐿️ Meadow Friends" itemIds={animals} rotation="rotate-[3deg]" />
              )}
              {beach.length > 0 && (
                <PolaroidCard title="🐚 Beach Treasures" itemIds={beach} rotation="rotate-[3deg]" />
              )}
              {forest.length > 0 && (
                <PolaroidCard title="🔮 Forest Gems" itemIds={forest} rotation="rotate-[3deg]" />
              )}
              {snowman.length > 0 && (
                <PolaroidCard title="⛄ Snowman Details" itemIds={snowman} rotation="rotate-[3deg]" />
              )}
              {puddles.length > 0 && (
                <PolaroidCard title="🐸 Rainy Puddles" itemIds={puddles} rotation="rotate-[3deg]" />
              )}
              {gifts.length > 0 && (
                <PolaroidCard title="🎁 Family Gift" itemIds={gifts} rotation="rotate-[-2deg]" />
              )}
            </div>

            {/* Signature Block */}
            <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col gap-2">
              <label 
                htmlFor="scrapbook-signature"
                className="text-xs font-bold uppercase tracking-wider text-rose-600"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Sign Mico's Diary ✍️
              </label>
              <input
                id="scrapbook-signature"
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Type your name here..."
                maxLength={20}
                className="w-full px-4 py-2.5 bg-white hover:bg-rose-50 focus:bg-white text-rose-900 placeholder-rose-300 rounded-xl border border-rose-200 focus:border-rose-400 focus:outline-none font-medium text-sm transition-all shadow-inner text-center"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              />
              {signature && (
                <p 
                  className="text-center text-rose-500 font-semibold italic text-xs mt-1"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  This story belongs to: {signature} ✨
                </p>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-2"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(245,200,66,0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="btn-3d w-full py-4 rounded-2xl font-bold border-b-4 border-amber-600 active:border-b-0 text-[#4A0E1B] text-lg shadow-xl cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
                fontFamily: "'Fredoka', sans-serif",
              }}
            >
              Play Again! 🔄
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right panel: character display */}
      <div className="flex items-center justify-center w-full md:w-1/2 min-h-[260px] md:min-h-0 relative bg-transparent">
        <div className="absolute w-[80%] h-[80%] rounded-full bg-pink-500/10 blur-[80px] pointer-events-none animate-pulse" />
        
        <div className="z-10 flex items-center justify-center">
          <Character
            emoji={page.characterEmoji}
            imagePath={page.characterImagePath}
            animationState="happy"
            size="large"
          />
        </div>
      </div>
    </div>
  );
}

// getItemEmoji and getItemLabel are imported from @/data/pages
