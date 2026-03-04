import { useNavigate } from "@tanstack/react-router";
import { BarChart2, Lock, Shield, Users } from "lucide-react";
import { useEffect, useRef } from "react";

const trustBadges = [
  { icon: BarChart2, label: "10,000+ Funds Analyzed" },
  { icon: Shield, label: "SEBI Compliant" },
  { icon: Lock, label: "AES-256 Encrypted" },
  { icon: Users, label: "Trusted by 2,400+ Advisors" },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface Edge {
  a: number;
  b: number;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const EMERALD = "#00c896";
    const GOLD = "#d4af37";
    const AMBER = "#ffb347";

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    };

    const init = () => {
      const count = Math.min(
        40,
        Math.floor((canvas.width * canvas.height) / 14000),
      );
      particlesRef.current = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 3 + 1.5,
        color: i % 5 === 0 ? GOLD : i % 7 === 0 ? AMBER : EMERALD,
        alpha: Math.random() * 0.5 + 0.4,
      }));

      // Build edges between nearby particles
      edgesRef.current = [];
      const threshold = Math.min(canvas.width, canvas.height) * 0.3;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < threshold) {
            edgesRef.current.push({ a: i, b: j });
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      // Draw edges
      for (const edge of edgesRef.current) {
        const p1 = particles[edge.a];
        const p2 = particles[edge.b];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.min(canvas.width, canvas.height) * 0.3;
        const edgeAlpha = (1 - dist / maxDist) * 0.18;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0,200,150,${edgeAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw nodes
      for (const p of particles) {
        // Glow
        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 5,
        );
        if (p.color === GOLD || p.color === AMBER) {
          grad.addColorStop(0, `rgba(212,175,55,${p.alpha * 0.5})`);
          grad.addColorStop(1, "rgba(212,175,55,0)");
        } else {
          grad.addColorStop(0, `rgba(0,200,150,${p.alpha * 0.4})`);
          grad.addColorStop(1, "rgba(0,200,150,0)");
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    document
      .querySelector(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(0,200,150,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(212,175,55,0.04) 0%, transparent 60%), #0d0d0d",
        }}
      />

      {/* Canvas — full background, right-biased on desktop */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 md:opacity-80"
        style={{ zIndex: 1 }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Left: Text */}
        <div className="flex flex-col gap-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 w-fit">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
              style={{
                background: "rgba(0,200,150,0.12)",
                border: "1px solid rgba(0,200,150,0.3)",
                color: "#00c896",
              }}
            >
              ✦ INSTITUTIONAL-GRADE AI
            </span>
          </div>

          {/* Headline */}
          <h1
            className="section-headline text-5xl md:text-6xl xl:text-7xl text-white"
            style={{ lineHeight: "1.05" }}
          >
            Your Portfolio. <span className="gradient-text">Analyzed.</span>{" "}
            <br className="hidden md:block" />
            Optimized. <span className="gradient-text">Automated.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-base md:text-lg leading-relaxed max-w-lg"
            style={{ color: "#a0a0a0" }}
          >
            VVSPL MF Agent processes 10,000+ fund data points in real time —
            delivering institutional-grade recommendations tailored to your
            exact risk profile.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mt-2">
            <button
              type="button"
              data-ocid="hero.primary_button"
              onClick={() => navigate({ to: "/sip-analysis" })}
              className="btn-primary px-7 py-3.5 text-base font-bold"
            >
              Start Free Analysis
            </button>
            <button
              type="button"
              data-ocid="hero.secondary_button"
              onClick={() => scrollToSection("#how-it-works")}
              className="btn-ghost px-7 py-3.5 text-base font-semibold flex items-center gap-2"
            >
              See How It Works
              <span className="text-lg leading-none">→</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/[0.07]">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#d4d4d4",
                }}
              >
                <badge.icon
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "#00c896" }}
                />
                {badge.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Stats card (desktop only) */}
        <div className="hidden md:flex flex-col items-end justify-center gap-5">
          <div className="glass-card p-6 w-72 xl:w-80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wider text-white/40 uppercase">
                Live Performance
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "rgba(0,200,150,0.15)", color: "#00c896" }}
              >
                ● LIVE
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Avg. Sharpe Ratio", value: "2.41", positive: true },
                { label: "Alpha Generated", value: "+4.8%", positive: true },
                { label: "Max Drawdown", value: "-8.3%", positive: false },
                { label: "Consistency Score", value: "94%", positive: true },
              ].map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-white/50">{m.label}</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: m.positive ? "#00c896" : "#ff6b6b" }}
                  >
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 w-72 xl:w-80">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-3 font-semibold">
              Funds Processed Today
            </div>
            <div
              className="section-headline text-4xl"
              style={{ color: "#00c896" }}
            >
              10,847
            </div>
            <div className="text-sm text-white/40 mt-1">
              across all categories
            </div>
            <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
              <div
                className="h-full rounded-full"
                style={{
                  width: "87%",
                  background: "linear-gradient(90deg, #00c896, #d4af37)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5">
        <span className="text-xs text-white/30 tracking-wider uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
