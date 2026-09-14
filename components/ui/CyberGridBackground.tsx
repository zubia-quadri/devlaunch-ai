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
      {/* ── 1. Interactive Ambient Cursor Spotlight (Soft Specular Glow) ── */}
      <div
        className="absolute inset-0 transition-[background] duration-200 ease-out opacity-80"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(129, 172, 236, 0.12), transparent 75%)`,
        }}
      />

      {/* ── 2. Crisp Architectural Millimeter Grid (Black grid lines in light mode) ── */}
      <div className="absolute inset-0 paper-grid opacity-85" />
      <div className="absolute inset-0 paper-grid-dense opacity-35" />

      {/* ── 3. Spaced-Out Shiny Objects Moving Along Horizontal Black Grid Lines ── */}
      {/* Horizontal Line 1 (y = 128px) */}
      <div className="absolute top-[128px] left-0 w-full h-[3px] overflow-hidden">
        {/* Shiny moving object A */}
        <div className="shiny-glide-h1 w-20 h-[3px] flex items-center justify-center">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#81ACEC] to-transparent shadow-[0_0_8px_#81ACEC,0_0_16px_rgba(129,172,236,0.6)] rounded-full" />
          <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#81ACEC]" />
        </div>
      </div>

      {/* Horizontal Line 2 (y = 288px) */}
      <div className="absolute top-[288px] left-0 w-full h-[3px] overflow-hidden">
        {/* Shiny moving object B (delayed) */}
        <div className="shiny-glide-h2 w-28 h-[3px] flex items-center justify-center">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent shadow-[0_0_8px_#06b6d4,0_0_16px_rgba(6,182,212,0.6)] rounded-full" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#06b6d4]" />
        </div>
      </div>

      {/* Horizontal Line 3 (y = 512px) */}
      <div className="absolute top-[512px] left-0 w-full h-[3px] overflow-hidden">
        {/* Shiny moving object C */}
        <div className="shiny-glide-h3 w-24 h-[3px] flex items-center justify-center">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#81ACEC] to-transparent shadow-[0_0_8px_#81ACEC,0_0_16px_rgba(129,172,236,0.6)] rounded-full" />
          <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#81ACEC]" />
        </div>
      </div>

      {/* Horizontal Line 4 (y = 736px) */}
      <div className="absolute top-[736px] left-0 w-full h-[3px] overflow-hidden">
        {/* Shiny moving object D */}
        <div className="shiny-glide-h1 w-32 h-[3px] flex items-center justify-center" style={{ animationDelay: "4.5s" }}>
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#a78bfa] to-transparent shadow-[0_0_8px_#a78bfa,0_0_16px_rgba(167,139,250,0.6)] rounded-full" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#a78bfa]" />
        </div>
      </div>

      {/* ── 4. Spaced-Out Shiny Objects Moving Along Vertical Black Grid Lines ── */}
      {/* Vertical Line 1 (x = 18%) */}
      <div className="absolute left-[18%] top-0 w-[3px] h-full overflow-hidden">
        <div className="shiny-glide-v1 h-20 w-[3px] flex flex-col items-center justify-center">
          <div className="h-full w-[2px] bg-gradient-to-b from-transparent via-[#81ACEC] to-transparent shadow-[0_0_8px_#81ACEC,0_0_16px_rgba(129,172,236,0.6)] rounded-full" />
          <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#81ACEC]" />
        </div>
      </div>

      {/* Vertical Line 2 (x = 48%) */}
      <div className="absolute left-[48%] top-0 w-[3px] h-full overflow-hidden">
        <div className="shiny-glide-v2 h-28 w-[3px] flex flex-col items-center justify-center">
          <div className="h-full w-[2px] bg-gradient-to-b from-transparent via-[#06b6d4] to-transparent shadow-[0_0_8px_#06b6d4,0_0_16px_rgba(6,182,212,0.6)] rounded-full" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#06b6d4]" />
        </div>
      </div>

      {/* Vertical Line 3 (x = 82%) */}
      <div className="absolute left-[82%] top-0 w-[3px] h-full overflow-hidden">
        <div className="shiny-glide-v3 h-24 w-[3px] flex flex-col items-center justify-center">
          <div className="h-full w-[2px] bg-gradient-to-b from-transparent via-[#81ACEC] to-transparent shadow-[0_0_8px_#81ACEC,0_0_16px_rgba(129,172,236,0.6)] rounded-full" />
          <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#81ACEC]" />
        </div>
      </div>

      {/* ── 5. Technical Intersection Crosshairs (+) along Grid Junctions ── */}
      <div className="absolute top-[128px] left-[18%] font-mono text-[10px] text-neutral-800 dark:text-neutral-300 font-bold -translate-x-1/2 -translate-y-1/2 opacity-75">
        +
      </div>
      <div className="absolute top-[128px] left-[48%] font-mono text-[10px] text-[#81ACEC] font-bold -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-xs">
        +
      </div>
      <div className="absolute top-[128px] left-[82%] font-mono text-[10px] text-neutral-800 dark:text-neutral-300 font-bold -translate-x-1/2 -translate-y-1/2 opacity-75">
        +
      </div>
      <div className="absolute top-[288px] left-[18%] font-mono text-[10px] text-[#06b6d4] font-bold -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: "1.2s" }}>
        +
      </div>
      <div className="absolute top-[288px] left-[48%] font-mono text-[10px] text-neutral-800 dark:text-neutral-300 font-bold -translate-x-1/2 -translate-y-1/2 opacity-75">
        +
      </div>
      <div className="absolute top-[512px] left-[82%] font-mono text-[10px] text-[#81ACEC] font-bold -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: "2s" }}>
        +
      </div>

      {/* ── 6. Subtle Technical Corner Telemetry ── */}
      <div className="absolute top-4 left-6 font-mono text-[9px] tracking-widest text-[hsl(var(--muted-foreground)/0.55)]">
        GRID.TRACK // 32PX [BLACK-INK]
      </div>
      <div className="absolute top-4 right-6 font-mono text-[9px] tracking-widest text-[hsl(var(--muted-foreground)/0.55)]">
        OBJECT.CADENCE // 60FPS
      </div>
      <div className="absolute bottom-4 left-6 font-mono text-[9px] tracking-widest text-[hsl(var(--muted-foreground)/0.55)]">
        POS: [{mousePos.x}%, {mousePos.y}%]
      </div>
    </div>
  );
}
