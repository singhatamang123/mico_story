import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActivityPageData, StoryItem } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";
import { useSound } from "@/hooks/useSound";

interface ActivityPageProps {
  page: ActivityPageData;
  onNext: () => void;
  onBack: () => void;
}

const animalPlacements: Record<string, { top: string; left: string; rotate: number; scale: number }> = {
  rabbit:    { top: "62%", left: "18%", rotate: 0,   scale: 1.15 },
  butterfly: { top: "22%", left: "68%", rotate: -15, scale: 1.0  },
  squirrel:  { top: "48%", left: "12%", rotate: 5,   scale: 1.1  },
  bird:      { top: "20%", left: "33%", rotate: -10, scale: 1.0  },
  badger:    { top: "60%", left: "72%", rotate: 0,   scale: 1.2  },
  hedgehog:  { top: "70%", left: "46%", rotate: 8,   scale: 1.05 },
};
const beachPlacements: Record<string, { top: string; left: string; rotate: number; scale: number }> = {
  shell:     { top: "58%", left: "16%", rotate: -12, scale: 1.1  },
  crab:      { top: "63%", left: "70%", rotate:   8, scale: 1.15 },
  starfish:  { top: "20%", left: "60%", rotate:  15, scale: 1.0  },
  fish:      { top: "28%", left: "18%", rotate: -10, scale: 1.0  },
  jellyfish: { top: "18%", left: "40%", rotate:   5, scale: 0.95 },
  seahorse:  { top: "53%", left: "43%", rotate:  -8, scale: 1.05 },
};
const forestPlacements: Record<string, { top: string; left: string; rotate: number; scale: number }> = {
  mushroom: { top: "66%", left: "23%", rotate: -5,  scale: 1.1  },
  acorn:    { top: "58%", left: "63%", rotate: 12,  scale: 1.0  },
  firefly:  { top: "23%", left: "73%", rotate: -15, scale: 1.15 },
  crystal:  { top: "43%", left: "13%", rotate: 5,   scale: 1.1  },
  leaf:     { top: "20%", left: "28%", rotate: 20,  scale: 1.05 },
  pinecone: { top: "48%", left: "78%", rotate: -8,  scale: 1.0  },
};
const snowmanPlacements: Record<string, { top: string; left: string; rotate: number; scale: number }> = {
  snowman_hat:    { top: "8%",  left: "50%", rotate: -5, scale: 1.2 },
  snowman_scarf:  { top: "33%", left: "50%", rotate: 0,  scale: 1.2 },
  snowman_carrot: { top: "23%", left: "50%", rotate: 5,  scale: 1.1 },
  snowman_arms:   { top: "48%", left: "50%", rotate: 0,  scale: 1.4 },
};
const puddlePlacements: Record<string, { top: string; left: string; rotate: number; scale: number }> = {
  frog:      { top: "66%", left: "16%", rotate: 0,   scale: 1.2  },
  raindrop:  { top: "23%", left: "68%", rotate: 10,  scale: 0.95 },
  leaf_boat: { top: "66%", left: "43%", rotate: -8,  scale: 1.15 },
  umbrella:  { top: "20%", left: "26%", rotate: -15, scale: 1.1  },
  snail:     { top: "70%", left: "73%", rotate: 5,   scale: 1.05 },
  rainbow:   { top: "18%", left: "48%", rotate: 0,   scale: 1.25 },
};
const foodPlacements = [
  { top: "20%", left: "20%", rotate: -10 },
  { top: "20%", left: "55%", rotate: 12  },
  { top: "55%", left: "20%", rotate: 8   },
  { top: "55%", left: "55%", rotate: -5  },
];

const SCENE_STYLES: Record<string, { bg: string; ground?: string; deco: string[] }> = {
  breakfast: { bg: "bg-amber-950/40",  ground: "",                                      deco: [] },
  animals:   { bg: "bg-emerald-950/35",ground: "bg-green-900/40",                       deco: ["🌲 bottom-3 left-5","🌳 bottom-3 right-8","☁️ top-5 left-10","☁️ top-7 right-16"] },
  beach:     { bg: "bg-sky-950/40",    ground: "bg-amber-200/15 rounded-b-[2rem]",      deco: ["🌊 bottom-2 left-4","🌊 bottom-2 right-6","☀️ top-3 right-8","⛅ top-5 left-12"] },
  forest:    { bg: "bg-emerald-950/45",ground: "bg-green-900/35 border-t border-white/5",deco: ["🌿 bottom-1 left-5","🍄 bottom-3 right-9","✨ top-3 left-9 animate-pulse","✨ top-8 right-14 animate-pulse"] },
  snowman:   { bg: "bg-sky-900/45",    ground: "bg-white/25 border-t border-white/20",  deco: ["❄️ top-3 left-7 animate-pulse","❄️ top-8 right-10 animate-pulse","❄️ bottom-16 left-14 animate-pulse"] },
  puddles:   { bg: "bg-slate-900/45",  ground: "bg-blue-900/20 border-t border-white/5",deco: ["🌧️ top-3 left-5","🌧️ top-5 right-14","💧 bottom-14 left-18","💧 bottom-20 right-22"] },
  gifts:     { bg: "bg-rose-950/35",   ground: "",                                      deco: [] },
};

export default function ActivityPage({ page, onNext, onBack }: ActivityPageProps) {
  const { choices, addChoice, removeChoice, clearChoices } = useStoryStore();
  const { play } = useSound();
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  const selected = choices[page.category] || [];
  const selectedCount = selected.length;
  const isSelected = (id: string) => selected.includes(id);
  const canAdd = selectedCount < page.maxItems;

  const spawnSparkles = () => {
    const colors = ["#FFF9A6", "#FF90C1", "#4CAF50", "#2196F3", "#FF9F43", "#A180F4"];
    const ps = Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 80 + 60;
      return { id: Date.now() + i + Math.random(), x: Math.cos(angle) * speed, y: Math.sin(angle) * speed, color: colors[i % colors.length], size: Math.random() * 6 + 4 };
    });
    setParticles((prev) => [...prev, ...ps]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => !ps.find((np) => np.id === p.id))), 750);
  };

  const handleTapItem = (item: StoryItem) => {
    if (isSelected(item.id)) { removeChoice(page.category, item.id); play("click"); }
    else if (canAdd) { addChoice(page.category, item.id); play("drop"); spawnSparkles(); }
  };
  const handleRemoveItem = (id: string) => { removeChoice(page.category, id); play("click"); };

  const sceneStyle = SCENE_STYLES[page.category] || SCENE_STYLES.animals;

  const getPlacements = (id: string) => {
    const maps: Record<string, Record<string, { top: string; left: string; rotate: number; scale: number }>> = {
      animals: animalPlacements, beach: beachPlacements, forest: forestPlacements,
      snowman: snowmanPlacements, puddles: puddlePlacements,
    };
    return maps[page.category]?.[id] || { top: "40%", left: "40%", rotate: 0, scale: 1 };
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col md:flex-row items-stretch pt-14 md:pt-16 pb-4 px-4 md:px-10 gap-4 md:gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* LEFT — Instruction panel */}
      <motion.div
        className="flex flex-col w-full md:w-[38%] h-full"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex-1 flex flex-col bg-black/35 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex-1 px-6 pt-6 pb-4 overflow-y-auto scrollbar-hide">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300/80 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              🎮 Interactive Choice
            </span>
            <h2
              className="mt-4 mb-3 font-bold leading-tight"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(22px, 2.8vw, 38px)",
                background: "linear-gradient(135deg, #FDE68A 0%, #FCD34D 60%, #FCA5A5 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >
              {page.title}
            </h2>
            <p className="text-white/70 font-medium leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(14px, 1.5vw, 18px)" }}>
              {page.instruction}
            </p>

            {page.maxItems > 1 && (
              <div className="flex items-center gap-2 mt-5">
                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #FCD34D, #F76B1C)" }}
                    animate={{ width: `${(selectedCount / page.maxItems) * 100}%` }}
                    transition={{ type: "spring", stiffness: 120 }}
                  />
                </div>
                <span className="text-xs font-bold text-amber-300/80 whitespace-nowrap">{selectedCount} / {page.maxItems}</span>
              </div>
            )}
          </div>

          {/* Nav footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-white/8 flex items-center justify-between gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => { clearChoices(page.category); onBack(); play("click"); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-white/70 border border-white/15 bg-white/8 hover:bg-white/15 transition-colors cursor-pointer select-none"
              style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 15 }}
            >
              ← Back
            </motion.button>
            <motion.button
              whileHover={selectedCount === 0 ? {} : { scale: 1.04 }}
              whileTap={selectedCount === 0 ? {} : { scale: 0.96 }}
              onClick={() => { if (selectedCount > 0) onNext(); }}
              disabled={selectedCount === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold cursor-pointer select-none shadow-lg transition-all"
              style={{
                fontFamily: "'Fredoka', sans-serif", fontSize: 16,
                background: selectedCount === 0 ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)",
                color: selectedCount === 0 ? "rgba(255,255,255,0.3)" : "#3a0d0d",
                boxShadow: selectedCount === 0 ? "none" : "0 6px 20px -4px rgba(247,107,28,0.5)",
                cursor: selectedCount === 0 ? "not-allowed" : "pointer",
              }}
            >
              Continue →
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* RIGHT — Interactive scene + item deck */}
      <motion.div
        className="flex flex-col w-full md:w-[62%] h-full gap-3"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {/* Scene area */}
        <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/12 shadow-2xl min-h-[200px]">
          {/* Scene background */}
          <div className={`absolute inset-0 ${sceneStyle.bg} backdrop-blur-sm`} />

          {/* Ground strip */}
          {sceneStyle.ground && (
            <div className={`absolute bottom-0 left-0 right-0 h-14 ${sceneStyle.ground}`} />
          )}

          {/* Scene decorations */}
          {sceneStyle.deco.map((d, i) => {
            const parts = d.split(" ");
            const emoji = parts[0];
            const classes = parts.slice(1).join(" ");
            return <span key={i} className={`absolute text-2xl opacity-30 select-none ${classes}`}>{emoji}</span>;
          })}

          {/* Snowman body */}
          {page.category === "snowman" && (
            <div className="absolute flex flex-col items-center justify-end bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="w-20 h-20 bg-white/80 rounded-full shadow-inner mb-[-10px] z-10" />
              <div className="w-28 h-28 bg-white/80 rounded-full shadow-inner mb-[-15px]" />
              <div className="w-36 h-36 bg-white/80 rounded-full shadow-inner" />
            </div>
          )}

          {/* Breakfast plate */}
          {page.category === "breakfast" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-white border border-white/20 shadow-2xl flex items-center justify-center">
                <div className="absolute w-[82%] h-[82%] rounded-full border border-stone-200/40 bg-stone-50/15 shadow-inner" />
                {selectedCount === 0 && (
                  <span className="text-stone-400/60 text-xs font-semibold text-center px-6 pointer-events-none select-none z-0">{page.dropLabel}</span>
                )}
                <AnimatePresence>
                  {page.items.filter(i => isSelected(i.id)).map((item, idx) => {
                    const pos = foodPlacements[idx] || { top: "35%", left: "35%", rotate: 0 };
                    return (
                      <motion.button
                        layoutId={`item-fly-${item.id}`} key={item.id}
                        className="absolute w-14 h-14 flex flex-col items-center justify-center bg-white/95 rounded-2xl shadow-md border border-stone-100 hover:scale-110 active:scale-95 cursor-pointer z-10"
                        style={{ top: pos.top, left: pos.left }}
                        initial={{ scale: 0, rotate: pos.rotate - 30 }}
                        animate={{ scale: 1, rotate: pos.rotate }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 14, stiffness: 180 }}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        {item.imagePath ? <img src={item.imagePath} alt={item.label} className="w-9 h-9 object-contain drop-shadow-md select-none pointer-events-none" /> : <span className="text-3xl select-none">{item.emoji}</span>}
                        <span className="text-[7px] font-bold text-rose-900 mt-0.5 uppercase tracking-wide">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Gift box */}
          {page.category === "gifts" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-56 h-56 rounded-[2rem] bg-rose-950/30 border border-white/20 shadow-2xl flex items-center justify-center">
                <div className="absolute inset-4 rounded-[1.5rem] border border-dashed border-white/10 flex items-center justify-center">
                  <span className="text-[80px] opacity-8 pointer-events-none select-none">🎁</span>
                </div>
                {selectedCount === 0 && <span className="text-white/40 text-xs font-semibold text-center px-4 pointer-events-none select-none z-0">{page.dropLabel}</span>}
                <AnimatePresence>
                  {page.items.filter(i => isSelected(i.id)).map((item) => (
                    <motion.button
                      layoutId={`item-fly-${item.id}`} key={item.id}
                      className="absolute w-32 h-32 flex flex-col items-center justify-center bg-white border border-rose-100 rounded-[1.5rem] shadow-2xl hover:scale-105 active:scale-95 cursor-pointer z-10"
                      initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 5 }} exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 14, stiffness: 150 }}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <span className="absolute top-2 right-2 text-base animate-pulse">✨</span>
                      {item.imagePath ? <img src={item.imagePath} alt={item.label} className="w-14 h-14 object-contain drop-shadow-md select-none pointer-events-none" /> : <span className="text-5xl select-none">{item.emoji}</span>}
                      <span className="text-[9px] font-extrabold text-[#4A0E1B] mt-1.5 uppercase tracking-widest">{item.label}</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* All other scattered scenes */}
          {!["breakfast", "gifts"].includes(page.category) && (
            <>
              {selectedCount === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/30 text-sm font-semibold text-center select-none">{page.dropLabel}</span>
                </div>
              )}
              <AnimatePresence>
                {page.items.filter(i => isSelected(i.id)).map((item) => {
                  const pos = getPlacements(item.id);
                  return (
                    <motion.button
                      layoutId={`item-fly-${item.id}`} key={item.id}
                      className="absolute flex flex-col items-center justify-center cursor-pointer p-2 rounded-2xl hover:bg-white/10 active:scale-95 z-10"
                      style={{ top: pos.top, left: pos.left }}
                      initial={{ scale: 0, rotate: pos.rotate - 20 }}
                      animate={{ scale: pos.scale, rotate: pos.rotate }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 180 }}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      {item.imagePath
                        ? <img src={item.imagePath} alt={item.label} className="w-12 h-12 object-contain drop-shadow-md select-none pointer-events-none" />
                        : <span className="text-4xl md:text-5xl filter drop-shadow-md select-none">{item.emoji}</span>
                      }
                      {page.category !== "snowman" && (
                        <span className="text-[8px] font-bold text-white bg-black/35 rounded-full px-1.5 mt-1 select-none whitespace-nowrap">
                          {item.label} ✕
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </>
          )}

          {/* Sparkles overlay */}
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div key={p.id} className="absolute rounded-full"
                  style={{ background: p.color, width: p.size, height: p.size }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, ease: "easeOut" }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Item selection deck */}
        <div className="flex-shrink-0 bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-xl">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {page.items.map((item) => {
              const active = isSelected(item.id);
              const disabled = !active && !canAdd;
              return (
                <motion.div key={item.id} whileHover={disabled || active ? {} : { y: -4, scale: 1.04 }} whileTap={disabled || active ? {} : { scale: 0.94 }}>
                  <button
                    onClick={() => handleTapItem(item)}
                    disabled={disabled}
                    className="w-full aspect-square bg-white rounded-2xl flex flex-col items-center justify-center p-2 relative shadow-md transition-all duration-200 border-2"
                    style={{
                      borderColor: active ? "#FCD34D" : "rgba(255,255,255,0.35)",
                      opacity: disabled ? 0.4 : 1,
                      cursor: disabled ? "not-allowed" : active ? "default" : "pointer",
                      boxShadow: active ? "0 0 16px rgba(252,211,77,0.45)" : "0 4px 8px rgba(0,0,0,0.08)",
                    }}
                    aria-checked={active} aria-label={item.label}
                  >
                    {!active && (
                      <motion.span layoutId={`item-fly-${item.id}`} className="text-3xl leading-none select-none filter drop-shadow-sm">
                        {item.imagePath
                          ? <img src={item.imagePath} alt={item.label} className="w-9 h-9 object-contain select-none pointer-events-none" />
                          : item.emoji
                        }
                      </motion.span>
                    )}
                    {active && (
                      <span className="text-3xl leading-none select-none opacity-20">
                        {item.imagePath
                          ? <img src={item.imagePath} alt={item.label} className="w-9 h-9 object-contain select-none pointer-events-none grayscale opacity-60" />
                          : item.emoji
                        }
                      </span>
                    )}
                    <span className="text-center font-bold mt-1.5 px-1 leading-tight select-none" style={{ fontSize: 9, color: "#4A0E1B" }}>
                      {item.label}
                    </span>
                    {active && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center border border-white text-[9px] font-bold text-amber-900">✓</div>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
