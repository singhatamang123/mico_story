import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActivityPageData, StoryItem } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";
import { useSound } from "@/hooks/useSound";
import NavButtons from "./NavButtons";
import Character from "./Character";

interface ActivityPageProps {
  page: ActivityPageData;
  onNext: () => void;
  onBack: () => void;
}

// Layout placements for the Meadow scene
const animalPlacements: Record<string, { top: string; left: string; rotate: number; scale: number }> = {
  rabbit: { top: "65%", left: "20%", rotate: 0, scale: 1.15 },
  butterfly: { top: "25%", left: "70%", rotate: -15, scale: 1 },
  squirrel: { top: "50%", left: "15%", rotate: 5, scale: 1.1 },
  bird: { top: "22%", left: "35%", rotate: -10, scale: 1 },
  badger: { top: "62%", left: "75%", rotate: 0, scale: 1.2 },
  hedgehog: { top: "72%", left: "48%", rotate: 8, scale: 1.05 },
};

// Layout placements for the Beach scene
const beachPlacements: Record<string, { top: string; left: string; rotate: number; scale: number }> = {
  shell:     { top: "60%", left: "18%", rotate: -12, scale: 1.1 },
  crab:      { top: "65%", left: "72%", rotate:   8, scale: 1.15 },
  starfish:  { top: "22%", left: "62%", rotate:  15, scale: 1.0 },
  fish:      { top: "30%", left: "20%", rotate: -10, scale: 1.0 },
  jellyfish: { top: "20%", left: "42%", rotate:   5, scale: 0.95 },
  seahorse:  { top: "55%", left: "45%", rotate:  -8, scale: 1.05 },
};

// Layout placements for the Forest scene
const forestPlacements: Record<string, { top: string; left: string; rotate: number; scale: number }> = {
  mushroom: { top: "68%", left: "25%", rotate: -5, scale: 1.1 },
  acorn:    { top: "60%", left: "65%", rotate: 12, scale: 1.0 },
  firefly:  { top: "25%", left: "75%", rotate: -15, scale: 1.15 },
  crystal:  { top: "45%", left: "15%", rotate: 5, scale: 1.1 },
  leaf:     { top: "22%", left: "30%", rotate: 20, scale: 1.05 },
  pinecone: { top: "50%", left: "80%", rotate: -8, scale: 1.0 },
};

// Layout placements for the Snowman scene
const snowmanPlacements: Record<string, { top: string; left: string; rotate: number; scale: number }> = {
  snowman_hat:    { top: "10%", left: "50%", rotate: -5, scale: 1.2 }, // on top of head
  snowman_scarf:  { top: "35%", left: "50%", rotate: 0, scale: 1.2 }, // neck area
  snowman_carrot: { top: "25%", left: "50%", rotate: 5, scale: 1.1 }, // face
  snowman_arms:   { top: "50%", left: "50%", rotate: 0, scale: 1.4 }, // across middle body
};

// Layout placements for the Puddle scene
const puddlePlacements: Record<string, { top: string; left: string; rotate: number; scale: number }> = {
  frog:      { top: "68%", left: "18%", rotate: 0, scale: 1.2 },
  raindrop:  { top: "25%", left: "70%", rotate: 10, scale: 0.95 },
  leaf_boat: { top: "68%", left: "45%", rotate: -8, scale: 1.15 },
  umbrella:  { top: "22%", left: "28%", rotate: -15, scale: 1.1 },
  snail:     { top: "72%", left: "75%", rotate: 5, scale: 1.05 },
  rainbow:   { top: "20%", left: "50%", rotate: 0, scale: 1.25 },
};

// Layout placements for the Plate scene (up to 4 items)
const foodPlacements = [
  { top: "22%", left: "22%", rotate: -10 },
  { top: "22%", left: "58%", rotate: 12 },
  { top: "58%", left: "22%", rotate: 8 },
  { top: "58%", left: "58%", rotate: -5 },
];

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
    const newParticles = Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 80 + 60;
      return {
        id: Date.now() + i + Math.random(),
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
        color: colors[i % colors.length],
        size: Math.random() * 6 + 4,
      };
    });
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 750);
  };

  const handleTapItem = (item: StoryItem) => {
    if (isSelected(item.id)) {
      removeChoice(page.category, item.id);
      play("click");
    } else if (canAdd) {
      addChoice(page.category, item.id);
      play("drop");
      spawnSparkles();
    }
  };

  const handleRemoveItem = (id: string) => {
    removeChoice(page.category, id);
    play("click");
  };



  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Left: instruction details narrative card */}
      <div className="flex flex-col justify-between w-full md:w-1/2 p-6 md:p-12 overflow-y-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="my-auto max-w-xl mx-auto w-full p-4 md:p-8"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200/50">
              Interactive Choice
            </span>
            <h2
              className="font-bold text-[#4A0E1B] mt-4 mb-3 leading-tight"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(24px, 3vw, 42px)",
              }}
            >
              {page.title}
            </h2>
            <p
              className="text-rose-950/80 font-medium"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(15px, 1.6vw, 20px)",
              }}
            >
              {page.instruction}
            </p>

            {page.maxItems > 1 && (
              <div className="flex items-center gap-2 mt-4">
                <div className="h-1.5 flex-1 bg-rose-950/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-700 transition-all duration-300 rounded-full" 
                    style={{ width: `${(selectedCount / page.maxItems) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-rose-900 whitespace-nowrap">
                  {selectedCount} / {page.maxItems} selected
                </span>
              </div>
            )}
          </div>
          
          <NavButtons
            onBack={() => { clearChoices(page.category); onBack(); }}
            onContinue={onNext}
            continueDisabled={selectedCount === 0}
          />
        </motion.div>
      </div>

      {/* Right: interactive scene & items deck */}
      <div className="flex flex-col items-center justify-between w-full md:w-1/2 p-6 overflow-y-auto relative bg-transparent">
        {/* Soft atmospheric backlight */}
        <div className="absolute top-10 w-[70%] h-[40%] rounded-full bg-white/10 blur-[80px] pointer-events-none" />
        
        {/* Sitting Mico Avatar */}
        <div className="absolute top-4 right-4 z-20 opacity-90 hidden md:block" style={{ transform: 'scale(0.65)', transformOrigin: 'top right' }}>
          <Character 
            emoji="😎" 
            imagePath="/images/mico-idle.png" 
            animationState="sitting" 
            size="normal"
          />
        </div>

        {/* Target Container Area */}
        <div className="flex-1 w-full max-w-md flex items-center justify-center min-h-[260px] relative z-10">
          
          {/* Sparkles Overlay */}
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    background: p.color,
                    width: p.size,
                    height: p.size,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: 0,
                    scale: 0.1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, ease: "easeOut" }}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* BREAKFAST PLATE SCENE */}
          {page.category === "breakfast" && (
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full bg-white border border-white/20 shadow-2xl flex items-center justify-center flex-shrink-0">
              {/* Inner plate ridge */}
              <div className="absolute w-[82%] h-[82%] rounded-full border border-stone-200/50 bg-stone-50/20 shadow-inner" />
              
              {selectedCount === 0 && (
                <span className="text-stone-400 text-sm font-semibold tracking-wider text-center px-6 pointer-events-none select-none z-0">
                  {page.dropLabel}
                </span>
              )}

              {/* Items on plate */}
              <AnimatePresence>
                {page.items.filter(item => isSelected(item.id)).map((item, idx) => {
                  const pos = foodPlacements[idx] || { top: "35%", left: "35%", rotate: 0 };
                  return (
                    <motion.button
                      layoutId={`item-fly-${item.id}`}
                      key={item.id}
                      className="absolute w-16 h-16 flex flex-col items-center justify-center bg-white/95 rounded-2xl shadow-md border border-stone-100 hover:scale-110 active:scale-95 cursor-pointer z-10"
                      style={{
                        top: pos.top,
                        left: pos.left,
                      }}
                      initial={{ scale: 0, rotate: pos.rotate - 30 }}
                      animate={{ scale: 1, rotate: pos.rotate }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 14, stiffness: 180 }}
                      onClick={() => handleRemoveItem(item.id)}
                      title={`Remove ${item.label}`}
                    >
                      {item.imagePath ? (
                        <img src={item.imagePath} alt={item.label} className="w-10 h-10 object-contain drop-shadow-md select-none pointer-events-none" />
                      ) : (
                        <span className="text-3xl select-none">{item.emoji}</span>
                      )}
                      <span className="text-[8px] font-bold text-rose-900 mt-1 uppercase tracking-wider">{item.label}</span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* MEADOW SCENE */}
          {page.category === "animals" && (
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-[2rem] border border-white/20 bg-emerald-950/20 backdrop-blur-sm shadow-2xl overflow-hidden flex items-center justify-center">
              
              {/* Scenic elements (trees & flowers) */}
              <span className="absolute bottom-4 left-6 text-2xl opacity-40 select-none">🌲</span>
              <span className="absolute bottom-6 right-8 text-2xl opacity-40 select-none">🌳</span>
              <span className="absolute top-6 left-12 text-lg opacity-25 select-none">☁️</span>
              <span className="absolute top-8 right-20 text-lg opacity-25 select-none">☁️</span>
              
              {selectedCount === 0 && (
                <span className="text-white/40 text-sm font-semibold tracking-wider text-center pointer-events-none select-none z-0">
                  {page.dropLabel}
                </span>
              )}

              {/* Animals in Meadow */}
              <AnimatePresence>
                {page.items.filter(item => isSelected(item.id)).map((item) => {
                  const pos = animalPlacements[item.id] || { top: "50%", left: "50%", rotate: 0, scale: 1 };
                  return (
                    <motion.button
                      layoutId={`item-fly-${item.id}`}
                      key={item.id}
                      className="absolute flex flex-col items-center justify-center cursor-pointer p-2 rounded-2xl hover:bg-white/10 active:scale-95 z-10"
                      style={{
                        top: pos.top,
                        left: pos.left,
                      }}
                      initial={{ scale: 0, rotate: pos.rotate - 20 }}
                      animate={{ scale: pos.scale, rotate: pos.rotate }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 180 }}
                      onClick={() => handleRemoveItem(item.id)}
                      title={`Greet/Remove ${item.label}`}
                    >
                      {item.imagePath ? (
                        <img src={item.imagePath} alt={item.label} className="w-12 h-12 object-contain drop-shadow-md select-none pointer-events-none" />
                      ) : (
                        <span className="text-4xl md:text-5xl filter drop-shadow-md select-none">{item.emoji}</span>
                      )}
                      <span className="text-[8px] font-bold text-white bg-black/30 rounded-full px-1.5 mt-1 select-none whitespace-nowrap">
                        {item.label} ✕
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* BEACH BUCKET SCENE */}
          {page.category === "beach" && (
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-[2rem] border border-white/20 bg-sky-950/30 backdrop-blur-sm shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Scenic beach elements */}
              <span className="absolute bottom-3 left-4 text-2xl opacity-40 select-none">🌊</span>
              <span className="absolute bottom-3 right-6 text-2xl opacity-40 select-none">🌊</span>
              <span className="absolute top-4 right-10 text-lg opacity-25 select-none">☀️</span>
              <span className="absolute top-6 left-14 text-lg opacity-20 select-none">⛅</span>
              {/* Sandy ground */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-amber-200/20 rounded-b-[2rem]" />

              {selectedCount === 0 && (
                <span className="text-white/40 text-sm font-semibold tracking-wider text-center pointer-events-none select-none z-0">
                  {page.dropLabel}
                </span>
              )}

              {/* Beach treasures scattered on shore */}
              <AnimatePresence>
                {page.items.filter(item => isSelected(item.id)).map((item) => {
                  const pos = beachPlacements[item.id] || { top: "50%", left: "50%", rotate: 0, scale: 1 };
                  return (
                    <motion.button
                      layoutId={`item-fly-${item.id}`}
                      key={item.id}
                      className="absolute flex flex-col items-center justify-center cursor-pointer p-2 rounded-2xl hover:bg-white/10 active:scale-95 z-10"
                      style={{ top: pos.top, left: pos.left }}
                      initial={{ scale: 0, rotate: pos.rotate - 20 }}
                      animate={{ scale: pos.scale, rotate: pos.rotate }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 180 }}
                      onClick={() => handleRemoveItem(item.id)}
                      title={`Remove ${item.label}`}
                    >
                      <span className="text-4xl md:text-5xl filter drop-shadow-md select-none">{item.emoji}</span>
                      <span className="text-[8px] font-bold text-white bg-black/30 rounded-full px-1.5 mt-1 select-none whitespace-nowrap">
                        {item.label} ✕
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* FOREST SCENE */}
          {page.category === "forest" && (
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-[2rem] border border-white/20 bg-emerald-950/40 backdrop-blur-sm shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Scenic forest elements */}
              <span className="absolute bottom-2 left-6 text-3xl opacity-30 select-none">🌿</span>
              <span className="absolute bottom-4 right-10 text-2xl opacity-30 select-none">🍄</span>
              <span className="absolute top-4 left-10 text-lg opacity-40 select-none animate-pulse">✨</span>
              <span className="absolute top-10 right-16 text-xl opacity-40 select-none animate-pulse">✨</span>
              {/* Mossy ground */}
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-green-900/30 rounded-b-[2rem] border-t border-white/5" />

              {selectedCount === 0 && (
                <span className="text-white/40 text-sm font-semibold tracking-wider text-center pointer-events-none select-none z-0">
                  {page.dropLabel}
                </span>
              )}

              {/* Forest treasures in the pouch */}
              <AnimatePresence>
                {page.items.filter(item => isSelected(item.id)).map((item) => {
                  const pos = forestPlacements[item.id] || { top: "50%", left: "50%", rotate: 0, scale: 1 };
                  return (
                    <motion.button
                      layoutId={`item-fly-${item.id}`}
                      key={item.id}
                      className="absolute flex flex-col items-center justify-center cursor-pointer p-2 rounded-2xl hover:bg-white/10 active:scale-95 z-10"
                      style={{ top: pos.top, left: pos.left }}
                      initial={{ scale: 0, rotate: pos.rotate - 20 }}
                      animate={{ scale: pos.scale, rotate: pos.rotate }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 180 }}
                      onClick={() => handleRemoveItem(item.id)}
                      title={`Remove ${item.label}`}
                    >
                      <span className="text-4xl md:text-5xl filter drop-shadow-lg select-none">{item.emoji}</span>
                      <span className="text-[8px] font-bold text-white bg-black/40 rounded-full px-1.5 mt-1 select-none whitespace-nowrap">
                        {item.label} ✕
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* SNOWMAN SCENE */}
          {page.category === "snowman" && (
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-[2rem] border border-white/20 bg-sky-900/40 backdrop-blur-sm shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Snowfall elements */}
              <span className="absolute top-4 left-8 text-2xl opacity-40 select-none animate-pulse">❄️</span>
              <span className="absolute top-10 right-12 text-3xl opacity-30 select-none animate-pulse">❄️</span>
              <span className="absolute bottom-20 left-16 text-xl opacity-50 select-none animate-pulse">❄️</span>
              {/* Snowy ground */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/30 rounded-b-[2rem] border-t border-white/20" />
              
              {/* Base snowman body (rendered if nothing selected or behind items) */}
              <div className="absolute flex flex-col items-center justify-end bottom-12 pointer-events-none">
                <div className="w-20 h-20 bg-white/80 rounded-full shadow-inner mb-[-10px] z-10" /> {/* Head */}
                <div className="w-28 h-28 bg-white/80 rounded-full shadow-inner mb-[-15px]" />     {/* Torso */}
                <div className="w-36 h-36 bg-white/80 rounded-full shadow-inner" />                 {/* Base */}
              </div>

              {selectedCount === 0 && (
                <span className="text-white/60 text-sm font-semibold tracking-wider text-center pointer-events-none select-none z-0 mt-32">
                  {page.dropLabel}
                </span>
              )}

              {/* Snowman accessories */}
              <AnimatePresence>
                {page.items.filter(item => isSelected(item.id)).map((item) => {
                  const pos = snowmanPlacements[item.id] || { top: "50%", left: "50%", rotate: 0, scale: 1 };
                  return (
                    <motion.button
                      layoutId={`item-fly-${item.id}`}
                      key={item.id}
                      className="absolute flex flex-col items-center justify-center cursor-pointer p-2 rounded-2xl hover:bg-white/10 active:scale-95 z-20 -translate-x-1/2 -translate-y-1/2"
                      style={{ top: pos.top, left: pos.left }}
                      initial={{ scale: 0, rotate: pos.rotate - 20 }}
                      animate={{ scale: pos.scale, rotate: pos.rotate }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 180 }}
                      onClick={() => handleRemoveItem(item.id)}
                      title={`Remove ${item.label}`}
                    >
                      <span className="text-5xl md:text-6xl filter drop-shadow-md select-none">{item.emoji}</span>
                      {/* Hide label for snowman pieces to make it look cleaner */}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* RAIN PUDDLE SCENE */}
          {page.category === "puddles" && (
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-[2rem] border border-white/20 bg-slate-900/40 backdrop-blur-sm shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Rain clouds & drops */}
              <span className="absolute top-4 left-6 text-3xl opacity-20 select-none animate-bounce">🌧️</span>
              <span className="absolute top-6 right-16 text-3xl opacity-20 select-none animate-bounce">🌧️</span>
              <span className="absolute bottom-16 left-20 text-xl opacity-30 select-none">💧</span>
              <span className="absolute bottom-24 right-24 text-xl opacity-30 select-none">💧</span>
              
              {/* Water ground */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-900/20 rounded-b-[2rem] border-t border-white/5" />
              
              {selectedCount === 0 && (
                <span className="text-white/40 text-sm font-semibold tracking-wider text-center pointer-events-none select-none z-0">
                  {page.dropLabel}
                </span>
              )}

              {/* Rain treasures */}
              <AnimatePresence>
                {page.items.filter(item => isSelected(item.id)).map((item) => {
                  const pos = puddlePlacements[item.id] || { top: "50%", left: "50%", rotate: 0, scale: 1 };
                  return (
                    <motion.button
                      layoutId={`item-fly-${item.id}`}
                      key={item.id}
                      className="absolute flex flex-col items-center justify-center cursor-pointer p-2 rounded-2xl hover:bg-white/10 active:scale-95 z-10"
                      style={{ top: pos.top, left: pos.left }}
                      initial={{ scale: 0, rotate: pos.rotate - 20 }}
                      animate={{ scale: pos.scale, rotate: pos.rotate }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 180 }}
                      onClick={() => handleRemoveItem(item.id)}
                      title={`Remove ${item.label}`}
                    >
                      <span className="text-4xl md:text-5xl filter drop-shadow-md select-none">{item.emoji}</span>
                      <span className="text-[8px] font-bold text-white bg-black/30 rounded-full px-1.5 mt-1 select-none whitespace-nowrap">
                        {item.label} ✕
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* GIFT BOX SCENE */}
          {page.category === "gifts" && (
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-[2rem] bg-rose-950/20 backdrop-blur-sm border border-white/20 shadow-2xl flex flex-col items-center justify-center">
              
              {/* Outer Gift Ribbon Backdrop */}
              <div className="absolute inset-4 rounded-[1.5rem] border border-dashed border-white/10 flex items-center justify-center">
                <span className="text-[100px] opacity-10 pointer-events-none select-none">🎁</span>
              </div>

              {selectedCount === 0 && (
                <span className="text-white/40 text-sm font-semibold tracking-wider text-center px-4 pointer-events-none select-none z-0">
                  {page.dropLabel}
                </span>
              )}

              {/* Gift inside Box */}
              <AnimatePresence>
                {page.items.filter(item => isSelected(item.id)).map((item) => (
                  <motion.button
                    layoutId={`item-fly-${item.id}`}
                    key={item.id}
                    className="absolute w-36 h-36 flex flex-col items-center justify-center bg-white border border-rose-100 rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 cursor-pointer z-10"
                    initial={{ scale: 0, rotate: -25 }}
                    animate={{ scale: 1, rotate: 5 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 14, stiffness: 150 }}
                    onClick={() => handleRemoveItem(item.id)}
                    title={`Remove ${item.label}`}
                  >
                    {/* Sparkle sparkles */}
                    <span className="absolute top-2 right-2 text-lg animate-pulse">✨</span>
                    {item.imagePath ? (
                      <img src={item.imagePath} alt={item.label} className="w-16 h-16 object-contain drop-shadow-md select-none pointer-events-none" />
                    ) : (
                      <span className="text-6xl filter drop-shadow-md select-none">{item.emoji}</span>
                    )}
                    <span className="text-[10px] font-extrabold text-[#4A0E1B] mt-2 uppercase tracking-widest">{item.label}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* Choice Grid Deck */}
        <div className="w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-md rounded-3xl p-5 mt-4 z-10">
          <div className="grid grid-cols-3 gap-3">
            {page.items.map((item) => {
              const active = isSelected(item.id);
              const disabled = !active && !canAdd;

              return (
                <motion.div
                  key={item.id}
                  whileHover={disabled || active ? {} : { y: -4, scale: 1.03 }}
                  whileTap={disabled || active ? {} : { scale: 0.95 }}
                >
                  <button
                    onClick={() => handleTapItem(item)}
                    disabled={disabled}
                    className="w-full aspect-square bg-white rounded-2xl flex flex-col items-center justify-center p-2 relative shadow-md transition-all duration-300 border-2"
                    style={{
                      borderColor: active 
                        ? "#FCD34D" 
                        : "rgba(255, 255, 255, 0.4)",
                      opacity: active ? 0.35 : disabled ? 0.35 : 1,
                      cursor: disabled ? "not-allowed" : active ? "default" : "pointer",
                      boxShadow: active ? "0 0 15px rgba(252,211,77,0.4)" : "0 4px 6px rgba(0,0,0,0.06)",
                    }}
                    role="checkbox"
                    aria-checked={active}
                    aria-label={item.label}
                  >
                    {/* Shared layout emoji — hidden when active so it can fly to the target */}
                    {!active && (
                      <motion.span 
                        layoutId={`item-fly-${item.id}`}
                        className="text-4xl leading-none select-none filter drop-shadow-sm"
                      >
                        {item.imagePath ? (
                          <img src={item.imagePath} alt={item.label} className="w-10 h-10 object-contain drop-shadow-sm select-none pointer-events-none" />
                        ) : (
                          item.emoji
                        )}
                      </motion.span>
                    )}

                    {/* Ghost emoji shown in-place while item is selected on the target */}
                    {active && (
                      <span className="text-4xl leading-none select-none opacity-20">
                        {item.imagePath ? (
                          <img src={item.imagePath} alt={item.label} className="w-10 h-10 object-contain select-none pointer-events-none grayscale opacity-60" />
                        ) : (
                          item.emoji
                        )}
                      </span>
                    )}

                    <span
                      className="text-center font-bold mt-2 px-1 leading-tight select-none"
                      style={{ fontSize: 10, color: "#4A0E1B" }}
                    >
                      {item.label}
                    </span>

                    {/* Active Check badge */}
                    {active && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center border border-white text-[9px] font-bold text-[#4A0E1B]">
                        ✓
                      </div>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
