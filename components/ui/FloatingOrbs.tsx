"use client";

// Decorative floating orbs background — purely visual, no JS logic
export function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Primary orb — top left */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full animate-float-slower"
        style={{
          background:
            "radial-gradient(circle, hsl(239 84% 67% / 0.07) 0%, transparent 70%)",
        }}
      />
      {/* Secondary orb — top right */}
      <div
        className="absolute -top-20 right-1/3 w-[350px] h-[350px] rounded-full animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, hsl(270 70% 60% / 0.05) 0%, transparent 70%)",
          animationDelay: "2s",
        }}
      />
      {/* Accent orb — bottom right */}
      <div
        className="absolute bottom-0 -right-24 w-[400px] h-[400px] rounded-full animate-float"
        style={{
          background:
            "radial-gradient(circle, hsl(199 89% 48% / 0.05) 0%, transparent 70%)",
          animationDelay: "4s",
        }}
      />
      {/* Small accent — middle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full animate-float-slow"
        style={{
          background:
            "radial-gradient(ellipse, hsl(239 84% 67% / 0.03) 0%, transparent 60%)",
          animationDelay: "1s",
        }}
      />
    </div>
  );
}
