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

interface Confetti { id: number; x: number; color: string; size: number; delay: number; }
const CONFETTI_COLORS = ["#F5C842", "#FF90C1", "#4CAF50", "#2196F3", "#FF5722", "#9C27B0"];

function PolaroidCard({ title, itemIds, rotation }: { title: string; itemIds: string[]; rotation: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
      className={`bg-white p-3 pb-5 shadow-2xl rounded-sm border border-stone-200 flex flex-col items-center relative select-none w-28 md:w-32 ${rotation}`}
      transition={{ type: "spring", damping: 12 }}
    >
      <div className="w-12 h-5 bg-amber-200/50 absolute -top-2.5 left-1/2 -translate-x-1/2 border-x border-dashed border-stone-300/40 rotate-[1deg] pointer-events-none" />
      <div className="w-full aspect-square bg-stone-50 rounded-sm flex items-center justify-center gap-1 flex-wrap p-2 shadow-inner overflow-hidden border border-stone-100">
        {itemIds.map((id, idx) => (
          <motion.span key={id} className="text-2xl md:text-3xl filter drop-shadow-sm select-none"
            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8 + idx * 0.15, type: "spring" }}
          >
            {getItemImagePath(id)
              ? <img src={getItemImagePath(id)} alt="" className="w-8 h-8 object-contain pointer-events-none" />
              : getItemEmoji(id)
            }
          </motion.span>
        ))}
      </div>
      <span className="text-[10px] md:text-xs font-bold text-stone-600/80 mt-3 tracking-wide text-center" style={{ fontFamily: "'Fredoka', sans-serif" }}>
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
        id: i, x: Math.random() * 100, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: Math.random() * 12 + 8, delay: Math.random() * 1.2,
      }));
      setConfetti(pieces);
      setTimeout(() => setConfetti([]), 5000);
    }
  }, [shown, play]);

  const handleRestart = () => {
    if (signature.trim()) {
      const existing = localStorage.getItem("micos-scrapbook");
      const entries = existing ? JSON.parse(existing) : [];
      entries.push({
        id: Date.now(), signature: signature.trim(),
        season: selectedSeason || "sunny",
        chosenPath: chosenPath || (selectedSeason === "winter" ? "snowman" : selectedSeason === "rain" ? "puddles" : "park"),
        breakfast: choices["breakfast"] || [],
        adventureItems: selectedSeason === "winter" ? (choices["snowman"] || [])
          : selectedSeason === "rain" ? (choices["puddles"] || [])
          : chosenPath === "beach" ? (choices["beach"] || [])
          : chosenPath === "forest" ? (choices["forest"] || [])
          : (choices["animals"] || []),
        gifts: choices["gifts"] || [],
        date: new Date().toLocaleDateString(),
      });
      localStorage.setItem("micos-scrapbook", JSON.stringify(entries));
    }
    play("click");
    resetStory();
    onRestart();
  };

  const breakfast = choices["breakfast"] || [];
  const animals   = choices["animals"] || [];
  const beach     = choices["beach"] || [];
  const forest    = choices["forest"] || [];
  const snowman   = choices["snowman"] || [];
  const puddles   = choices["puddles"] || [];
  const gifts     = choices["gifts"] || [];

  const buildPersonalizedEnding = () => {
    const parts: string[] = [];
    if (breakfast.length > 0) parts.push(`started the day with ${breakfast.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(" & ")}`);
    if (animals.length > 0)   parts.push(`spotted ${animals.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(", ")} in the meadow`);
    if (beach.length > 0)     parts.push(`found ${beach.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(", ")} on the beach`);
    if (forest.length > 0)    parts.push(`gathered ${forest.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(", ")} in the forest`);
    if (snowman.length > 0)   parts.push(`decorated the snowman with ${snowman.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(", ")}`);
    if (puddles.length > 0)   parts.push(`splashed and collected ${puddles.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(", ")} in the rain`);
    if (gifts.length > 0)     parts.push(`brought home ${gifts.map(id => `${getItemEmoji(id)} ${getItemLabel(id)}`).join(" & ")} as a surprise`);
    if (parts.length === 0) return null;
    return `Mico ${parts.join(", and ")}. What a day!`;
  };

  const personalizedEnding = buildPersonalizedEnding();
  const staticLines = page.text.split("\n");

  return (
    <motion.div
      className="w-full h-full flex flex-col md:flex-row items-stretch pt-4 pb-4 px-4 md:px-10 gap-4 md:gap-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Confetti */}
      <AnimatePresence>
        {confetti.map((c) => (
          <motion.div key={c.id} className="absolute z-30 rounded-sm pointer-events-none"
            style={{ background: c.color, width: c.size, height: c.size * 0.5, left: `${c.x}%`, top: -30 }}
            initial={{ y: -30, rotate: 0, opacity: 1 }}
            animate={{ y: "110vh", rotate: 1080, opacity: 0 }}
            transition={{ duration: 4 + c.delay, delay: c.delay, ease: "easeIn" }}
          />
        ))}
      </AnimatePresence>

      {/* LEFT — Scrollable narrative panel */}
      <motion.div
        className="flex flex-col w-full md:w-[55%] h-full"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1 flex flex-col bg-black/35 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 scrollbar-hide flex flex-col gap-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300/80 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                🏆 Adventure Completed!
              </span>
              <h1
                className="mt-4 mb-3 font-bold tracking-tight leading-tight"
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "clamp(36px, 4.5vw, 60px)",
                  background: "linear-gradient(135deg, #FDE68A 0%, #FCD34D 50%, #FB923C 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}
              >
                {page.title}
              </h1>
              <p className="leading-relaxed text-white/80"
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(14px, 1.6vw, 20px)", lineHeight: 1.6 }}
              >
                {staticLines.map((line, i) =>
                  line === "" ? <br key={i} /> : <span key={i} className="block">{line}</span>
                )}
              </p>
            </div>

            {/* Personalised story summary */}
            {personalizedEnding && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="px-4 py-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-white/85"
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(12px, 1.3vw, 16px)", lineHeight: 1.55 }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300/80 block mb-1">Your Story ✨</span>
                {personalizedEnding}
              </motion.div>
            )}

            {/* Polaroid scrapbook row */}
            {(breakfast.length > 0 || animals.length > 0 || beach.length > 0 || forest.length > 0 || snowman.length > 0 || puddles.length > 0 || gifts.length > 0) && (
              <div className="flex gap-3 flex-wrap justify-center">
                {breakfast.length > 0 && <PolaroidCard title="🍳 Breakfast"       itemIds={breakfast} rotation="rotate-[-4deg]" />}
                {animals.length > 0   && <PolaroidCard title="🐿️ Meadow"          itemIds={animals}   rotation="rotate-[3deg]" />}
                {beach.length > 0     && <PolaroidCard title="🐚 Beach"            itemIds={beach}     rotation="rotate-[2deg]" />}
                {forest.length > 0    && <PolaroidCard title="🔮 Forest"           itemIds={forest}    rotation="rotate-[3deg]" />}
                {snowman.length > 0   && <PolaroidCard title="⛄ Snowman"          itemIds={snowman}   rotation="rotate-[2deg]" />}
                {puddles.length > 0   && <PolaroidCard title="🐸 Puddles"          itemIds={puddles}   rotation="rotate-[-3deg]" />}
                {gifts.length > 0     && <PolaroidCard title="🎁 Gift"             itemIds={gifts}     rotation="rotate-[-2deg]" />}
              </div>
            )}

            {/* Signature block */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
              <label htmlFor="scrapbook-sig" className="text-xs font-bold uppercase tracking-wider text-amber-300/70" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Sign Mico's Diary ✍️
              </label>
              <input
                id="scrapbook-sig" type="text" value={signature} onChange={(e) => setSignature(e.target.value)}
                placeholder="Type your name here..." maxLength={20}
                className="w-full px-4 py-2.5 bg-white/8 hover:bg-white/12 focus:bg-white/15 text-white placeholder-white/30 rounded-xl border border-white/15 focus:border-amber-400/50 focus:outline-none font-medium text-sm transition-all text-center"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              />
              {signature && (
                <p className="text-center text-amber-300/80 font-semibold italic text-xs mt-0.5" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  This story belongs to: {signature} ✨
                </p>
              )}
            </div>
          </div>

          {/* Restart footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-white/8">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(245,200,66,0.45)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRestart}
              className="w-full py-3.5 rounded-2xl font-bold text-lg cursor-pointer select-none shadow-xl border-b-4 border-amber-600"
              style={{
                background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
                fontFamily: "'Fredoka', sans-serif",
                color: "#3a0d0d",
                boxShadow: "0 8px 24px -4px rgba(245,158,11,0.4)",
              }}
            >
              Play Again! 🔄
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* RIGHT — Mico celebrating */}
      <motion.div
        className="flex items-center justify-center w-full md:w-[45%] h-full relative"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="absolute w-80 h-80 rounded-full bg-pink-400/12 blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute w-52 h-52 rounded-full bg-amber-400/10 blur-[60px] pointer-events-none" />

        <motion.div
          className="z-10"
          animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Character emoji={page.characterEmoji} imagePath={page.characterImagePath} animationState="happy" size="large" />
        </motion.div>

        <motion.div
          className="absolute bottom-12 bg-black/40 backdrop-blur-md border border-amber-400/25 px-5 py-2.5 rounded-full z-20 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, type: "spring" }}
        >
          <span className="text-amber-200 text-sm font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            What an amazing adventure! 🌟
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
