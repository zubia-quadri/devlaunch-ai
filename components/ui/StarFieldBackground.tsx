"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface StarColor {
  r: number;
  g: number;
  b: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  depth: 1 | 2 | 3; // 1 = distant background, 2 = midground, 3 = radiant foreground beacon
  vx: number;
  vy: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  lightColor: StarColor;
  darkColor: StarColor;
  hasGlow: boolean;
  hasFlare: boolean;
}

// Vibrant celestial gemstone palette for light mode (luminous, elegant, never black or dirty)
const LIGHT_PALETTE: StarColor[] = [
  { r: 14, g: 165, b: 233 },  // Celestial Sky Blue (#0ea5e9)
  { r: 99, g: 102, b: 241 },  // Electric Indigo (#6366f1)
  { r: 139, g: 92, b: 246 },  // Radiant Violet (#8b5cf6)
  { r: 37, g: 99, b: 235 },   // Sapphire Blue (#2563eb)
  { r: 245, g: 158, b: 11 },  // Amber Stardust (#f59e0b)
  { r: 16, g: 185, b: 129 },  // Emerald Cyan (#10b981)
];

// Pristine starlight palette for dark mode
const DARK_PALETTE: StarColor[] = [
  { r: 255, g: 255, b: 255 }, // Pure White
  { r: 186, g: 215, b: 255 }, // Pale Starlight Cyan
  { r: 216, g: 180, b: 254 }, // Soft Lavender
  { r: 165, g: 243, b: 252 }, // Crystalline Blue
  { r: 253, g: 230, b: 138 }, // Warm Stellar Gold
];

export function StarFieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setupCanvas();

    const isDarkMode = () =>
      document.documentElement.classList.contains("dark") ||
      resolvedTheme === "dark";

    // Dimensional star distribution across 3 depth planes
    const starCount = Math.min(160, Math.max(65, Math.floor((width * height) / 11000)));
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const depthTier = Math.random();
      let depth: 1 | 2 | 3 = 1;
      let radius = 1.0;
      let speedFactor = 0.12;

      if (depthTier < 0.55) {
        // Tier 1: Distant stars (ambient field depth)
        depth = 1;
        radius = Math.random() * 0.7 + 0.8; // 0.8 - 1.5px
        speedFactor = 0.10;
      } else if (depthTier < 0.85) {
        // Tier 2: Mid-ground stars (crisp visible bodies)
        depth = 2;
        radius = Math.random() * 0.8 + 1.5; // 1.5 - 2.3px
        speedFactor = 0.20;
      } else {
        // Tier 3: Radiant foreground beacons
        depth = 3;
        radius = Math.random() * 1.0 + 2.3; // 2.3 - 3.3px
        speedFactor = 0.32;
      }

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        depth,
        vx: (Math.random() - 0.5) * speedFactor * 0.6,
        vy: -(Math.random() * speedFactor + 0.08), // Smooth upward cosmic drift
        baseAlpha: depth === 1 ? 0.35 : depth === 2 ? 0.6 : 0.85,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        lightColor: LIGHT_PALETTE[Math.floor(Math.random() * LIGHT_PALETTE.length)],
        darkColor: DARK_PALETTE[Math.floor(Math.random() * DARK_PALETTE.length)],
        hasGlow: depth >= 2,
        hasFlare: depth === 3 && Math.random() > 0.4,
      });
    }

    const handleResize = () => {
      setupCanvas();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const dark = isDarkMode();
      const mouse = mouseRef.current;

      // Draw and update stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Cosmic drift
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around boundaries
        if (star.x < -20) star.x = width + 20;
        if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        if (star.y > height + 20) star.y = -20;

        // Natural sinusoidal twinkle
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        let alpha = star.baseAlpha * (0.7 + twinkle * 0.3);

        // Interactive mouse gravity & illumination
        if (mouse.active) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const influence = 1 - dist / 160;
            alpha = Math.min(1, alpha + influence * 0.45);
            star.x -= (dx / dist) * influence * 0.3;
            star.y -= (dy / dist) * influence * 0.3;
          }
        }

        const color = dark ? star.darkColor : star.lightColor;
        const { r, g, b } = color;

        // Radiant 3D Glow Halo for midground & foreground beacons
        if (star.hasGlow) {
          const haloRadius = star.depth === 3 ? star.radius * 5.5 : star.radius * 3.5;
          const haloGrad = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            haloRadius
          );

          if (dark) {
            haloGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.45})`);
            haloGrad.addColorStop(0.5, `rgba(129, 172, 236, ${alpha * 0.15})`);
            haloGrad.addColorStop(1, "rgba(129, 172, 236, 0)");
          } else {
            // Luminous pastel aura in light mode (ethereal, vibrant, no dark mud)
            haloGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.45})`);
            haloGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.18})`);
            haloGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          }

          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star Core
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Elegant Diamond Flare Sparkle for Hero Beacons (never a harsh black plus sign)
        if (star.hasFlare && alpha > 0.6) {
          const flareLen = star.radius * (dark ? 3.5 : 4.0);
          const flareAlpha = alpha * (dark ? 0.4 : 0.45);

          // Horizontal soft flare
          const hGrad = ctx.createLinearGradient(
            star.x - flareLen,
            star.y,
            star.x + flareLen,
            star.y
          );
          hGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
          hGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${flareAlpha})`);
          hGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.strokeStyle = hGrad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(star.x - flareLen, star.y);
          ctx.lineTo(star.x + flareLen, star.y);
          ctx.stroke();

          // Vertical soft flare
          const vGrad = ctx.createLinearGradient(
            star.x,
            star.y - flareLen,
            star.x,
            star.y + flareLen
          );
          vGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
          vGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${flareAlpha})`);
          vGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.strokeStyle = vGrad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - flareLen);
          ctx.lineTo(star.x, star.y + flareLen);
          ctx.stroke();
        }

        // Luminous Constellation Filaments near cursor
        if (mouse.active && star.depth >= 2) {
          for (let j = i + 1; j < stars.length; j++) {
            const other = stars[j];
            if (other.depth < 2) continue;

            const dx = star.x - other.x;
            const dy = star.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 80) {
              const mouseDist = Math.hypot(mouse.x - star.x, mouse.y - star.y);
              if (mouseDist < 150) {
                const lineAlpha = (1 - dist / 80) * (1 - mouseDist / 150) * 0.35;
                const grad = ctx.createLinearGradient(star.x, star.y, other.x, other.y);
                const otherColor = dark ? other.darkColor : other.lightColor;

                grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${lineAlpha})`);
                grad.addColorStop(1, `rgba(${otherColor.r}, ${otherColor.g}, ${otherColor.b}, ${lineAlpha})`);

                ctx.strokeStyle = grad;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [resolvedTheme, mounted]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full select-none"
      aria-hidden="true"
    />
  );
}
