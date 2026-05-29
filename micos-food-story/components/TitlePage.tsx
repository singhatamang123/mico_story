"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TitlePageData, getItemEmoji, getItemImagePath } from "@/data/pages";
import { useSound } from "@/hooks/useSound";

interface TitlePageProps {
  page: TitlePageData;
  onStart: () => void;
}

export default function TitlePage({ page, onStart }: TitlePageProps) {
  const [flipped, setFlipped] = useState<boolean[]>(page.flipCards.map(() => false));
  const { play } = useSound();
  const [showGallery, setShowGallery] = useState(false);
  const [galleryEntries, setGalleryEntries] = useState<any[]>([]);

  const openGallery = () => {
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("micos-scrapbook");
      setGalleryEntries(existing ? JSON.parse(existing) : []);
    }
    setShowGallery(true);
  };

  const toggleFlip = (i: number) => {
    play("click");
    setFlipped((prev) => prev.map((f, idx) => (idx === i ? !f : f)));
  };

  return (
    <div
      className="flex flex-col justify-between w-full h-full p-8 md:p-12 relative overflow-hidden bg-transparent"
    >
      {/* Decorative background lights */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Title block */}
      <div className="flex flex-col gap-4 z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-[12px] md:text-[14px] font-bold uppercase tracking-[0.2em] text-pink-300 bg-pink-900/40 px-3 py-1.5 rounded-full border border-pink-700/30">
            Interactive Storybook
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)] font-bold tracking-tight"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "clamp(46px, 7vw, 92px)",
            lineHeight: 1.05,
          }}
        >
          {page.title}
        </motion.h1>

        <div className="flex items-center justify-between gap-6 flex-wrap mt-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-amber-100/90 font-medium drop-shadow-sm"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(15px, 1.6vw, 22px)",
            }}
          >
            {page.subtitle}
          </motion.p>

          <div className="flex items-center gap-4 flex-wrap">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            >
              <motion.button
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.7)" }}
                whileTap={{ scale: 0.95 }}
                onClick={openGallery}
                className="px-6 py-4.5 rounded-2xl font-bold bg-white/50 backdrop-blur-md hover:bg-white/70 border border-white/60 text-[#4A0E1B] text-md shadow-xl cursor-pointer transition-colors duration-300"
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                }}
              >
                Diary Gallery 📖
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.45, type: "spring" }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(245,200,66,0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { play("cheer"); onStart(); }}
                className="btn-3d px-10 py-4.5 rounded-2xl font-bold border-b-4 border-amber-600 active:border-b-0 text-[#4A0E1B] text-lg shadow-xl cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
                  fontFamily: "'Fredoka', sans-serif",
                }}
              >
                Start Adventure 🚀
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Flip cards dashboard */}
      <div className="grid grid-cols-3 gap-5 md:gap-8 w-full max-w-4xl mx-auto mt-10 mb-2 z-10">
        {page.flipCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.15, type: "spring" }}
            className="w-full aspect-[4/5] cursor-pointer relative"
            style={{ perspective: 1000 }}
            onClick={() => toggleFlip(i)}
            role="button"
            aria-label={`Flip card ${i + 1}`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleFlip(i)}
          >
            <motion.div
              className="relative w-full h-full rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: flipped[i] ? 180 : 0 }}
              transition={{ duration: 0.65, type: "spring", damping: 16, stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Front side */}
              <div
                className="absolute inset-0 rounded-[2rem] flex flex-col items-center justify-center p-4 backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg, ${card.color} 0%, rgba(255,255,255,0.4) 100%)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="absolute inset-0 bg-white/20 opacity-40 rounded-[2rem]" />
                <div className="absolute inset-px border-2 border-white/40 rounded-[1.9rem]" />
                <span className="text-[52px] md:text-[76px] filter drop-shadow-md select-none">
                  {card.emoji}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#4A0E1B] mt-3 font-bold select-none">
                  Tap to flip
                </span>
              </div>

              {/* Back side */}
              <div
                className="absolute inset-0 rounded-[2rem] flex flex-col items-center justify-center p-4 backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg, ${card.color} 0%, rgba(255,255,255,0.7) 100%)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="absolute inset-px border-2 border-white/40 rounded-[1.9rem]" />
                <span className="text-[52px] md:text-[76px] filter drop-shadow-md select-none">
                  {card.backEmoji}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#4A0E1B] mt-3 font-bold select-none">
                  Nice! ✨
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#1E050B]/95 flex flex-col p-6 md:p-12 overflow-y-auto animate-fade-in"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
              <div className="flex justify-between items-center mb-8 border-b border-pink-900/30 pb-4">
                <div>
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Signed Scrapbooks</span>
                  <h2 
                    className="text-white text-3xl font-bold mt-1"
                    style={{ fontFamily: "'Fredoka', sans-serif" }}
                  >
                    Mico's Diary Gallery 📖
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowGallery(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer text-lg"
                >
                  ✕
                </motion.button>
              </div>

              {galleryEntries.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <span className="text-6xl mb-4 select-none">📭</span>
                  <p className="text-pink-200/60 font-semibold text-lg max-w-sm">
                    No adventures recorded yet! Complete your first journey and sign the diary at the end to save it.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-12">
                  {galleryEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      whileHover={{ scale: 1.03 }}
                      className="bg-white p-4 pb-6 shadow-2xl rounded-sm border border-stone-200 flex flex-col relative text-[#4A0E1B]"
                    >
                      {/* Tape Decoration */}
                      <div className="w-14 h-5 bg-amber-200/50 absolute -top-2 left-1/2 -translate-x-1/2 rotate-1" />

                      {/* Polaroid Photos Area */}
                      <div className="w-full aspect-video bg-stone-50 border border-stone-100 rounded-sm p-3 flex items-center justify-center gap-2 select-none shadow-inner mb-4 overflow-hidden">
                        {/* Breakfast */}
                        <div className="flex flex-col items-center">
                          <span className="text-2xl">
                            {entry.breakfast?.[0] ? (
                              getItemImagePath(entry.breakfast[0]) ? (
                                <img src={getItemImagePath(entry.breakfast[0])} alt="" className="w-8 h-8 object-contain" />
                              ) : (
                                getItemEmoji(entry.breakfast[0])
                              )
                            ) : "🥣"}
                          </span>
                          <span className="text-[7px] text-stone-500 font-bold uppercase mt-1">Breakfast</span>
                        </div>

                        {/* Adventure Items */}
                        <div className="flex flex-col items-center">
                          <span className="text-2xl">
                            {entry.adventureItems?.[0] ? (
                              getItemImagePath(entry.adventureItems[0]) ? (
                                <img src={getItemImagePath(entry.adventureItems[0])} alt="" className="w-8 h-8 object-contain" />
                              ) : (
                                getItemEmoji(entry.adventureItems[0])
                              )
                            ) : "🎒"}
                          </span>
                          <span className="text-[7px] text-stone-500 font-bold uppercase mt-1">Activity</span>
                        </div>

                        {/* Gift */}
                        <div className="flex flex-col items-center">
                          <span className="text-2xl">
                            {entry.gifts?.[0] ? (
                              getItemImagePath(entry.gifts[0]) ? (
                                <img src={getItemImagePath(entry.gifts[0])} alt="" className="w-8 h-8 object-contain" />
                              ) : (
                                getItemEmoji(entry.gifts[0])
                              )
                            ) : "🎁"}
                          </span>
                          <span className="text-[7px] text-stone-500 font-bold uppercase mt-1">Gift</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[8px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold uppercase inline-block mb-1">
                            {entry.season} Day
                          </span>
                          <p className="text-[10px] text-stone-500 font-semibold mb-2">Completed on: {entry.date}</p>
                          <p className="text-xs font-bold text-stone-700 leading-relaxed italic">
                            &ldquo;Mico chose a cozy {entry.season} day adventure!&rdquo;
                          </p>
                        </div>

                        <div className="border-t border-stone-100 mt-4 pt-3 text-right">
                          <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Story Signature</span>
                          <span 
                            className="font-extrabold text-sm text-pink-900"
                            style={{ fontFamily: "'Fredoka', sans-serif" }}
                          >
                            ✍️ {entry.signature}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
