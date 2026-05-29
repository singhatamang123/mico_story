"use client";
import { useCallback, useRef } from "react";
import { useStoryStore } from "@/store/storyStore";

type SoundType = "drop" | "pickup" | "pop" | "cheer" | "click" | "whoosh" | "type";

export function useSound() {
  const audioCtx = useRef<AudioContext | null>(null);
  const soundEnabled = useStoryStore((state) => state.soundEnabled);

  const getCtx = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    return audioCtx.current;
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      if (!soundEnabled) return;
      try {
        const ctx = getCtx();
        const now = ctx.currentTime;

        switch (type) {
          case "drop": {
            // Satisfying thud
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;
          }
          case "pickup": {
            // Light boing
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
            break;
          }
          case "pop": {
            // Happy pop
            [0, 0.05, 0.1].forEach((offset, i) => {
              const o = ctx.createOscillator();
              const g = ctx.createGain();
              o.connect(g);
              g.connect(ctx.destination);
              o.type = "sine";
              o.frequency.setValueAtTime(400 + i * 120, now + offset);
              g.gain.setValueAtTime(0.25, now + offset);
              g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
              o.start(now + offset);
              o.stop(now + offset + 0.12);
            });
            break;
          }
          case "cheer": {
            // Celebration fanfare
            const notes = [523, 659, 784, 1047];
            notes.forEach((freq, i) => {
              const o = ctx.createOscillator();
              const g = ctx.createGain();
              o.connect(g);
              g.connect(ctx.destination);
              o.type = "triangle";
              o.frequency.setValueAtTime(freq, now + i * 0.1);
              g.gain.setValueAtTime(0.2, now + i * 0.1);
              g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);
              o.start(now + i * 0.1);
              o.stop(now + i * 0.1 + 0.25);
            });
            break;
          }
          case "click": {
            // Page turn click
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "square";
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;
          }
          case "type": {
            // Very soft typewriter click
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "square";
            osc.frequency.setValueAtTime(300 + Math.random() * 200, now); // Slight randomization for realism
            gain.gain.setValueAtTime(0.015, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
            osc.start(now);
            osc.stop(now + 0.02);
            break;
          }
          case "whoosh": {
            // Page transition whoosh
            const bufferSize = ctx.sampleRate * 0.15;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.setValueAtTime(2000, now);
            filter.frequency.exponentialRampToValueAtTime(400, now + 0.15);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            source.start(now);
            source.stop(now + 0.15);
            break;
          }
        }
      } catch {
        // Silently fail if audio isn't available
      }
    },
    // soundEnabled must be in deps so toggling mute mid-session takes effect immediately
    [getCtx, soundEnabled]
  );

  return { play };
}
