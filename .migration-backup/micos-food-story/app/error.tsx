"use client";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rose-950 text-rose-100 p-8">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-md text-center">
        <span className="text-6xl mb-4 block">🥺</span>
        <h2 className="text-2xl font-bold mb-4 font-['Fredoka']">Oops! Something went wrong</h2>
        <p className="text-rose-200/80 mb-8 font-['Outfit']">
          We hit a little snag in our food story adventure. Let's try starting over!
        </p>
        <button
          onClick={reset}
          className="bg-amber-500 hover:bg-amber-400 text-[#4A0E1B] font-bold py-3 px-8 rounded-xl shadow-lg transition-transform active:scale-95"
        >
          Try again 🔄
        </button>
      </div>
    </div>
  );
}
