"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeedbackPageData, GIFT_REACTIONS, EAT_REACTIONS, getItemEmoji, getItemLabel, getItemImagePath } from "@/data/pages";
import { useStoryStore } from "@/store/storyStore";
import { useSound } from "@/hooks/useSound";
import NavButtons from "./NavButtons";
import Character from "./Character";
import { interpolateStoryText } from "@/utils/storyText";

interface FeedbackPageProps {
  page: FeedbackPageData;
  onNext: () => void;
  onBack: () => void;
}

interface Reaction {
  id: number;
  text: string;
}

interface FlyingItem {
  id: number;
  emoji: string;
  imagePath?: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

export default function FeedbackPage({ page, onNext, onBack }: FeedbackPageProps) {
  const { choices, selectedSeason, chosenPath } = useStoryStore();
  const { play } = useSound();
  const selected = choices[page.category] || [];
  
  const [fedItems, setFedItems] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [isCharacterReacting, setIsCharacterReacting] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [ambientSparkles, setAmbientSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Derive 3D animation state from feeding progress
  const allFed = selected.length > 0 && fedItems.size >= selected.length;
  const micoAnimState = isCharacterReacting ? "eating" : allFed ? "happy" : "idle";

  // Helpers to get reactions
  const getReactionText = useCallback((itemId: string) => {
    if (page.reactionType === "eat") {
      return EAT_REACTIONS[Math.floor(Math.random() * EAT_REACTIONS.length)];
    }
    if (page.reactionType === "gift") {
      const reactionsList = GIFT_REACTIONS[itemId];
      if (reactionsList) return reactionsList[Math.floor(Math.random() * reactionsList.length)];
    }
    return "Yay! ✨";
  }, [page.reactionType]);

  const executeFeedingReaction = useCallback((itemId: string) => {
    // Play pop/bite sound
    play("pop");

    // Character squish & chew animation
    setIsCharacterReacting(true);
    setTimeout(() => setIsCharacterReacting(false), 550);

    // Trigger reaction text bubble
    const newReaction: Reaction = {
      id: Date.now(),
      text: getReactionText(itemId),
    };
    setReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2600);

    // Spawn ambient explosion sparkles
    const explosion = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 160,
    }));
    setAmbientSparkles((prev) => [...prev, ...explosion]);
    setTimeout(() => {
      setAmbientSparkles((prev) => prev.filter(s => !explosion.find(es => es.id === s.id)));
    }, 1200);
  }, [getReactionText, play]);

  const triggerReaction = useCallback((itemId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (fedItems.has(itemId)) return;
    
    // Play initial pickup sound
    play("pickup");
    
    // Add to fed items
    setFedItems((prev) => new Set(prev).add(itemId));

    // Calculate flying path from click source
    const rect = event.currentTarget.getBoundingClientRect();
    let tX = window.innerWidth * 0.75;
    let tY = window.innerHeight * 0.5;
    const charEl = document.getElementById("character-target");
    if (charEl) {
      const charRect = charEl.getBoundingClientRect();
      tX = charRect.left + charRect.width / 2;
      tY = charRect.top + charRect.height / 2;
    }

    const newFlyingItem: FlyingItem = {
      id: Date.now(),
      emoji: getItemEmoji(itemId),
      imagePath: getItemImagePath(itemId),
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      targetX: tX,
      targetY: tY,
    };
    
    setFlyingItems((prev) => [...prev, newFlyingItem]);

    // When the item reaches Mico (approx 600ms)
    setTimeout(() => {
      // Remove flying item
      setFlyingItems((prev) => prev.filter(i => i.id !== newFlyingItem.id));
      
      executeFeedingReaction(itemId);
    }, 600);

  }, [fedItems, executeFeedingReaction, play]);

  const triggerDirectFeeding = useCallback((itemId: string) => {
    if (fedItems.has(itemId)) return;
    setFedItems((prev) => new Set(prev).add(itemId));
    executeFeedingReaction(itemId);
  }, [fedItems, executeFeedingReaction]);

  // Build dynamic description text
  const buildDynamicText = () => {
    if (selected.length === 0) return `${page.dynamicPrefix} nothing yet!`;
    const labels = selected.map(id => getItemLabel(id));
    if (labels.length === 1) return `${page.dynamicPrefix} ${labels[0]}!`;
    if (labels.length === 2) return `${page.dynamicPrefix} ${labels[0]} and ${labels[1]}!`;
    const allButLast = labels.slice(0, -1).join(", ");
    return `${page.dynamicPrefix} ${allButLast}, and ${labels[labels.length - 1]}!`;
  };


  const dynamicText = buildDynamicText();
  // Resolve {{FOOD}}, {{GIFT}}, {{TREASURE}} etc. using actual player choices
  const resolvedStaticText = interpolateStoryText(
    page.staticText,
    choices,
    selectedSeason,
    chosenPath
  );
  const staticLines = resolvedStaticText.split("\n");

  const fullText = dynamicText + resolvedStaticText.replace(/\n/g, "");
  const totalChars = fullText.length;

  const [revealedChars, setRevealedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setRevealedChars(0);
    setIsTyping(true);
  }, [page.id]);

  useEffect(() => {
    if (isTyping && revealedChars < totalChars) {
      const timer = setTimeout(() => {
        setRevealedChars((prev) => prev + 1);
        if (revealedChars % 3 === 0) {
          play("type");
        }
      }, 35);
      return () => clearTimeout(timer);
    } else if (revealedChars >= totalChars && isTyping) {
      setIsTyping(false);
    }
  }, [revealedChars, totalChars, isTyping, play]);

  const handleContinue = () => {
    if (isTyping) {
      setRevealedChars(totalChars);
      setIsTyping(false);
    } else {
      onNext();
    }
  };

  let currentCount = 0;
  const renderText = (text: string) => {
    if (currentCount >= revealedChars) {
      currentCount += text.length;
      return <span className="opacity-0">{text}</span>;
    }
    const remaining = revealedChars - currentCount;
    currentCount += text.length;
    if (remaining >= text.length) {
      return <span>{text}</span>;
    }
    const revealed = text.slice(0, remaining);
    const hidden = text.slice(remaining);
    return (
      <span>
        {revealed}
        <span className="opacity-0">{hidden}</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full relative overflow-hidden">
      
      {/* Absolute overlay container for flying food projectiles */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {flyingItems.map((item) => (
            <motion.div
              key={item.id}
              className="absolute text-5xl filter drop-shadow-lg"
              initial={{ left: item.startX, top: item.startY, scale: 0.8, rotate: 0 }}
              animate={{ 
                left: [item.startX, (item.startX + item.targetX) / 2, item.targetX], 
                top: [item.startY, Math.min(item.startY, item.targetY) - 100, item.targetY],
                scale: [1, 1.4, 0.9],
                rotate: 360 
              }}
              style={{
                x: "-50%",
                y: "-50%",
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {item.imagePath ? (
                <img src={item.imagePath} alt="" className="w-12 h-12 object-contain select-none pointer-events-none" />
              ) : (
                item.emoji
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Left: text card + items tray */}
      <div className="flex flex-col justify-between w-full md:w-1/2 p-6 md:p-12 overflow-y-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="my-auto max-w-xl mx-auto w-full p-4 md:p-8"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200/50">
              Interactive Story
            </span>

            <p
              className="font-bold text-[#4A0E1B] mt-5 mb-4 leading-tight"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(18px, 2vw, 28px)",
              }}
            >
              {renderText(dynamicText)}
            </p>

            <p
              className="leading-relaxed text-[#4A0E1B] mb-6"
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
                    {renderText(line)}
                  </span>
                )
              )}
            </p>

            {/* Interactive Items Tray */}
            <div className="bg-rose-950/5 border border-rose-950/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block mb-3">
                {page.dragPrompt}
              </span>
              <div className="flex flex-wrap gap-3">
                {selected.map((itemId) => {
                  const fed = fedItems.has(itemId);
                  return (
                    <motion.button
                      key={itemId}
                      drag={!fed}
                      dragSnapToOrigin
                      dragElastic={0.4}
                      onDragStart={() => {
                        play("pickup");
                      }}
                      onDragEnd={(event, info) => {
                        const charEl = document.getElementById("character-target");
                        if (charEl) {
                          const rect = charEl.getBoundingClientRect();
                          const { x, y } = info.point;
                          if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                            triggerDirectFeeding(itemId);
                          }
                        }
                      }}
                      whileDrag={{ scale: 1.15, zIndex: 100, boxShadow: "0 20px 30px rgba(0,0,0,0.15)" }}
                      className="flex flex-col items-center gap-1.5 rounded-2xl p-2.5 cursor-pointer select-none bg-white border border-rose-100/60 shadow-sm relative touch-none"
                      style={{
                        width: 76,
                        opacity: fed ? 0.35 : 1,
                        pointerEvents: fed ? "none" : "auto",
                        touchAction: "none",
                      }}
                      whileHover={!fed ? { y: -4, scale: 1.05 } : {}}
                      whileTap={!fed ? { scale: 0.95 } : {}}
                      onClick={(e) => triggerReaction(itemId, e)}
                      aria-label={`Interact with ${itemId}`}
                    >
                      {(() => {
                        const imgPath = getItemImagePath(itemId);
                        return imgPath ? (
                          <img src={imgPath} alt={getItemLabel(itemId)} className="w-10 h-10 object-contain drop-shadow-md select-none pointer-events-none" />
                        ) : (
                          <span className="text-3xl filter drop-shadow-sm select-none">
                            {getItemEmoji(itemId)}
                          </span>
                        );
                      })()}
                      <span
                        className="text-center font-bold leading-tight truncate w-full"
                        style={{ fontSize: 9, color: "#4A0E1B" }}
                      >
                        {getItemLabel(itemId)}
                      </span>

                      {fed && (
                        <div className="absolute inset-0 bg-stone-900/10 rounded-2xl flex items-center justify-center pointer-events-none">
                          <span className="text-white text-xs bg-black/40 px-1.5 py-0.5 rounded-md font-bold">✓</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <NavButtons onBack={onBack} onContinue={handleContinue} />
        </motion.div>
      </div>

      {/* Right: character panel + chewing animations */}
      <div className="flex items-center justify-center w-full md:w-1/2 min-h-[320px] md:min-h-0 relative overflow-hidden bg-transparent">
        {/* Soft backlights */}
        <div className="absolute w-[80%] h-[80%] rounded-full bg-white/5 blur-[80px] pointer-events-none" />

        {/* Reaction Pop Sparkles */}
        <AnimatePresence>
          {ambientSparkles.map((s) => (
            <motion.div
              key={s.id}
              className="absolute text-xl pointer-events-none z-20 select-none"
              style={{
                left: `calc(50% + ${s.x}px)`,
                top: `calc(50% + ${s.y}px)`,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.5, 0], opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              ✨
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Reaction speech bubbles */}
        <AnimatePresence>
          {reactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              className="absolute z-20 speech-bubble-tail whitespace-pre-wrap rounded-2xl px-5 py-3 text-sm font-bold shadow-2xl border border-rose-100 bg-white/95 text-[#4A0E1B] text-center max-w-[200px]"
              style={{
                top: "18%",
                left: "50%",
                transform: "translateX(-50%)",
                boxShadow: "0 10px 25px -5px rgba(74, 14, 27, 0.2)",
              }}
              initial={{ y: 20, opacity: 0, scale: 0.7, x: "-50%" }}
              animate={{ y: 0, opacity: 1, scale: 1, x: "-50%" }}
              exit={{ y: -20, opacity: 0, scale: 0.7, x: "-50%" }}
              transition={{ type: "spring", damping: 12, stiffness: 220 }}
            >
              {reaction.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Character — 3D animated Mico */}
        <div id="character-target" className="z-10 flex items-center justify-center">
          <Character
            emoji={page.characterEmoji}
            imagePath={page.characterImagePath}
            animationState={micoAnimState}
            size="large"
          />
        </div>

        {/* Idle prompt indicator */}
        {fedItems.size < selected.length && (
          <motion.div 
            className="absolute bottom-10 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full text-white text-xs font-semibold select-none z-10 pointer-events-none"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            👉 Feed Mico to see what happens!
          </motion.div>
        )}
      </div>
    </div>
  );
}

