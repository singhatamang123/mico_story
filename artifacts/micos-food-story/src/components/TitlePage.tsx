import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TitlePageData, getItemEmoji, getItemImagePath } from "@/data/pages";
import { useSound } from "@/hooks/useSound";

interface TitlePageProps {
  page: TitlePageData;
  onStart: () => void;
}

const FOOD_FLOATERS = [
  { emoji: "🥞", x: 8, y: 15, size: 52, delay: 0 },
  { emoji: "🍓", x: 88, y: 10, size: 40, delay: 0.4 },
  { emoji: "🍳", x: 75, y: 72, size: 44, delay: 0.8 },
  { emoji: "🥐", x: 5, y: 68, size: 38, delay: 1.2 },
  { emoji: "🍇", x: 92, y: 42, size: 36, delay: 0.6 },
  { emoji: "🌮", x: 18, y: 88, size: 34, delay: 1.5 },
  { emoji: "⭐", x: 55, y: 6, size: 28, delay: 0.3 },
  { emoji: "✨", x: 35, y: 92, size: 24, delay: 1.0 },
  { emoji: "🍉", x: 82, y: 88, size: 38, delay: 0.9 },
  { emoji: "🌟", x: 45, y: 3, size: 22, delay: 0.2 },
];

export default function TitlePage({ page, onStart }: TitlePageProps) {
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

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-between px-8 md:px-20">

      {/* Floating food decorations */}
      {FOOD_FLOATERS.map((f, i) => (
        <motion.span
          key={i}
          className="absolute select-none pointer-events-none"
          style={{ left: `${f.x}%`, top: `${f.y}%`, fontSize: f.size }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0.25, 0.55, 0.25], y: [0, -14, 0] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: f.delay }}
        />
      ))}

      {/* Left: title + buttons */}
      <div className="relative z-10 flex flex-col gap-6 max-w-lg">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-amber-300 bg-amber-900/40 px-4 py-2 rounded-full border border-amber-500/30 backdrop-blur-sm">
            🍽️ Interactive Adventure
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-bold leading-tight"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "clamp(42px, 6vw, 88px)",
            background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 40%, #FCA5A5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 2px 12px rgba(245,158,11,0.35))",
          }}
        >
          {page.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-amber-100/80 font-medium"
          style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(15px, 1.6vw, 22px)" }}
        >
          {page.subtitle}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, type: "spring" }}
          className="flex items-center gap-4 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.22)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { play("click"); openGallery(); }}
            className="px-7 py-4 rounded-2xl font-bold bg-white/12 backdrop-blur-md border border-white/25 text-white shadow-xl cursor-pointer transition-colors duration-300"
            style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(14px, 1.4vw, 18px)" }}
          >
            Diary Gallery 📖
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(245,158,11,0.6)" }}
            whileTap={{ scale: 0.94 }}
            onClick={() => { play("cheer"); onStart(); }}
            className="px-10 py-4 rounded-2xl font-bold border-b-4 border-amber-600 active:border-b-0 text-[#3D1A00] shadow-2xl cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "clamp(15px, 1.5vw, 20px)",
            }}
          >
            Start Adventure 🚀
          </motion.button>
        </motion.div>

        {/* Decorative dots row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-2 items-center"
        >
          {["#F59E0B", "#F87171", "#34D399", "#60A5FA"].map((c, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ width: 8, height: 8, background: c }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </div>

      {/* Right: Mico character */}
      <motion.div
        className="relative z-10 flex-shrink-0 hidden md:flex items-end justify-center"
        style={{ width: "clamp(220px, 35vw, 480px)", height: "clamp(220px, 60vh, 560px)" }}
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, type: "spring", stiffness: 80 }}
      >
        {/* Glow ring behind character */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.img
          src="/images/mico-idle.png"
          alt="Mico"
          className="relative w-full h-full object-contain drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 8px 32px rgba(245,158,11,0.4))" }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Speech bubble */}
        <motion.div
          className="absolute top-[8%] left-[-10%] bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-xl border border-amber-200/50"
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <span className="text-[#3D1A00] font-bold text-sm md:text-base whitespace-nowrap">
            Let's explore! 🌟
          </span>
          <div
            className="absolute bottom-[-8px] right-[20%] w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid rgba(255,255,255,0.95)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#1E050B]/96 flex flex-col p-6 md:p-12 overflow-y-auto"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
              <div className="flex justify-between items-center mb-8 border-b border-pink-900/30 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Signed Scrapbooks</span>
                  <h2 className="text-white text-3xl font-bold mt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
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
                  <p className="text-amber-200/60 font-semibold text-lg max-w-sm">
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
                      <div className="w-14 h-5 bg-amber-200/50 absolute -top-2 left-1/2 -translate-x-1/2 rotate-1" />
                      <div className="w-full aspect-video bg-stone-50 border border-stone-100 rounded-sm p-3 flex items-center justify-center gap-2 select-none shadow-inner mb-4 overflow-hidden">
                        {["breakfast", "adventureItems", "gifts"].map((key, ki) => {
                          const labels = ["Breakfast", "Activity", "Gift"];
                          const fallbacks = ["🥣", "🎒", "🎁"];
                          const val = entry[key]?.[0];
                          return (
                            <div key={ki} className="flex flex-col items-center">
                              <span className="text-2xl">
                                {val ? (
                                  getItemImagePath(val) ? (
                                    <img src={getItemImagePath(val)} alt="" className="w-8 h-8 object-contain" />
                                  ) : getItemEmoji(val)
                                ) : fallbacks[ki]}
                              </span>
                              <span className="text-[7px] text-stone-500 font-bold uppercase mt-1">{labels[ki]}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[8px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase inline-block mb-1">
                            {entry.season} Day
                          </span>
                          <p className="text-[10px] text-stone-500 font-semibold mb-2">Completed on: {entry.date}</p>
                          <p className="text-xs font-bold text-stone-700 leading-relaxed italic">
                            &ldquo;Mico chose a cozy {entry.season} day adventure!&rdquo;
                          </p>
                        </div>
                        <div className="border-t border-stone-100 mt-4 pt-3 text-right">
                          <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Story Signature</span>
                          <span className="font-extrabold text-sm text-amber-900" style={{ fontFamily: "'Fredoka', sans-serif" }}>
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
