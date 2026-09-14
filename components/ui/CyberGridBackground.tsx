"use client";

import { useEffect, useState, useRef } from "react";

export function CyberGridBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── 1. Ambient Living Aurora Orbs (Drifting Luminous Glows) ── */}
      <div className="absolute inset-0 opacity-40 dark:opacity-60 transition-opacity duration-1000">
        {/* Deep cyan-blue luminescent core */}
        <div
          className="absolute -top-[10%] left-[15%] w-[650px] h-[500px] rounded-full blur-[130px] animate-aurora"
          style={{
            background:
              "radial-gradient(circle, rgba(129, 172, 236, 0.28) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%)",
          }}
        />

        {/* Electric violet ambient edge glow */}
        <div
          className="absolute top-[35%] -right-[5%] w-[550px] h-[450px] rounded-full blur-[140px] animate-aurora"
          style={{
            animationDelay: "-6s",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(59, 130, 246, 0.12) 50%, transparent 70%)",
          }}
        />

        {/* Bottom anchor ambient glow */}
        <div
          className="absolute bottom-[-10%] left-[30%] w-[700px] h-[450px] rounded-full blur-[150px] animate-aurora"
          style={{
            animationDelay: "-11s",
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(129, 172, 236, 0.12) 60%, transparent 80%)",
          }}
        />
      </div>

      {/* ── 2. Interactive Spotlight (Reacts to Cursor) ── */}
      <div
        className="absolute inset-0 transition-[background] duration-200 ease-out"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(129, 172, 236, 0.14), transparent 80%)`,
        }}
      />

      {/* ── 3. Base High-Definition Technical Grid (Paper Blueprint) ── */}
      <div className="absolute inset-0 paper-grid opacity-60 dark:opacity-75" />
      <div className="absolute inset-0 paper-grid-dense opacity-20 dark:opacity-30" />

      {/* ── 4. Dynamic Travelling Laser Beams (Horiz & Vert Lines) ── */}
      {/* Horizontal Beam 1 */}
      <div
        className="absolute top-[224px] left-0 w-full h-[1px] overflow-hidden"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="w-48 h-[2px] -mt-[0.5px] bg-gradient-to-r from-transparent via-[#81ACEC] to-transparent shadow-[0_0_12px_#81ACEC] animate-grid-beam-x"
        />
      </div>

      {/* Horizontal Beam 2 (Delayed) */}
      <div
        className="absolute top-[480px] left-0 w-full h-[1px] overflow-hidden"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="w-64 h-[2px] -mt-[0.5px] bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent shadow-[0_0_15px_#06b6d4] animate-grid-beam-x-delayed"
        />
      </div>

      {/* Vertical Beam 1 */}
      <div
        className="absolute left-[20%] top-0 w-[1px] h-full overflow-hidden"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="h-44 w-[2px] -ml-[0.5px] bg-gradient-to-b from-transparent via-[#81ACEC] to-transparent shadow-[0_0_12px_#81ACEC] animate-grid-beam-y"
        />
      </div>

      {/* Vertical Beam 2 (Delayed) */}
      <div
        className="absolute right-[25%] top-0 w-[1px] h-full overflow-hidden"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="h-56 w-[2px] -ml-[0.5px] bg-gradient-to-b from-transparent via-[#a78bfa] to-transparent shadow-[0_0_14px_#a78bfa] animate-grid-beam-y-delayed"
        />
      </div>

      {/* ── 5. Luminous Technical Crosshairs (+) at Grid Intersections ── */}
      <div className="absolute top-16 left-12 font-mono text-[11px] text-[#81ACEC] opacity-60 dark:opacity-80 animate-pulse">
        +
      </div>
      <div className="absolute top-16 right-16 font-mono text-[11px] text-[#81ACEC] opacity-60 dark:opacity-80 animate-pulse" style={{ animationDelay: "1s" }}>
        +
      </div>
      <div className="absolute top-[416px] left-[35%] font-mono text-[11px] text-[#06b6d4] opacity-50 dark:opacity-80 animate-pulse" style={{ animationDelay: "2s" }}>
        +
      </div>
      <div className="absolute top-[640px] right-[20%] font-mono text-[11px] text-[#81ACEC] opacity-60 dark:opacity-80 animate-pulse" style={{ animationDelay: "1.5s" }}>
        +
      </div>

      {/* Technical HUD Coordinate readouts */}
      <div className="absolute top-4 left-6 font-mono text-[9px] tracking-widest text-[hsl(var(--muted-foreground)/0.5)]">
        SYS.GRID // 32PX [ONLINE]
      </div>
      <div className="absolute top-4 right-6 font-mono text-[9px] tracking-widest text-[hsl(var(--muted-foreground)/0.5)]">
        QUANTUM.INDEX // v2.4
      </div>
      <div className="absolute bottom-4 left-6 font-mono text-[9px] tracking-widest text-[hsl(var(--muted-foreground)/0.5)]">
        AXIS.X: {mousePos.x}% · AXIS.Y: {mousePos.y}%
      </div>

      {/* Soft Vignette Mask to softly focus center content */}
      <div
        className="absolute inset-0 bg-radial from-transparent via-transparent to-[hsl(var(--background)/0.7)] pointer-events-none"
      />
    </div>
  );
}
