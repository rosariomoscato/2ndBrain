# Task 15: Animations & Effects

## Status

complete

## Wave

6

## Description

Add advanced animations and visual effects to enhance the cyberpunk atmosphere. Includes particle effects, starfield backgrounds, scan line overlays, and micro-interactions. These effects create an immersive experience while maintaining performance. Uses CSS animations, keyframes, and JavaScript for interactive effects.

## Dependencies

**Depends on:** task-01-foundation
**Blocks:** None

**Context from dependencies:** task-01 provides design tokens and basic animation classes. This task adds more advanced effects.

## Files to Create

- `src/components/shared/starfield-bg.tsx` — Animated starfield background component
- `src/components/shared/scan-line.tsx` — Scan line overlay component
- `src/components/shared/particles.tsx` — Particle effects component

## Files to Modify

- `src/app/globals.css` — Add advanced animation keyframes
- `src/app/layout.tsx` — Integrate starfield background

## Technical Details

### Implementation Steps

1. Add advanced animation keyframes to src/app/globals.css:

```css
/* Starfield Animation */
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow:
      0 0 5px var(--color-neon-cyan),
      0 0 10px var(--color-neon-cyan),
      0 0 15px var(--color-neon-cyan);
  }
  50% {
    box-shadow:
      0 0 10px var(--color-neon-cyan),
      0 0 20px var(--color-neon-cyan),
      0 0 30px var(--color-neon-cyan);
  }
}

@keyframes neon-flicker {
  0%,
  19%,
  21%,
  23%,
  25%,
  54%,
  56%,
  100% {
    text-shadow:
      0 0 5px var(--color-neon-cyan),
      0 0 10px var(--color-neon-purple),
      0 0 15px var(--color-neon-cyan);
    opacity: 1;
  }
  20%,
  24%,
  55% {
    text-shadow: none;
    opacity: 0.5;
  }
}

@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

@keyframes matrix-rain {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 1000px;
  }
}

@keyframes cyber-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}

/* Particle Animation Classes */
.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.particle-cyan {
  background: var(--color-neon-cyan);
  box-shadow: 0 0 6px var(--color-neon-cyan);
}

.particle-purple {
  background: var(--color-neon-purple);
  box-shadow: 0 0 6px var(--color-neon-purple);
}

.particle-blue {
  background: var(--color-neon-blue);
  box-shadow: 0 0 6px var(--color-neon-blue);
}

.animate-twinkle {
  animation: twinkle 3s ease-in-out infinite;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-neon-flicker {
  animation: neon-flicker 5s infinite;
}

.animate-glitch {
  animation: glitch 0.3s ease-in-out;
}

.animate-cyber-loading {
  animation: cyber-loading 1s linear infinite;
}

.animate-heartbeat {
  animation: heartbeat 1.5s ease-in-out infinite;
}

/* Stagger Delays */
.delay-100 {
  animation-delay: 100ms;
}
.delay-200 {
  animation-delay: 200ms;
}
.delay-300 {
  animation-delay: 300ms;
}
.delay-500 {
  animation-delay: 500ms;
}
.delay-700 {
  animation-delay: 700ms;
}
.delay-1000 {
  animation-delay: 1000ms;
}
```

2. Create src/components/shared/starfield-bg.tsx:

```typescript
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars();
    };

    const stars: Star[] = [];
    const STAR_COUNT = 200;

    const generateStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.7 + 0.3,
          animationDelay: Math.random() * 3000,
        });
      }
    };

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const twinkle = Math.sin((time + star.animationDelay) / 500) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(96, 247, 252, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      time += 16;
      animationFrame = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
}
```

3. Create src/components/shared/scan-line.tsx:

```typescript
import { useEffect, useState } from "react";

interface ScanLineProps {
  color?: "cyan" | "purple" | "blue";
  speed?: number;
  opacity?: number;
}

export function ScanLine({
  color = "cyan",
  speed = 3000,
  opacity = 0.3,
}: ScanLineProps) {
  const [position, setPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let animationFrame: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % speed) / speed;
      setPosition(progress * 100);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [speed]);

  const colorClasses = {
    cyan: "bg-neon-cyan",
    purple: "bg-neon-purple",
    blue: "bg-neon-blue",
  };

  const glowColor = {
    cyan: "rgba(96, 247, 252, 0.5)",
    purple: "rgba(168, 85, 247, 0.5)",
    blue: "rgba(59, 130, 246, 0.5)",
  };

  return (
    <div
      className="absolute inset-x-0 pointer-events-none"
      style={{
        top: `${position}%`,
        height: "2px",
        opacity,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`absolute inset-0 ${colorClasses[color]}`}
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${glowColor[color]},
            transparent
          )`,
        }}
      />
      <div
        className={`absolute inset-0 ${colorClasses[color]} blur-sm`}
        style={{
          opacity: 0.5,
        }}
      />
    </div>
  );
}
```

4. Create src/components/shared/particles.tsx:

```typescript
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: "cyan" | "purple" | "blue";
  life: number;
  maxLife: number;
}

interface ParticlesProps {
  count?: number;
  interval?: number;
}

export function Particles({ count = 30, interval = 100 }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const colors: Particle["color"][] = ["cyan", "purple", "blue"];

    const createParticle = (): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 200 + 100,
      };
    };

    const updateParticles = () => {
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Remove dead particles
        if (p.life >= p.maxLife) {
          Object.assign(p, createParticle());
        }
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        const opacity = 1 - p.life / p.maxLife;
        const color = {
          cyan: "rgba(96, 247, 252,",
          purple: "rgba(168, 85, 247,",
          blue: "rgba(59, 130, 246,",
        }[p.color];

        ctx.fillStyle = `${color}${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowColor = `${color}${opacity * 0.5})`;
        ctx.shadowBlur = 10;
      });
    };

    let animationFrame: number;

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrame = requestAnimationFrame(animate);
    };

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, createParticle);

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    // Add new particles periodically
    const particleInterval = setInterval(() => {
      if (particlesRef.current.length < count * 2) {
        particlesRef.current.push(createParticle());
      }
    }, interval);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
      clearInterval(particleInterval);
    };
  }, [count, interval]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}
```

5. Update src/app/layout.tsx to integrate starfield:

```typescript
import { StarfieldBg } from "@/components/shared/starfield-bg";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${techFont.variable} antialiased`}
      >
        {/* Starfield Background */}
        <StarfieldBg />

        <div className="flex flex-col h-screen overflow-hidden bg-space-black">
          <CyberHeader />
          <div className="flex flex-1 overflow-hidden">
            <CyberSidebar />
            <MainViewport>{children}</MainViewport>
          </div>
        </div>
      </body>
    </html>
  );
}
```

### Code Snippets

CSS keyframe animations:

```css
@keyframes neon-flicker {
  0%,
  19%,
  21%,
  23%,
  25%,
  54%,
  56%,
  100% {
    text-shadow:
      0 0 5px var(--color-neon-cyan),
      ...;
    opacity: 1;
  }
  20%,
  24%,
  55% {
    text-shadow: none;
    opacity: 0.5;
  }
}
```

Canvas animation loop:

```typescript
const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Update and draw
  animationFrame = requestAnimationFrame(animate);
};

animate();
```

### Environment Variables

No environment variables required for this task.

## Acceptance Criteria

- [ ] Advanced animation keyframes added to globals.css
- [ ] Twinkle animation for stars
- [ ] Float animation for floating elements
- [ ] Pulse glow animation for neon effects
- [ ] Neon flicker animation for realistic neon
- [ ] Glitch animation for error states
- [ ] Matrix rain animation (optional)
- [ ] Cyber loading animation
- [ ] Heartbeat animation for status
- [ ] Stagger delay classes (100-1000ms)
- [ ] StarfieldBg component created
- [ ] StarfieldBg uses canvas for rendering
- [ ] StarfieldBg has 200 stars
- [ ] StarfieldBg stars twinkle independently
- [ ] StarfieldBg responsive to window resize
- [ ] StarfieldBg opacity 0.3
- [ ] ScanLine component created
- [ ] ScanLine has 3 color options
- [ ] ScanLine speed configurable (default 3000ms)
- [ ] ScanLine opacity configurable (default 0.3)
- [ ] ScanLine has gradient fade effect
- [ ] ScanLine has blur effect
- [ ] ScanLine pauses on hover
- [ ] Particles component created
- [ ] Particles count configurable (default 30)
- [ ] Particles interval configurable (default 100ms)
- [ ] Particles have 3 color variants
- [ ] Particles move upward
- [ ] Particles fade out over lifetime
- [ ] Particles have glow effect
- [ ] Particles responsive to window resize
- [ ] StarfieldBg integrated into layout
- [ ] All animations use CSS transforms
- [ ] All animations use proper easing
- [ ] All animations are performant
- [ ] All components use TypeScript
- [ ] All components use proper cleanup

## Notes

- Starfield uses canvas for performance
- Stars randomly positioned and sized
- Stars opacity 0.3-1.0
- Stars twinkle using sine wave
- Twinkle uses 3s duration
- Star count 200 for performance
- Canvas opacity 0.3 for subtlety
- Canvas z-index 0 for background
- Canvas pointer-events-none
- Canvas fixed inset-0
- Canvas resizes on window resize
- Animation uses requestAnimationFrame
- Animation loops at 60fps
- Time increments by 16ms per frame
- Twinkle calculation uses time + delay
- Twinkle amplitude 0.5
- Twinkle offset 0.5
- ClearRect each frame
- Stars drawn as arcs
- Stars use neon-cyan color
- Stars use opacity for twinkling
- Stars use star.size for radius
- Stars use 0 to 2π for full circle

- ScanLine uses position state
- ScanLine animates top position
- ScanLine progress 0-1
- ScanLine speed configurable
- ScanLine color variants: cyan, purple, blue
- ScanLine height 2px
- ScanLine opacity configurable
- ScanLine gradient fade left to right
- ScanLine uses inset-x-0
- ScanLine uses absolute positioning
- ScanLine uses pointer-events-none
- ScanLine pauses on mouse enter
- ScanLine resumes on mouse leave
- ScanLine uses useEffect for animation
- ScanLine uses requestAnimationFrame
- ScanLine timestamp calculation
- ScanLine mod operation for loop
- ScanLine blur element for glow
- ScanLine blur uses blur-sm
- ScanLine blur opacity 0.5

- Particles use canvas
- Particles count configurable
- Particles interval configurable
- Particles have 3 color variants
- Particles randomly assigned color
- Particles start at bottom
- Particles move upward
- Particles have horizontal drift
- Particles have size variation
- Particles fade out over lifetime
- Particles lifetime 100-300 frames
- Particles removed when dead
- Particles respawn when dead
- Particles added periodically
- Particles limited to count \* 2
- Particles use glow effect
- Particles use shadowBlur
- Particles use shadowColor
- Particles opacity based on life
- Particles use arc for drawing
- Particles use canvas z-index 0
- Particles use pointer-events-none
- Particles opacity 0.4
- Particles responsive to resize
- Particles use clearInterval on cleanup

- Animation keyframes defined in CSS
- Twinkle: scale 1-1.2, opacity 0.3-1
- Float: translateY 0 to -10px
- Pulse glow: box-shadow expansion
- Neon flicker: text-shadow on/off
- Glitch: translate in 4 directions
- Matrix rain: background-position
- Cyber loading: rotate 0-360deg
- Heartbeat: scale 1-1.3 multiple times
- Delay classes: 100, 200, 300, 500, 700, 1000ms
- Animation classes use infinite
- Animation classes use ease-in-out
- Animation classes use proper timing
- Animation classes use keyframes

- Starfield integrated in layout
- Starfield before main content
- Starfield uses z-index 0
- Starfield fixed positioning
- Starfield pointer-events-none
- Layout uses bg-space-black
- Layout uses flex-col h-screen
- Layout uses overflow-hidden
- Components use modular structure
- Components use proper TypeScript
- Components use proper cleanup
- Components use proper error handling
- Components use proper state management
- Components use proper refs
- Components use proper effects
- Components use proper hooks
- Components use proper performance
- Components use proper memory management
- Components use proper event listeners
- Components use proper animation frames
- Components use proper canvas rendering
- Components use proper resize handling
- Components use proper opacity
- Components use proper z-index
- Components use proper positioning
- Components use proper sizing
- Components use proper colors
- Components use proper effects
- Components use proper styling
- Components use proper layout
- Components use proper structure
- Components use proper hierarchy
- Components use proper organization
