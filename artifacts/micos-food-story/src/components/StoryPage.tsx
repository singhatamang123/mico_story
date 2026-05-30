import { StoryPageData } from "@/data/pages";
import Character from "./Character";
import NavButtons from "./NavButtons";
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

  // Split by double newlines to isolate paragraphs
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
        if (revealedChars % 3 === 0) {
          play("type");
        }
      }, 35);
      return () => clearTimeout(timer);
    } else if (revealedChars >= totalChars && isTyping) {
      setIsTyping(false);
    }
  }, [revealedChars, totalChars, isTyping, play]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const startSpeech = () => {
    window.speechSynthesis.cancel();
    setRevealedChars(totalChars);
    setIsTyping(false);

    const speechText = page.text;
    const utterance = new SpeechSynthesisUtterance(speechText);
    
    // Choose voice
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Microsoft Zira"))
    ) || voices.find((v) => v.lang.startsWith("en"));
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }
    
    utterance.rate = 0.82; // child-friendly reading speed

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const charIndex = event.charIndex;
        let charLength = 0;
        const textFromIndex = speechText.slice(charIndex);
        const match = textFromIndex.match(/^[\w']+/);
        if (match) {
          charLength = match[0].length;
        } else {
          charLength = event.charLength || 1;
        }
        setHighlightedRange([charIndex, charIndex + charLength]);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setHighlightedRange(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setHighlightedRange(null);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleContinue = () => {
    stopSpeech();
    if (isTyping) {
      setRevealedChars(totalChars);
      setIsTyping(false);
    } else {
      onNext();
    }
  };

  // Helper to slice text without breaking the layout
  let currentCount = 0;
  const renderText = (text: string) => {
    if (currentCount >= revealedChars) {
      currentCount += text.length;
      return <span className="opacity-0">{text}</span>;
    }
    const remaining = revealedChars - currentCount;
    const startCount = currentCount;
    currentCount += text.length;

    const revealedLength = Math.min(remaining, text.length);
    const revealedText = text.slice(0, revealedLength);
    const hiddenText = text.slice(revealedLength);

    if (highlightedRange) {
      const [hlStart, hlEnd] = highlightedRange;
      const spans: React.ReactNode[] = [];
      let i = 0;
      while (i < revealedLength) {
        const globalIdx = startCount + i;
        if (globalIdx >= hlStart && globalIdx < hlEnd) {
          spans.push(
            <span
              key={i}
              className="bg-amber-300 text-[#4A0E1B] rounded-sm font-bold px-0.5 transition-all duration-75 shadow-sm"
            >
              {revealedText[i]}
            </span>
          );
        } else {
          spans.push(<span key={i}>{revealedText[i]}</span>);
        }
        i++;
      }
      return (
        <span>
          {spans}
          <span className="opacity-0">{hiddenText}</span>
        </span>
      );
    }

    return (
      <span>
        {revealedText}
        <span className="opacity-0">{hiddenText}</span>
      </span>
    );
  };



  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Left: story text card wrapper */}
      <div className="flex flex-col justify-between w-full md:w-1/2 p-6 md:p-12 overflow-y-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="my-auto max-w-xl mx-auto w-full p-4 md:p-8"
        >
          {/* Card Header with Read Aloud Button */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-200/50">
              Story Time
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isSpeaking ? stopSpeech : startSpeech}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#4A0E1B] bg-gradient-to-r from-amber-200 to-amber-300 border border-amber-300 hover:brightness-105 transition-all shadow-sm cursor-pointer select-none"
              title={isSpeaking ? "Stop reading" : "Read to me"}
            >
              <span>{isSpeaking ? "⏹️ Stop" : "🔊 Read Aloud"}</span>
            </motion.button>
          </div>

          <div className="flex flex-col gap-6">
            {paragraphs.map((para, i) => {
              const lines = para.split("\n");
              
              return (
                <div key={`para-${i}`} className="flex flex-col gap-2">
                  <p
                    className="leading-relaxed text-[#4A0E1B]"
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "clamp(17px, 1.8vw, 24px)",
                      lineHeight: 1.6,
                      fontWeight: 450,
                    }}
                  >
                    {i === 0 ? (
                      // First paragraph gets a drop cap
                      <>
                        <span 
                          className="float-left text-[3.8em] font-bold leading-[0.8] mr-2 text-rose-700"
                          style={{ fontFamily: "'Fredoka', sans-serif" }}
                        >
                          {renderText(para.charAt(0))}
                        </span>
                        {para.slice(1).split("\n").map((line, lineIdx) => (
                          <span key={lineIdx} className="block">
                            {renderText(line)}
                          </span>
                        ))}
                      </>
                    ) : (
                      lines.map((line, lineIdx) => (
                        <span key={lineIdx} className="block">
                          {renderText(line)}
                        </span>
                      ))
                    )}
                  </p>

                  {/* Decorative divider between stanzas */}
                  {i < paragraphs.length - 1 && (
                    <div className="flex gap-1.5 my-3 justify-start opacity-30 px-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-900" />
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-900" />
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-900" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <NavButtons onBack={onBack} onContinue={handleContinue} />
            <button
              onClick={() => { stopSpeech(); onNext(); }}
              className="mt-8 text-rose-900/40 hover:text-rose-900/70 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              Skip <span className="text-xs">→</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right: character panel */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8 min-h-[300px] md:min-h-0 relative overflow-hidden bg-transparent">
        {/* Soft background ambient sparkles */}
        <div className="absolute w-[80%] h-[80%] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="z-10"
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
      </div>
    </div>
  );
}
