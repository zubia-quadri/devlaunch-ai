"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hasGlow: boolean;
  isCrosshair: boolean;
}

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

    // Track dark mode dynamically
    const isDarkMode = () =>
      document.documentElement.classList.contains("dark") ||
      resolvedTheme === "dark";

    // Initialize stars based on screen size (tasteful density matching authkit.com)
    const starCount = Math.min(180, Math.max(70, Math.floor((width * height) / 10000)));
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const radius = Math.random() * 1.4 + 0.6; // 0.6px to 2.0px
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -(Math.random() * 0.28 + 0.08), // Gentle upward drift
        baseAlpha: Math.random() * 0.55 + 0.25,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        hasGlow: Math.random() > 0.72,
        isCrosshair: Math.random() > 0.86,
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
      // Clear transparently so CSS background-color (pure white or pure black) shines through cleanly
      ctx.clearRect(0, 0, width, height);

      const dark = isDarkMode();
      const mouse = mouseRef.current;

      // Draw and update each star
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Drift
        star.x += star.vx;
        star.y += star.vy;

        // Wrap boundaries smoothly
        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;

        // Twinkle calculation
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        let currentAlpha = star.baseAlpha + twinkle * 0.35;

        // Mouse proximity interaction (illuminate and gentle push)
        if (mouse.active) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const factor = 1 - dist / 150;
            currentAlpha = Math.min(1, currentAlpha + factor * 0.55);
            // Gentle repulsive acceleration away from cursor
            star.x -= (dx / dist) * factor * 0.35;
            star.y -= (dy / dist) * factor * 0.35;
          }
        }

        currentAlpha = Math.max(0.12, Math.min(1, currentAlpha));

        // Colors:
        // In dark mode: pure celestial starlight white
        // In light mode: delicate luminous slate-blue pearl (never harsh black/dark specks)
        const r = dark ? 250 : 129;
        const g = dark ? 252 : 160;
        const b = dark ? 255 : 210;

        // In light mode, particles should be ethereal, translucent, and calming
        const effectiveAlpha = dark ? currentAlpha : currentAlpha * 0.42;

        // Radial glow halo for special stars
        if (star.hasGlow) {
          const glowRadius = star.radius * 3.8;
          const gradient = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            glowRadius
          );
          if (dark) {
            gradient.addColorStop(0, `rgba(129, 172, 236, ${currentAlpha * 0.45})`);
            gradient.addColorStop(1, "rgba(129, 172, 236, 0)");
          } else {
            gradient.addColorStop(0, `rgba(129, 172, 236, ${effectiveAlpha * 0.35})`);
            gradient.addColorStop(1, "rgba(129, 172, 236, 0)");
          }
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw star core
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${effectiveAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4-point crosshair sparkle for brighter stars
        if (star.isCrosshair && currentAlpha > 0.55) {
          ctx.strokeStyle = dark
            ? `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.4})`
            : `rgba(129, 172, 236, ${effectiveAlpha * 0.5})`;
          ctx.lineWidth = 0.8;
          const sparkLen = star.radius * 3.0;

          ctx.beginPath();
          ctx.moveTo(star.x - sparkLen, star.y);
          ctx.lineTo(star.x + sparkLen, star.y);
          ctx.moveTo(star.x, star.y - sparkLen);
          ctx.lineTo(star.x, star.y + sparkLen);
          ctx.stroke();
        }

        // Delicate constellation filaments between nearby stars near mouse
        if (mouse.active) {
          for (let j = i + 1; j < stars.length; j++) {
            const starB = stars[j];
            const dx = star.x - starB.x;
            const dy = star.y - starB.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 70) {
              const distToMouse = Math.hypot(mouse.x - star.x, mouse.y - star.y);
              if (distToMouse < 140) {
                const lineAlpha = (1 - dist / 70) * (1 - distToMouse / 140) * 0.25;
                ctx.strokeStyle = dark
                  ? `rgba(129, 172, 236, ${lineAlpha})`
                  : `rgba(129, 172, 236, ${lineAlpha * 0.5})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(starB.x, starB.y);
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
