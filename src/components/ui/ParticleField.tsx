"use client";

import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  /** 点半径基准值。每个点会在 0.45–1.4 倍之间随机，让场有纵深。 */
  size?: number;
  /**
   * 每个点平均连多少个邻居 —— 这才是"网有多密"的真实指标。
   * 点数由它和视口面积反推，所以手机和 4K 屏看到的密度是一样的。
   */
  density?: number;
  /** 两点距离小于这个值(px)才连线。 */
  linkDistance?: number;
  /** 点数上下限。上限纯粹是性能护栏，正常不会触到。 */
  minCount?: number;
  maxCount?: number;
  /** 点的不透明度。连线永远只有它的一小部分，否则整片会糊成白雾。 */
  alpha?: number;
  /** 每帧位移上限(px)。0 = 完全静止。 */
  speed?: number;
}

/**
 * 铺满视口的粒子网背景。
 *
 * 密度而不是点数才是被确认过的那个量：目标是每点平均连 140 个邻居，
 * 手感对应手动调参时 count 187 / link 420 在 ~800px 宽视口下的样子。
 *
 *   每点邻居数 ≈ (点数 ÷ 视口面积) × π × 连线距离²
 *   ⇒ 点数 = 密度 × 视口面积 ÷ (π × 连线距离²)
 *
 * 所以点数是按视口面积算出来的，不是写死的 —— 否则同一个数字在手机上
 * 会密到糊成白雾（390px 宽时每点连 315 个），在 4K 上又稀得看不出是张网。
 */
export default function ParticleField({
  size = 2.4,
  density = 140,
  linkDistance = 420,
  minCount = 24,
  maxCount = 1000,
  alpha = 0.62,
  speed = 0.64,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let count = 0;
    let raf = 0;
    let dots: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    // 颜色跟着主题走，不写死
    const rgb =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-particle")
        .trim() || "185, 195, 208";

    // 连线浓度按密度补偿。密度是固定的，所以这个系数也是固定的 ——
    // 没有它，140 的密度会让整片糊成白雾。
    const lineAlpha = alpha * 0.34 * Math.min(1, Math.max(0.24, 70 / density));

    // 连线按透明度分档，每档攒成一条路径一次画完
    const ALPHA_STEPS = 12;
    const buckets: number[][] = Array.from({ length: ALPHA_STEPS }, () => []);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 点数跟着视口面积走，密度才能在所有屏幕上保持一致
      const ideal = (density * w * h) / (Math.PI * linkDistance * linkDistance);
      count = Math.round(Math.min(maxCount, Math.max(minCount, ideal)));
    };

    const seed = () => {
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: 0.45 + Math.random() * 0.95,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = Math.max(0.8, size * 0.32);

      for (const d of dots) {
        if (!still) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0 || d.x > w) d.vx *= -1;
          if (d.y < 0 || d.y > h) d.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, size * d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${alpha * (0.55 + d.r * 0.4)})`;
        ctx.fill();
      }

      // 连线按透明度分桶批量画。逐条 beginPath+stroke 的话，密度一高
      // 就是几万次状态切换 —— 大屏上实测从 60fps 掉到 21fps。
      // 分成 ALPHA_STEPS 档之后只剩十来次 stroke，透明度量化到这个粒度
      // 在背景上完全看不出来。
      for (const p of buckets) {
        p.length = 0;
      }

      const link2 = linkDistance * linkDistance;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= link2) continue;
          // 先比距离平方，只有真要画的那些才开方
          const t = 1 - Math.sqrt(d2) / linkDistance;
          const slot = Math.min(ALPHA_STEPS - 1, (t * ALPHA_STEPS) | 0);
          buckets[slot].push(a.x, a.y, b.x, b.y);
        }
      }

      for (let s = 0; s < ALPHA_STEPS; s++) {
        const seg = buckets[s];
        if (!seg.length) continue;
        ctx.strokeStyle = `rgba(${rgb}, ${((s + 0.5) / ALPHA_STEPS) * lineAlpha})`;
        ctx.beginPath();
        for (let k = 0; k < seg.length; k += 4) {
          ctx.moveTo(seg[k], seg[k + 1]);
          ctx.lineTo(seg[k + 2], seg[k + 3]);
        }
        ctx.stroke();
      }
    };

    const frame = () => {
      draw();
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      resize();
      seed();
      if (still) draw();
    };

    resize();
    seed();

    // 关了动效就画一帧静态的网 —— 比整个消失好看，也仍然守住了偏好
    if (still) draw();
    else frame();

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [size, density, linkDistance, minCount, maxCount, alpha, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        // 负 z-index 能生效，是因为背景色挂在 body 上、html 上没有，
        // body 的背景会上浮成根画布背景画在最底层。
        // 千万别再给 html 加 background，否则粒子会被盖住。
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
