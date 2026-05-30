import { StoryPageData } from "@/data/pages";
import Character from "./Character";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSound } from "@/hooks/useSound";

interface StoryPageProps {
  page: StoryPageData;
  onNext: () => void;
  onBack: () => void;
}

export default function StoryPage({ page, onNext, onBack }: StoryPageProps) {
  const { play } = useSound();
  const [revealedChars, setRevealedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightedRange, setHighlightedRange] = useState<[number, number] | null>(null);

  const paragraphs = page.text.split("\n\n");
  const totalChars = page.text.replace(/\n/g, "").length;

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setHighlightedRange(null);
  };

  useEffect(() => {
    setRevealedChars(0);
    setIsTyping(true);
    stopSpeech();
  }, [page.id]);

  useEffect(() => {
    if (isTyping && revealedChars < totalChars) {
      const timer = setTimeout(() => {
        setRevealedChars((prev) => prev + 1);
        if (revealedChars % 3 === 0) play("type");
      }, 35);
      return () => clearTimeout(timer);
    } else if (revealedChars >= totalChars && isTyping) {
      setIsTyping(false);
    }
  }, [revealedChars, totalChars, isTyping, play]);

  useEffect(() => { return () => window.speechSynthesis.cancel(); }, []);

  const startSpeech = () => {
    window.speechSynthesis.cancel();
    setRevealedChars(totalChars);
    setIsTyping(false);
    const utterance = new SpeechSynthesisUtterance(page.text);
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice =
      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Microsoft Zira"))) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (friendlyVoice) utterance.voice = friendlyVoice;
    utterance.rate = 0.82;
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const charIndex = event.charIndex;
        const match = page.text.slice(charIndex).match(/^[\w']+/);
        const charLength = match ? match[0].length : (event.charLength || 1);
        setHighlightedRange([charIndex, charIndex + charLength]);
      }
    };
    utterance.onend = () => { setIsSpeaking(false); setHighlightedRange(null); };
    utterance.onerror = () => { setIsSpeaking(false); setHighlightedRange(null); };
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleContinue = () => {
    stopSpeech();
    if (isTyping) { setRevealedChars(totalChars); setIsTyping(false); }
    else onNext();
  };

  let currentCount = 0;
  const renderText = (text: string) => {
    if (currentCount >= revealedChars) { currentCount += text.length; return <span className="opacity-0">{text}</span>; }
    const remaining = revealedChars - currentCount;
    const startCount = currentCount;
    currentCount += text.length;
    const revealedLength = Math.min(remaining, text.length);
    const revealedText = text.slice(0, revealedLength);
    const hiddenText = text.slice(revealedLength);
    if (highlightedRange) {
      const [hlStart, hlEnd] = highlightedRange;
      const spans: React.ReactNode[] = [];
      for (let i = 0; i < revealedLength; i++) {
        const gi = startCount + i;
        spans.push(gi >= hlStart && gi < hlEnd
          ? <span key={i} className="bg-amber-300/80 text-amber-900 rounded px-0.5 font-bold transition-all duration-75">{revealedText[i]}</span>
          : <span key={i}>{revealedText[i]}</span>
        );
      }
      return <span>{spans}<span className="opacity-0">{hiddenText}</span></span>;
    }
    return <span>{revealedText}<span className="opacity-0">{hiddenText}</span></span>;
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col md:flex-row items-stretch pt-14 md:pt-16 pb-4 px-4 md:px-10 gap-4 md:gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* LEFT — Story text panel */}
      <motion.div
        className="flex flex-col w-full md:w-[52%] h-full"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex-1 flex flex-col min-h-0 bg-black/35 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Card header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300/80 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              ✨ Story Time
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={isSpeaking ? stopSpeech : startSpeech}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-all cursor-pointer select-none"
            >
              {isSpeaking ? "⏹ Stop" : "🔊 Read Aloud"}
            </motion.button>
          </div>

          {/* Scrollable story text */}
          <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-hide">
            <div className="flex flex-col gap-5 max-w-lg">
              {paragraphs.map((para, i) => {
                const lines = para.split("\n");
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <p
                      className="leading-relaxed text-white/90"
                      style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(16px, 1.7vw, 22px)", lineHeight: 1.65, fontWeight: 430 }}
                    >
                      {i === 0 ? (
                        <>
                          <span className="float-left text-[3.5em] font-bold leading-[0.82] mr-2 text-amber-300" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                            {renderText(para.charAt(0))}
                          </span>
                          {para.slice(1).split("\n").map((line, li) => (
                            <span key={li} className="block">{renderText(line)}</span>
                          ))}
                        </>
                      ) : (
                        lines.map((line, li) => <span key={li} className="block">{renderText(line)}</span>)
                      )}
                    </p>
                    {i < paragraphs.length - 1 && (
                      <div className="flex gap-1.5 my-2 opacity-20">
                        {[0,1,2].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-amber-300" />)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nav footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-white/8 flex items-center justify-between gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => { stopSpeech(); onBack(); play("click"); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-white/70 border border-white/15 bg-white/8 hover:bg-white/15 transition-colors cursor-pointer select-none"
              style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 15 }}
            >
              ← Back
            </motion.button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { stopSpeech(); onNext(); }}
                className="text-white/35 hover:text-white/60 text-sm font-medium transition-colors cursor-pointer"
              >
                Skip →
              </button>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleContinue}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-[#3a0d0d] cursor-pointer select-none shadow-lg"
                style={{
                  fontFamily: "'Fredoka', sans-serif", fontSize: 16,
                  background: "linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)",
                  boxShadow: "0 6px 20px -4px rgba(247,107,28,0.5)",
                }}
              >
                {isTyping ? "Show All" : "Continue →"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT — Character showcase */}
      <motion.div
        className="flex flex-col items-center justify-center w-full md:w-[48%] h-full relative"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {/* Atmospheric glow halo */}
        <div className="absolute w-72 h-72 rounded-full bg-amber-400/10 blur-[80px] pointer-events-none" />
        <div className="absolute w-48 h-48 rounded-full bg-white/5 blur-[40px] pointer-events-none" />

        {/* Emotion badge */}
        {(page as any).emotion && (
          <motion.div
            className="absolute top-[18%] right-[12%] bg-black/40 backdrop-blur-md border border-white/15 text-white/75 text-xs font-bold px-3 py-1.5 rounded-full"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            feeling {(page as any).emotion}
          </motion.div>
        )}

        <motion.div
          className="z-10 relative"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Character
            emoji={page.characterEmoji}
            imagePath={page.characterImagePath}
            animationState="idle"
            emotion={(page as any).emotion}
            tapReaction={page.tapReaction}
            size="large"
          />
        </motion.div>

        {/* Tap hint */}
        <motion.p
          className="mt-4 text-white/30 text-xs font-medium tracking-wide"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        >
          tap Mico to react
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
