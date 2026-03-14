"use client";

import { useEffect, useRef } from "react";

interface RGB { r: number; g: number; b: number; }

// ── 색상 팔레트 ──────────────────────────────────────────────
const VIOLET: RGB = { r: 139, g: 92, b: 246 };
const BLUE:   RGB = { r: 59,  g: 130, b: 246 };
const TEAL:   RGB = { r: 16,  g: 185, b: 129 };
const AMBER:  RGB = { r: 245, g: 158, b: 11  };
const PALETTE: RGB[] = [VIOLET, BLUE, TEAL];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpColor(c1: RGB, c2: RGB, t: number): RGB {
  return { r: lerp(c1.r, c2.r, t), g: lerp(c1.g, c2.g, t), b: lerp(c1.b, c2.b, t) };
}
function rgba(c: RGB, a: number) {
  return `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${a})`;
}
function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export default function HeroVisual() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const animRef    = useRef<number>(0);
  const mouseRef   = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0;
    const dpr = window.devicePixelRatio || 1;

    // ── 캔버스 리사이즈 ────────────────────────────────────
    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas!.width  = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width  = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const cx = () => W * 0.5;
    const cy = () => H * 0.48;

    // ── Node ────────────────────────────────────────────────
    const NODE_COLORS = [VIOLET, BLUE, TEAL, AMBER];
    const NODE_SIZES  = [5, 4, 3.5, 2.5];

    class ONode {
      layer: number; idx: number; pulse: number; pulseSpeed: number;
      size: number; color: RGB; orbitSpeed: number;
      angleOffset: number; radiusBase: number; yStretch: number;

      constructor(layer: number, idx: number, total: number) {
        this.layer = layer;
        this.idx   = idx;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.3 + Math.random() * 0.5;
        this.size  = NODE_SIZES[layer];
        this.color = NODE_COLORS[layer];
        this.orbitSpeed = (0.08 + Math.random() * 0.12) * (layer % 2 === 0 ? 1 : -1);
        this.angleOffset = (idx / total) * Math.PI * 2 + Math.random() * 0.3;
        this.radiusBase  = 45 + layer * 62 + Math.random() * 20;
        this.yStretch    = 0.55 + Math.random() * 0.15;
      }

      getPos(t: number) {
        const angle = this.angleOffset + t * this.orbitSpeed;
        const r = this.radiusBase + Math.sin(t * 0.5 + this.pulse) * 8;
        return { x: cx() + Math.cos(angle) * r, y: cy() + Math.sin(angle) * r * this.yStretch };
      }
    }

    const LAYER_COUNTS = [5, 9, 14, 20];
    const nodes: ONode[] = [];
    LAYER_COUNTS.forEach((count, layer) => {
      for (let i = 0; i < count; i++) nodes.push(new ONode(layer, i, count));
    });

    // ── Particle (주변 떠다니는 입자) ──────────────────────
    class Particle {
      x = 0; y = 0; vx = 0; vy = 0; size = 0; life = 1; decay = 0; color: RGB = VIOLET;
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = -0.1 - Math.random() * 0.3;
        this.size = 0.5 + Math.random() * 1.5;
        this.life = 1;
        this.decay = 0.001 + Math.random() * 0.002;
        this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.life -= this.decay;
        if (this.life <= 0) this.reset();
      }
    }
    const particles = Array.from({ length: 60 }, () => new Particle());

    // ── Signal (연결선 위 이동 입자) ───────────────────────
    interface SigData { from: ONode; to: ONode; t: number; speed: number; alive: boolean; color: RGB; }
    let signals: SigData[] = [];

    function spawnSignal() {
      // 인접 레이어 노드 중 임의 연결
      const fromNode = nodes[Math.floor(Math.random() * nodes.length)];
      const candidates = nodes.filter(n => Math.abs(n.layer - fromNode.layer) === 1);
      if (candidates.length === 0) return;
      const toNode = candidates[Math.floor(Math.random() * candidates.length)];
      if (signals.length < 15) {
        signals.push({
          from: fromNode, to: toNode, t: 0,
          speed: 0.008 + Math.random() * 0.015,
          alive: true,
          color: lerpColor(fromNode.color, toNode.color, 0.5),
        });
      }
    }

    // ── Ring (성장 파동) ────────────────────────────────────
    interface RingData { r: number; maxR: number; speed: number; life: number; color: RGB; }
    let rings: RingData[] = [];

    function spawnRing() {
      rings.push({
        r: 0,
        maxR: 200 + Math.random() * 80,
        speed: 0.6 + Math.random() * 0.4,
        life: 1,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      });
    }

    // ── 메인 드로우 ────────────────────────────────────────
    let time = 0;

    function draw(t: number) {
      // ① 배경 클리어
      ctx!.clearRect(0, 0, W, H);

      // ② 중앙 방사형 글로우 배경
      const bg = ctx!.createRadialGradient(cx(), cy(), 0, cx(), cy(), Math.min(W, H) * 0.6);
      bg.addColorStop(0,   rgba(VIOLET, 0.06));
      bg.addColorStop(0.5, rgba(BLUE,   0.02));
      bg.addColorStop(1,   "transparent");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      // ③ 성장 링 업데이트·렌더
      if (!prefersReduced && Math.random() < 0.008) spawnRing();
      rings = rings.filter(ring => ring.life > 0);
      for (const ring of rings) {
        ring.r += ring.speed;
        ring.life = 1 - ring.r / ring.maxR;
        ctx!.beginPath();
        ctx!.arc(cx(), cy(), ring.r, 0, Math.PI * 2);
        ctx!.strokeStyle = rgba(ring.color, ring.life * 0.08);
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      }

      // ④ 주변 파티클 업데이트·렌더
      for (const p of particles) {
        if (!prefersReduced) p.update();
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = rgba(p.color, p.life * 0.4);
        ctx!.fill();
      }

      // ⑤ 노드 위치 계산
      const positions = nodes.map(n => n.getPos(t));
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      // ⑥ 연결선 렌더 (인접 레이어, 거리 160px 이내)
      const MAX_CONN_DIST = 160;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.abs(nodes[i].layer - nodes[j].layer) !== 1) continue;
          const pi = positions[i], pj = positions[j];
          const d = dist(pi.x, pi.y, pj.x, pj.y);
          if (d > MAX_CONN_DIST) continue;

          const midX = (pi.x + pj.x) / 2, midY = (pi.y + pj.y) / 2;
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

      // ⑦ 시그널 업데이트·렌더
      if (!prefersReduced && Math.random() < 0.04) spawnSignal();
      signals = signals.filter(s => s.alive);
      for (const sig of signals) {
        sig.t += sig.speed;
        if (sig.t >= 1) { sig.alive = false; continue; }

        const fp = positions[nodes.indexOf(sig.from)];
        const tp = positions[nodes.indexOf(sig.to)];
        if (!fp || !tp) continue;

        const sx = lerp(fp.x, tp.x, sig.t);
        const sy = lerp(fp.y, tp.y, sig.t);

        // 트레일 3개
        for (let tr = 0; tr < 3; tr++) {
          const tt = sig.t - sig.speed * (tr + 1) * 2;
          if (tt < 0) continue;
          const tx = lerp(fp.x, tp.x, tt);
          const ty = lerp(fp.y, tp.y, tt);
          ctx!.beginPath();
          ctx!.arc(tx, ty, 1.5 - tr * 0.4, 0, Math.PI * 2);
          ctx!.fillStyle = rgba(sig.color, 0.3 - tr * 0.08);
          ctx!.fill();
        }
        // 본체
        ctx!.beginPath();
        ctx!.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = rgba(sig.color, 0.9);
        ctx!.fill();
        // 글로우
        const sg = ctx!.createRadialGradient(sx, sy, 0, sx, sy, 6);
        sg.addColorStop(0, rgba(sig.color, 0.5));
        sg.addColorStop(1, "transparent");
        ctx!.fillStyle = sg;
        ctx!.beginPath();
        ctx!.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx!.fill();
      }

      // ⑧ 노드 렌더
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const p = positions[i];
        const md = dist(p.x, p.y, mx, my);
        const hover = md < 60;
        const sizeBoost = hover ? 3 : 0;
        const s = n.size + sizeBoost;

        // 글로우
        const glow = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, s * 3);
        glow.addColorStop(0, rgba(n.color, hover ? 0.6 : 0.35));
        glow.addColorStop(1, "transparent");
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, s * 3, 0, Math.PI * 2);
        ctx!.fill();

        // 노드 본체
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, s, 0, Math.PI * 2);
        ctx!.fillStyle = rgba(n.color, 0.9);
        ctx!.fill();

        // 하이라이트
        ctx!.beginPath();
        ctx!.arc(p.x - s * 0.3, p.y - s * 0.3, s * 0.35, 0, Math.PI * 2);
        ctx!.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.4);
        ctx!.fill();
      }

      // ⑨ 중앙 코어
      const pulse = 1 + Math.sin(t * 1.8) * 0.15;
      const coreR = 12 * pulse;

      // 4겹 방사형 글로우
      const glowR = [60, 40, 24, 16];
      const glowA = [0.06, 0.12, 0.25, 0.5];
      for (let i = 0; i < 4; i++) {
        const g = ctx!.createRadialGradient(cx(), cy(), 0, cx(), cy(), glowR[i] * pulse);
        g.addColorStop(0, rgba(VIOLET, glowA[i]));
        g.addColorStop(1, "transparent");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(cx(), cy(), glowR[i] * pulse, 0, Math.PI * 2);
        ctx!.fill();
      }

      // 코어 본체
      const coreGrad = ctx!.createRadialGradient(cx(), cy(), 0, cx(), cy(), coreR);
      coreGrad.addColorStop(0,   rgba({ r: 255, g: 255, b: 255 }, 0.7 + Math.sin(t * 2) * 0.1));
      coreGrad.addColorStop(0.4, rgba(VIOLET, 1));
      coreGrad.addColorStop(1,   rgba(BLUE,   0.8));
      ctx!.beginPath();
      ctx!.arc(cx(), cy(), coreR, 0, Math.PI * 2);
      ctx!.fillStyle = coreGrad;
      ctx!.fill();
    }

    // ── 애니메이션 루프 ────────────────────────────────────
    if (prefersReduced) {
      // 정적 단일 프레임
      draw(5);
    } else {
      function loop() {
        time += 0.016;
        draw(time);
        animRef.current = requestAnimationFrame(loop);
      }
      animRef.current = requestAnimationFrame(loop);
    }

    // ── 이벤트 리스너 ──────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMouseLeave() {
      mouseRef.current = { x: -999, y: -999 };
    }
    function onResize() {
      resize();
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    return () => {
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
