"use client";

import { useEffect, useRef } from "react";

interface RGB {
  r: number;
  g: number;
  b: number;
}

// ── 색상 팔레트 ──────────────────────────────────────────────
const VIOLET: RGB = { r: 139, g: 92, b: 246 };
const BLUE: RGB = { r: 59, g: 130, b: 246 };
const TEAL: RGB = { r: 16, g: 185, b: 129 };
const AMBER: RGB = { r: 245, g: 158, b: 11 };
const PALETTE: RGB[] = [VIOLET, BLUE, TEAL];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpColor(c1: RGB, c2: RGB, t: number): RGB {
  return {
    r: lerp(c1.r, c2.r, t),
    g: lerp(c1.g, c2.g, t),
    b: lerp(c1.b, c2.b, t),
  };
}
function rgba(c: RGB, a: number) {
  return `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${a})`;
}
function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// ── 클래스 정의 (useEffect 바깥 — 재생성 방지) ──────────────

const NODE_COLORS = [VIOLET, BLUE, TEAL, AMBER];
const NODE_SIZES = [5, 4, 3.5, 2.5];
const LAYER_COUNTS = [5, 9, 14, 20];
const MAX_CONN_DIST = 160;

class ONode {
  layer: number;
  pulse: number;
  pulseSpeed: number;
  size: number;
  color: RGB;
  orbitSpeed: number;
  angleOffset: number;
  radiusBase: number;
  yStretch: number;

  constructor(layer: number, idx: number, total: number) {
    this.layer = layer;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.3 + Math.random() * 0.5;
    this.size = NODE_SIZES[layer];
    this.color = NODE_COLORS[layer];
    this.orbitSpeed =
      (0.08 + Math.random() * 0.12) * (layer % 2 === 0 ? 1 : -1);
    this.angleOffset = (idx / total) * Math.PI * 2 + Math.random() * 0.3;
    this.radiusBase = 45 + layer * 62 + Math.random() * 20;
    this.yStretch = 0.55 + Math.random() * 0.15;
  }

  getPos(t: number, cxVal: number, cyVal: number) {
    const angle = this.angleOffset + t * this.orbitSpeed;
    const r = this.radiusBase + Math.sin(t * 0.5 + this.pulse) * 8;
    return {
      x: cxVal + Math.cos(angle) * r,
      y: cyVal + Math.sin(angle) * r * this.yStretch,
    };
  }
}

interface SigData {
  fromIdx: number;
  toIdx: number;
  t: number;
  speed: number;
  alive: boolean;
  color: RGB;
}

interface RingData {
  r: number;
  maxR: number;
  speed: number;
  life: number;
  color: RGB;
}

class Particle {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  size = 0;
  life = 1;
  decay = 0;
  color: RGB = VIOLET;
  private W: number;
  private H: number;

  constructor(W: number, H: number) {
    this.W = W;
    this.H = H;
    this.reset();
  }

  reset() {
    this.x = Math.random() * (this.W || 400);
    this.y = Math.random() * (this.H || 400);
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = -0.1 - Math.random() * 0.3;
    this.size = 0.5 + Math.random() * 1.5;
    this.life = 1;
    this.decay = 0.001 + Math.random() * 0.002;
    this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    if (this.life <= 0) this.reset();
  }

  updateBounds(W: number, H: number) {
    this.W = W;
    this.H = H;
  }
}

// ── 컴포넌트 ─────────────────────────────────────────────────

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const stateRef = useRef<{
    W: number;
    H: number;
    time: number;
    nodes: ONode[];
    particles: Particle[];
    signals: SigData[];
    rings: RingData[];
    running: boolean;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 장식용 비주얼 — prefers-reduced-motion 무관하게 항상 애니메이션 실행
    const dpr = window.devicePixelRatio || 1;

    // ── 상태 초기화 ──────────────────────────────────────
    const state = {
      W: 0,
      H: 0,
      time: 0,
      nodes: [] as ONode[],
      particles: [] as Particle[],
      signals: [] as SigData[],
      rings: [] as RingData[],
      running: true,
    };
    stateRef.current = state;

    // 노드 생성
    LAYER_COUNTS.forEach((count, layer) => {
      for (let i = 0; i < count; i++) {
        state.nodes.push(new ONode(layer, i, count));
      }
    });

    // ── 캔버스 리사이즈 ──────────────────────────────────
    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      // getBoundingClientRect가 0 반환 시 offsetWidth/Height fallback
      state.W = rect.width  || parent.offsetWidth  || 340;
      state.H = rect.height || parent.offsetHeight || 340;
      canvas!.width = state.W * dpr;
      canvas!.height = state.H * dpr;
      canvas!.style.width = `${state.W}px`;
      canvas!.style.height = `${state.H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 파티클 초기화 (리사이즈 시 bounds 업데이트)
      if (state.particles.length === 0) {
        for (let i = 0; i < 60; i++) {
          state.particles.push(new Particle(state.W, state.H));
        }
      } else {
        state.particles.forEach((p) => p.updateBounds(state.W, state.H));
      }
    }
    resize();

    // ── 드로우 함수 ──────────────────────────────────────
    function draw() {
      const { W, H, time: t, nodes, particles, signals, rings } = state;
      if (W === 0 || H === 0) return;

      const cxVal = W * 0.5;
      const cyVal = H * 0.48;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ① 클리어
      ctx!.clearRect(0, 0, W, H);

      // ② 중앙 배경 글로우
      const bg = ctx!.createRadialGradient(
        cxVal, cyVal, 0,
        cxVal, cyVal, Math.min(W, H) * 0.6
      );
      bg.addColorStop(0, rgba(VIOLET, 0.06));
      bg.addColorStop(0.5, rgba(BLUE, 0.02));
      bg.addColorStop(1, "transparent");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      // ③ 성장 링
      if (Math.random() < 0.008) {
        rings.push({
          r: 0,
          maxR: 200 + Math.random() * 80,
          speed: 0.6 + Math.random() * 0.4,
          life: 1,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        });
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += ring.speed;
        ring.life = 1 - ring.r / ring.maxR;
        if (ring.life <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx!.beginPath();
        ctx!.arc(cxVal, cyVal, ring.r, 0, Math.PI * 2);
        ctx!.strokeStyle = rgba(ring.color, ring.life * 0.08);
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      }

      // ④ 파티클
      for (const p of particles) {
        p.update();
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = rgba(p.color, p.life * 0.4);
        ctx!.fill();
      }

      // ⑤ 노드 위치 계산
      const positions = nodes.map((n) => n.getPos(t, cxVal, cyVal));

      // ⑥ 연결선
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.abs(nodes[i].layer - nodes[j].layer) !== 1) continue;
          const pi = positions[i];
          const pj = positions[j];
          const d = dist(pi.x, pi.y, pj.x, pj.y);
          if (d > MAX_CONN_DIST) continue;

          const midX = (pi.x + pj.x) / 2;
          const midY = (pi.y + pj.y) / 2;
          const mouseBoost = dist(midX, midY, mx, my) < 100 ? 0.2 : 0;
          const alpha = (1 - d / MAX_CONN_DIST) * 0.12 + mouseBoost;
          const lw = mouseBoost > 0 ? 1.5 : 0.8;
          const c = lerpColor(nodes[i].color, nodes[j].color, 0.5);

          ctx!.beginPath();
          ctx!.moveTo(pi.x, pi.y);
          ctx!.lineTo(pj.x, pj.y);
          ctx!.strokeStyle = rgba(c, alpha);
          ctx!.lineWidth = lw;
          ctx!.stroke();
        }
      }

      // ⑦ 시그널
      if (Math.random() < 0.04 && signals.length < 15) {
        const fromIdx = Math.floor(Math.random() * nodes.length);
        const fromNode = nodes[fromIdx];
        const candidates: number[] = [];
        nodes.forEach((n, idx) => {
          if (Math.abs(n.layer - fromNode.layer) === 1) candidates.push(idx);
        });
        if (candidates.length > 0) {
          const toIdx =
            candidates[Math.floor(Math.random() * candidates.length)];
          signals.push({
            fromIdx,
            toIdx,
            t: 0,
            speed: 0.008 + Math.random() * 0.015,
            alive: true,
            color: lerpColor(fromNode.color, nodes[toIdx].color, 0.5),
          });
        }
      }

      for (let i = signals.length - 1; i >= 0; i--) {
        const sig = signals[i];
        sig.t += sig.speed;
        if (sig.t >= 1) {
          signals.splice(i, 1);
          continue;
        }

        const fp = positions[sig.fromIdx];
        const tp = positions[sig.toIdx];
        if (!fp || !tp) continue;

        const sx = lerp(fp.x, tp.x, sig.t);
        const sy = lerp(fp.y, tp.y, sig.t);
        const glow = Math.sin(sig.t * Math.PI);

        // 트레일
        for (let tr = 1; tr <= 3; tr++) {
          const tt = Math.max(0, sig.t - tr * 0.03);
          const tx = lerp(fp.x, tp.x, tt);
          const ty = lerp(fp.y, tp.y, tt);
          ctx!.beginPath();
          ctx!.arc(tx, ty, 1.5 - tr * 0.3, 0, Math.PI * 2);
          ctx!.fillStyle = rgba(sig.color, (0.3 - tr * 0.08) * glow);
          ctx!.fill();
        }

        // 본체
        ctx!.beginPath();
        ctx!.arc(sx, sy, 2 + glow * 2, 0, Math.PI * 2);
        ctx!.fillStyle = rgba(sig.color, 0.5 + glow * 0.4);
        ctx!.fill();
      }

      // ⑧ 노드
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const p = positions[i];
        const pulseVal = Math.sin(t * n.pulseSpeed * 4 + n.pulse);
        const breathe = 1 + pulseVal * 0.15;
        const s = n.size * breathe;

        const md = dist(p.x, p.y, mx, my);
        const hover = md < 60 ? 1 - md / 60 : 0;
        const finalSize = s + hover * 3;

        // 글로우
        if (hover > 0 || n.layer === 0) {
          const glowR = finalSize + 8 + hover * 12;
          const gg = ctx!.createRadialGradient(
            p.x, p.y, finalSize,
            p.x, p.y, glowR
          );
          gg.addColorStop(0, rgba(n.color, 0.15 + hover * 0.2));
          gg.addColorStop(1, "transparent");
          ctx!.fillStyle = gg;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx!.fill();
        }

        // 노드 본체
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
        ctx!.fillStyle = rgba(n.color, 0.6 + pulseVal * 0.15 + hover * 0.3);
        ctx!.fill();

        // 밝은 중심
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, finalSize * 0.4, 0, Math.PI * 2);
        ctx!.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.3 + hover * 0.4);
        ctx!.fill();
      }

      // ⑨ 중앙 코어
      const corePulse = 1 + Math.sin(t * 1.5) * 0.15;
      const coreSize = 12 * corePulse;

      // 코어 글로우 4겹
      for (let i = 3; i >= 0; i--) {
        const gr = ctx!.createRadialGradient(
          cxVal, cyVal, 0,
          cxVal, cyVal, coreSize + i * 15
        );
        gr.addColorStop(0, rgba(VIOLET, 0.12 - i * 0.025));
        gr.addColorStop(1, "transparent");
        ctx!.fillStyle = gr;
        ctx!.beginPath();
        ctx!.arc(cxVal, cyVal, coreSize + i * 15, 0, Math.PI * 2);
        ctx!.fill();
      }

      // 코어 본체
      ctx!.beginPath();
      ctx!.arc(cxVal, cyVal, coreSize, 0, Math.PI * 2);
      const cg = ctx!.createRadialGradient(
        cxVal, cyVal, 0,
        cxVal, cyVal, coreSize
      );
      cg.addColorStop(0, rgba({ r: 200, g: 180, b: 255 }, 0.9));
      cg.addColorStop(0.6, rgba(VIOLET, 0.7));
      cg.addColorStop(1, rgba(VIOLET, 0.3));
      ctx!.fillStyle = cg;
      ctx!.fill();

      // 코어 핫 센터
      ctx!.beginPath();
      ctx!.arc(cxVal, cyVal, coreSize * 0.3, 0, Math.PI * 2);
      ctx!.fillStyle = rgba(
        { r: 255, g: 255, b: 255 },
        0.6 + Math.sin(t * 2) * 0.2
      );
      ctx!.fill();
    }

    // ── 애니메이션 루프 (항상 실행) ──────────────────────
    const loop = () => {
      if (!state.running) return;
      state.time += 0.016;
      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    // ── 이벤트 리스너 ────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };
    const onResize = () => {
      resize();
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    // ── 클린업 ───────────────────────────────────────────
    return () => {
      state.running = false;
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
}
