"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
}

export function StarfieldBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const getDensity = () => {
      const val = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--theme-particle-density") ||
          "0.6"
      );
      return Math.max(0.1, val);
    };

    const generateStars = (width: number, height: number): Star[] => {
      const density = getDensity();
      const starCount = Math.round(100 + density * 300);
      const stars: Star[] = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.7 + 0.3,
          animationDelay: Math.random() * 3000,
        });
      }
      return stars;
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = generateStars(canvas.width, canvas.height);
    };
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    let time = 0;

    function animate() {
      time += 16;
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const density = getDensity();

      starsRef.current.forEach((star) => {
        const twinkle = Math.sin((time + star.animationDelay) / 500) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(96, 247, 252, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      canvas.style.opacity = `${density}`;

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />;
}
