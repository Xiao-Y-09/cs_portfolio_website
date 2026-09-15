"use client";

import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  /** 点半径基准值。每个点会在 0.45–1.4 倍之间随机，让场有纵深。 */
  size?: number;
  /** 点数量。连线是 O(n²)，但实测 220 点仍稳 60fps，320 以内都安全。 */
  count?: number;
  /** 两点距离小于这个值(px)才连线。点多 + 连线短 = 密网；点少 + 连线长 = 稀疏星座。 */
  linkDistance?: number;
  /** 点的不透明度。连线永远只有它的一小部分，否则整片会糊成白雾。 */
  alpha?: number;
  /** 每帧位移上限(px)。0 = 完全静止。 */
  speed?: number;
  /** 视口窄于这个宽度就完全不跑 —— 手机上这个密度既费电又没意义。 */
  minWidth?: number;
}

/**
 * 铺满视口的粒子网背景。
 *
 * 默认值是手动调出来并确认过的，不要随手改：
 *   size 2.4 · count 187 · link 420 · alpha 0.62 · speed 0.64
 *
 * 注意密度跟视口面积相关 —— 同样的 count，屏幕越小网越密
 * （1280×800 约每点连 100 个，1920×1080 约 50 个）。这是刻意不做归一化的，
 * 因为上面这组值是在具体某块屏上挑的。要全屏一致的话，把 count
 * 乘以 (innerWidth * innerHeight) / (1440 * 900) 即可。
 */
export default function ParticleField({
  size = 2.4,
  count = 187,
  linkDistance = 420,
  alpha = 0.62,
  speed = 0.64,
  minWidth = 768,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.innerWidth < minWidth) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let dots: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    // 颜色跟着主题走，不写死
    const rgb =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-particle")
        .trim() || "185, 195, 208";

    // 点越多每条线就得越淡，否则高密度下整片会糊成白雾。
    // 分母 70 是基准点数，对应最初调参时的观感。
    const lineAlpha = alpha * 0.34 * Math.min(1, Math.max(0.3, 70 / count));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      dots = Array.from({ length: Math.round(count) }, () => ({
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

      // 先比距离平方，省掉每一对点一次开方
      const link2 = linkDistance * linkDistance;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= link2) continue;
          const t = 1 - Math.sqrt(d2) / linkDistance;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${rgb}, ${t * lineAlpha})`;
          ctx.stroke();
        }
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
  }, [size, count, linkDistance, alpha, speed, minWidth]);

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
