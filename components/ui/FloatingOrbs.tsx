"use client";

// Paper Design architectural drafting background — subtle millimeter grid with technical crosshairs
export function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Blueprint millimeter grid */}
      <div className="absolute inset-0 paper-grid opacity-70" />

      {/* Technical corner coordinate marks */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-[hsl(var(--muted-foreground)/0.4)] select-none">
        +00.00
      </div>
      <div className="absolute top-4 right-4 font-mono text-[9px] text-[hsl(var(--muted-foreground)/0.4)] select-none">
        +96.00
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[hsl(var(--muted-foreground)/0.4)] select-none">
        +00.96
      </div>

      {/* Subtle paper watermark texture */}
      <div className="absolute top-1/3 right-8 w-px h-32 bg-[hsl(var(--border)/0.5)]" />
      <div className="absolute top-1/3 right-6 w-5 h-px bg-[hsl(var(--border)/0.5)]" />
    </div>
  );
}
