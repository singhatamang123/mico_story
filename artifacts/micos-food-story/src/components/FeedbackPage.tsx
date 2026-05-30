import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeedbackPageData, GIFT_REACTIONS, EAT_REACTIONS, getItemEmoji, getItemLabel, getItemImagePath } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";
import { useSound } from "@/hooks/useSound";
import Character from "./Character";
import { interpolateStoryText } from "@/utils/storyText";

interface FeedbackPageProps {
  page: FeedbackPageData;
  onNext: () => void;
  onBack: () => void;
}

interface Reaction { id: number; text: string; }
interface FlyingItem { id: number; emoji: string; imagePath?: string; startX: number; startY: number; targetX: number; targetY: number; }

export default function FeedbackPage({ page, onNext, onBack }: FeedbackPageProps) {
  const { choices, selectedSeason, chosenPath } = useStoryStore();
  const { play } = useSound();
  const selected = choices[page.category] || [];

  const [fedItems, setFedItems] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [isCharacterReacting, setIsCharacterReacting] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [ambientSparkles, setAmbientSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const allFed = selected.length > 0 && fedItems.size >= selected.length;
  const micoAnimState = isCharacterReacting ? "eating" : allFed ? "happy" : "idle";

  const getReactionText = useCallback((itemId: string) => {
    if (page.reactionType === "eat") return EAT_REACTIONS[Math.floor(Math.random() * EAT_REACTIONS.length)];
    if (page.reactionType === "gift") {
      const list = GIFT_REACTIONS[itemId];
      if (list) return list[Math.floor(Math.random() * list.length)];
    }
    return "Yay! ✨";
  }, [page.reactionType]);

  const executeFeedingReaction = useCallback((itemId: string) => {
    play("pop");
    setIsCharacterReacting(true);
    setTimeout(() => setIsCharacterReacting(false), 550);
    const reaction: Reaction = { id: Date.now(), text: getReactionText(itemId) };
    setReactions(prev => [...prev, reaction]);
    setTimeout(() => setReactions(prev => prev.filter(r => r.id !== reaction.id)), 2600);
    const sparks = Array.from({ length: 6 }, (_, i) => ({ id: Date.now() + i, x: (Math.random() - 0.5) * 160, y: (Math.random() - 0.5) * 160 }));
    setAmbientSparkles(prev => [...prev, ...sparks]);
    setTimeout(() => setAmbientSparkles(prev => prev.filter(s => !sparks.find(es => es.id === s.id))), 1200);
  }, [getReactionText, play]);

  const triggerReaction = useCallback((itemId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (fedItems.has(itemId)) return;
    play("pickup");
    setFedItems(prev => new Set(prev).add(itemId));
    const rect = event.currentTarget.getBoundingClientRect();
    let tX = window.innerWidth * 0.75, tY = window.innerHeight * 0.5;
    const charEl = document.getElementById("character-target");
    if (charEl) { const cr = charEl.getBoundingClientRect(); tX = cr.left + cr.width / 2; tY = cr.top + cr.height / 2; }
    const flying: FlyingItem = { id: Date.now(), emoji: getItemEmoji(itemId), imagePath: getItemImagePath(itemId), startX: rect.left + rect.width / 2, startY: rect.top + rect.height / 2, targetX: tX, targetY: tY };
    setFlyingItems(prev => [...prev, flying]);
    setTimeout(() => { setFlyingItems(prev => prev.filter(i => i.id !== flying.id)); executeFeedingReaction(itemId); }, 600);
  }, [fedItems, executeFeedingReaction, play]);

  const triggerDirectFeeding = useCallback((itemId: string) => {
    if (fedItems.has(itemId)) return;
    setFedItems(prev => new Set(prev).add(itemId));
    executeFeedingReaction(itemId);
  }, [fedItems, executeFeedingReaction]);

  const buildDynamicText = () => {
    if (selected.length === 0) return `${page.dynamicPrefix} nothing yet!`;
    const labels = selected.map(id => getItemLabel(id));
    if (labels.length === 1) return `${page.dynamicPrefix} ${labels[0]}!`;
    if (labels.length === 2) return `${page.dynamicPrefix} ${labels[0]} and ${labels[1]}!`;
    return `${page.dynamicPrefix} ${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}!`;
  };

  const dynamicText = buildDynamicText();
  const resolvedStaticText = interpolateStoryText(page.staticText, choices, selectedSeason, chosenPath);
  const staticLines = resolvedStaticText.split("\n");
  const fullText = dynamicText + resolvedStaticText.replace(/\n/g, "");
  const totalChars = fullText.length;

  const [revealedChars, setRevealedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => { setRevealedChars(0); setIsTyping(true); }, [page.id]);
  useEffect(() => {
    if (isTyping && revealedChars < totalChars) {
      const t = setTimeout(() => { setRevealedChars(p => p + 1); if (revealedChars % 3 === 0) play("type"); }, 35);
      return () => clearTimeout(t);
    } else if (revealedChars >= totalChars && isTyping) setIsTyping(false);
  }, [revealedChars, totalChars, isTyping, play]);

  const handleContinue = () => {
    if (isTyping) { setRevealedChars(totalChars); setIsTyping(false); } else onNext();
  };

  let currentCount = 0;
  const renderText = (text: string) => {
    if (currentCount >= revealedChars) { currentCount += text.length; return <span className="opacity-0">{text}</span>; }
    const remaining = revealedChars - currentCount;
    currentCount += text.length;
    if (remaining >= text.length) return <span>{text}</span>;
    return <span>{text.slice(0, remaining)}<span className="opacity-0">{text.slice(remaining)}</span></span>;
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col md:flex-row items-stretch pt-14 md:pt-16 pb-4 px-4 md:px-10 gap-4 md:gap-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Flying projectiles overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {flyingItems.map((item) => (
            <motion.div key={item.id} className="absolute text-5xl filter drop-shadow-lg"
              initial={{ left: item.startX, top: item.startY, scale: 0.8, rotate: 0 }}
              animate={{ left: [item.startX, (item.startX + item.targetX) / 2, item.targetX], top: [item.startY, Math.min(item.startY, item.targetY) - 100, item.targetY], scale: [1, 1.4, 0.9], rotate: 360 }}
              style={{ x: "-50%", y: "-50%" }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {item.imagePath ? <img src={item.imagePath} alt="" className="w-12 h-12 object-contain select-none pointer-events-none" /> : item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LEFT — Text + items tray */}
      <motion.div
        className="flex flex-col w-full md:w-[48%] h-full"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex-1 flex flex-col bg-black/35 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header badge */}
          <div className="px-6 pt-5 pb-3 flex-shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300/80 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {page.reactionType === "gift" ? "🎁 Gift Time" : "🍴 Feeding Time"}
            </span>
          </div>

          {/* Scrollable story text */}
          <div className="flex-1 overflow-y-auto px-6 pb-4 scrollbar-hide">
            <p
              className="font-bold leading-tight mb-3"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(17px, 1.9vw, 26px)",
                background: "linear-gradient(135deg, #FDE68A, #FCD34D)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >
              {renderText(dynamicText)}
            </p>

            <p className="leading-relaxed text-white/80 mb-5"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(14px, 1.6vw, 20px)", lineHeight: 1.6 }}
            >
              {staticLines.map((line, i) =>
                line === "" ? <br key={i} /> : <span key={i} className="block">{renderText(line)}</span>
              )}
            </p>

            {/* Items tray */}
            {selected.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/70 block mb-3">
                  {page.dragPrompt}
                </span>
                <div className="flex flex-wrap gap-3">
                  {selected.map((itemId) => {
                    const fed = fedItems.has(itemId);
                    const imgPath = getItemImagePath(itemId);
                    return (
                      <motion.button
                        key={itemId}
                        drag={!fed} dragSnapToOrigin dragElastic={0.4}
                        onDragStart={() => play("pickup")}
                        onDragEnd={(_, info) => {
                          const charEl = document.getElementById("character-target");
                          if (charEl) {
                            const r = charEl.getBoundingClientRect();
                            if (info.point.x >= r.left && info.point.x <= r.right && info.point.y >= r.top && info.point.y <= r.bottom) triggerDirectFeeding(itemId);
                          }
                        }}
                        whileDrag={{ scale: 1.15, zIndex: 100, boxShadow: "0 20px 30px rgba(0,0,0,0.25)" }}
                        whileHover={!fed ? { y: -4, scale: 1.05 } : {}}
                        whileTap={!fed ? { scale: 0.95 } : {}}
                        onClick={(e) => triggerReaction(itemId, e)}
                        className="flex flex-col items-center gap-1.5 rounded-2xl p-2.5 cursor-pointer select-none bg-white border border-white/40 shadow-md relative touch-none"
                        style={{ width: 72, opacity: fed ? 0.35 : 1, pointerEvents: fed ? "none" : "auto", touchAction: "none" }}
                        aria-label={`Interact with ${itemId}`}
                      >
                        {imgPath
                          ? <img src={imgPath} alt={getItemLabel(itemId)} className="w-10 h-10 object-contain drop-shadow-md select-none pointer-events-none" />
                          : <span className="text-3xl filter drop-shadow-sm select-none">{getItemEmoji(itemId)}</span>
                        }
                        <span className="text-center font-bold leading-tight truncate w-full" style={{ fontSize: 9, color: "#4A0E1B" }}>
                          {getItemLabel(itemId)}
                        </span>
                        {fed && (
                          <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center pointer-events-none">
                            <span className="text-white text-xs bg-black/50 px-1.5 py-0.5 rounded-md font-bold">✓</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Nav footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-white/8 flex items-center justify-between gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-white/70 border border-white/15 bg-white/8 hover:bg-white/15 transition-colors cursor-pointer select-none"
              style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 15 }}
            >
              ← Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold cursor-pointer select-none shadow-lg"
              style={{
                fontFamily: "'Fredoka', sans-serif", fontSize: 16,
                background: "linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)",
                color: "#3a0d0d",
                boxShadow: "0 6px 20px -4px rgba(247,107,28,0.5)",
              }}
            >
              {isTyping ? "Show All" : "Continue →"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* RIGHT — Character + reactions */}
      <motion.div
        className="flex items-center justify-center w-full md:w-[52%] h-full relative"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {/* Ambient glow */}
        <div className="absolute w-72 h-72 rounded-full bg-amber-400/10 blur-[80px] pointer-events-none" />
        <div className="absolute w-48 h-48 rounded-full bg-white/5 blur-[40px] pointer-events-none" />

        {/* Sparkle pops */}
        <AnimatePresence>
          {ambientSparkles.map((s) => (
            <motion.div key={s.id} className="absolute text-xl pointer-events-none z-20 select-none"
              style={{ left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)` }}
              initial={{ scale: 0, opacity: 1 }} animate={{ scale: [0, 1.5, 0], opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >✨</motion.div>
          ))}
        </AnimatePresence>

        {/* Reaction speech bubbles */}
        <AnimatePresence>
          {reactions.map((reaction) => (
            <motion.div key={reaction.id}
              className="absolute z-20 speech-bubble-tail whitespace-pre-wrap rounded-2xl px-5 py-3 text-sm font-bold shadow-2xl border border-amber-200/40 bg-white/95 text-[#4A0E1B] text-center max-w-[200px]"
              style={{ top: "15%", left: "50%", boxShadow: "0 10px 25px -5px rgba(74,14,27,0.2)" }}
              initial={{ y: 20, opacity: 0, scale: 0.7, x: "-50%" }}
              animate={{ y: 0, opacity: 1, scale: 1, x: "-50%" }}
              exit={{ y: -20, opacity: 0, scale: 0.7, x: "-50%" }}
              transition={{ type: "spring", damping: 12, stiffness: 220 }}
            >
              {reaction.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Character */}
        <div id="character-target" className="z-10">
          <Character emoji={page.characterEmoji} imagePath={page.characterImagePath} animationState={micoAnimState} size="large" />
        </div>

        {/* Idle feed prompt */}
        {fedItems.size < selected.length && (
          <motion.div
            className="absolute bottom-8 bg-black/40 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full text-white text-xs font-semibold select-none z-10 pointer-events-none"
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.2, repeat: Infinity }}
          >
            👉 {page.reactionType === "gift" ? "Give Mico a gift!" : "Feed Mico to see what happens!"}
          </motion.div>
        )}
        {allFed && (
          <motion.div
            className="absolute bottom-8 bg-amber-400/20 backdrop-blur-md border border-amber-400/30 px-4 py-2 rounded-full text-amber-200 text-xs font-bold select-none z-10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}
          >
            ✨ Mico is happy!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
