"use client";

import { StarFieldBackground } from "./StarFieldBackground";

// Multi-dimensional atmosphere combining soft ambient aurora mesh with living starlight particles
export function FloatingOrbs() {
  return (
    <>
      {/* Dimensional Ambient Aurora Mesh (Soft colored depth in light mode; completely hidden in dark mode) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none dark:hidden"
        aria-hidden="true"
      >
        {/* Top-center radiant indigo glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[480px] rounded-full bg-gradient-to-b from-indigo-500/12 via-blue-500/6 to-transparent blur-3xl opacity-80 dark:opacity-20 animate-pulse-glow" />

        {/* Top-right vibrant cyan aura */}
        <div className="absolute -top-24 -right-24 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-cyan-400/14 via-sky-500/7 to-transparent blur-3xl opacity-85 dark:opacity-25" />

        {/* Mid-left celestial violet aurora */}
        <div className="absolute top-1/4 -left-36 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-purple-500/10 via-pink-400/6 to-transparent blur-3xl opacity-75 dark:opacity-20 animate-aurora" />

        {/* Bottom subtle warm amber shimmer */}
        <div className="absolute -bottom-36 right-1/4 w-[600px] h-[500px] rounded-full bg-gradient-to-t from-amber-400/8 via-indigo-500/4 to-transparent blur-3xl opacity-60 dark:opacity-15" />
      </div>

      {/* Living Celestial Starlight Particles */}
      <StarFieldBackground />
    </>
  );
}

