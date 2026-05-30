"use client";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";

interface NavButtonsProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  hideContinue?: boolean;
}

export default function NavButtons({
  onBack,
  onContinue,
  continueDisabled = false,
  continueLabel = "Continue",
  hideContinue = false,
}: NavButtonsProps) {
  const { play } = useSound();

  return (
    <div className="flex gap-4 mt-8 w-full justify-start items-center">
      {onBack && (
        <motion.button
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96, y: 2 }}
          onClick={() => { play("click"); onBack(); }}
          className="btn-3d px-6 py-3.5 rounded-2xl font-bold text-[15px] tracking-wide text-rose-200 border-2 border-rose-950/40 hover:bg-rose-950/20 active:translate-y-[2px]"
          style={{ 
            background: "rgba(74, 14, 27, 0.4)", 
            fontFamily: "'Fredoka', sans-serif" 
          }}
        >
          <span className="flex items-center gap-1.5 justify-center">
            <span className="text-lg">←</span> Back
          </span>
        </motion.button>
      )}
      {!hideContinue && onContinue && (
        <motion.button
          whileHover={continueDisabled ? {} : { scale: 1.04, y: -1 }}
          whileTap={continueDisabled ? {} : { scale: 0.96, y: 2 }}
          onClick={() => { if (!continueDisabled && onContinue) { play("whoosh"); onContinue(); } }}
          disabled={continueDisabled}
          className="btn-3d px-8 py-3.5 rounded-2xl font-bold text-[16px] tracking-wide shadow-lg border-b-4 border-amber-600 hover:border-amber-700 active:border-b-2 active:translate-y-[2px]"
          style={{
            background: continueDisabled
              ? "rgba(255, 255, 255, 0.1)"
              : "linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)",
            color: continueDisabled ? "rgba(255, 255, 255, 0.3)" : "#4A0E1B",
            fontFamily: "'Fredoka', sans-serif",
            cursor: continueDisabled ? "not-allowed" : "pointer",
            boxShadow: continueDisabled ? "none" : "0 8px 20px -6px rgba(247, 107, 28, 0.4)",
          }}
          aria-disabled={continueDisabled}
        >
          <span className="flex items-center gap-1.5 justify-center">
            {continueLabel} <span className="text-lg">→</span>
          </span>
        </motion.button>
      )}
    </div>
  );
}
