"use client";

import { useEffect, useRef } from "react";

interface ParticlesProps {
  count?: number;
  interval?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

const colors = ["cyan", "purple", "blue"] as const;

export function Particles({ count = 30, interval = 100 }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particleIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colorStrings: Record<string, string> = {
      cyan: "rgba(96, 247, 252,",
      purple: "rgba(168, 85, 247,",
      blue: "rgba(59, 130, 246,",
    };

    const createParticle = (canvas: HTMLCanvasElement): Particle => {
      const colorKey = colors[Math.floor(Math.random() * colors.length)] ?? "cyan";
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        size: Math.random() * 4 + 2,
        color: colorKey,
        life: 0,
        maxLife: Math.random() * 200 + 100,
      };
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const maxParticles = count * 2;
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(createParticle(canvas));
    }

    particleIntervalRef.current = setInterval(() => {
      if (particlesRef.current.length < maxParticles) {
        particlesRef.current.push(createParticle(canvas));
      }
    }, interval);

    const animate = () => {
      const update = (canvas: HTMLCanvasElement) => {
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life++;

          if (p.life >= p.maxLife) {
            Object.assign(p, createParticle(canvas));
          }
        });
      };

      const draw = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        particlesRef.current.forEach((p) => {
          const opacity = 1 - p.life / p.maxLife;
          const colorStr = colorStrings[p.color] || colorStrings.cyan;
          ctx.fillStyle = `${colorStr} ${opacity})`;
          ctx.shadowColor = `${colorStr} 1)`;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      update(canvas);
      draw(ctx);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
      }
    };
  }, [count, interval]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.4 }}
    />
  );
}
