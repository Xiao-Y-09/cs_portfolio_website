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
 * 铺满视口的粒子网背景，外加跟着鼠标的光晕。
 *
 * 密度而不是点数才是被确认过的那个量：目标是每点平均连 140 个邻居，
 * 手感对应手动调参时 count 187 / link 420 在 ~800px 宽视口下的样子。
 *
 *   每点邻居数 ≈ (点数 ÷ 视口面积) × π × 连线距离²
 *   ⇒ 点数 = 密度 × 视口面积 ÷ (π × 连线距离²)
 *
 * 所以点数是按视口面积算出来的，不是写死的 —— 否则同一个数字在手机上
 * 会密到糊成白雾（390px 宽时每点连 315 个），在 4K 上又稀得看不出是张网。
 *
 * 鼠标光晕分两层，共用同一个缓动后的鼠标位置：
 *   - 点亮：鼠标附近**已有的**点和线从 --color-particle 渐变到 --color-glow。
 *     不画任何连到鼠标的线 —— "鼠标连线"那个效果之前被明确否掉过。
 *   - 聚光：一团跟着鼠标走的淡光（下面那个 div），只动 transform，不重绘。
 * 半径 / 亮度 / 跟随 三个值读自 design-tokens.css 的 --glow-*，
 * 和 ProjectCard 的卡片高光是同一组。
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
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const spot = spotRef.current;
    if (!canvas || !spot) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 光晕只给有鼠标的设备：触屏没有悬停。关了动效也不做 —— 光是缓动跟随的。
    const glowOn =
      !still && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let count = 0;
    let raf = 0;
    let dots: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    // 颜色和光晕参数都跟着 token 走，不写死
    const css = getComputedStyle(document.documentElement);
    const rgb = css.getPropertyValue("--color-particle").trim() || "185, 195, 208";
    const glowRgb = css.getPropertyValue("--color-glow").trim() || "122, 162, 247";
    const token = (name: string, fallback: number) => {
      const v = parseFloat(css.getPropertyValue(name));
      return Number.isFinite(v) ? v : fallback;
    };
    const glowRadius = token("--glow-radius", 400);
    const glowIntensity = token("--glow-intensity", 0.25);
    // 跟随 1–100 → 60fps 下每帧的缓动系数 0.02–0.5（和预览页同一个映射）
    const followK = 0.02 + (token("--glow-follow", 5) / 100) * 0.48;
    const spotRadius = glowRadius * 1.5; // 聚光比点亮的光圈大一圈，边缘更柔
    const baseRgb = rgb.split(",").map(Number);
    const accRgb = glowRgb.split(",").map(Number);
    const glowR2 = glowRadius * glowRadius;

    // 缓动后的鼠标位置 + 淡入淡出。tx/ty 是真实位置，x/y 慢慢追上去。
    const mouse = { tx: 0, ty: 0, x: 0, y: 0, active: false, glow: 0 };

    // 连线浓度按密度补偿。密度是固定的，所以这个系数也是固定的 ——
    // 没有它，140 的密度会让整片糊成白雾。
    const lineAlpha = alpha * 0.34 * Math.min(1, Math.max(0.24, 70 / density));

    // 连线按透明度分档，每档攒成一条路径一次画完。
    // lit 是被鼠标点亮的那部分，叠在原线上画一层强调色。
    const ALPHA_STEPS = 12;
    const buckets: number[][] = Array.from({ length: ALPHA_STEPS }, () => []);
    const lit: number[][] = Array.from({ length: ALPHA_STEPS }, () => []);

    // 距鼠标的衰减：中心 1，到光圈边缘平滑落到 0（smoothstep）
    const falloff = (dist: number) => {
      const s = 1 - dist / glowRadius;
      return s <= 0 ? 0 : s * s * (3 - 2 * s);
    };

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

      const lightOn = glowOn && mouse.glow > 0.002;
      const strength = mouse.glow * glowIntensity;

      for (const d of dots) {
        if (!still) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0 || d.x > w) d.vx *= -1;
          if (d.y < 0 || d.y > h) d.vy *= -1;
        }
        const a0 = alpha * (0.55 + d.r * 0.4);
        let fill = `rgba(${rgb}, ${a0})`;
        let radius = size * d.r;
        if (lightOn) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < glowR2) {
            const f = falloff(Math.sqrt(d2)) * strength;
            const mix = Math.min(1, f * 1.4);
            const c = baseRgb.map((v, i) => Math.round(v + (accRgb[i] - v) * mix));
            fill = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a0 + (1 - a0) * f})`;
            radius *= 1 + f * 0.35;
          }
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
      }

      // 连线按透明度分桶批量画。逐条 beginPath+stroke 的话，密度一高
      // 就是几万次状态切换 —— 大屏上实测从 60fps 掉到 21fps。
      // 分成 ALPHA_STEPS 档之后只剩十来次 stroke，透明度量化到这个粒度
      // 在背景上完全看不出来。
      for (let s = 0; s < ALPHA_STEPS; s++) {
        buckets[s].length = 0;
        lit[s].length = 0;
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

          if (lightOn) {
            // 线亮多少看它中点离鼠标多远，只给这条已有的线叠一层强调色
            const mx = (a.x + b.x) / 2 - mouse.x;
            const my = (a.y + b.y) / 2 - mouse.y;
            const m2 = mx * mx + my * my;
            if (m2 < glowR2) {
              const v = falloff(Math.sqrt(m2)) * strength * t;
              if (v > 0.03) {
                lit[Math.min(ALPHA_STEPS - 1, (v * ALPHA_STEPS) | 0)].push(a.x, a.y, b.x, b.y);
              }
            }
          }
        }
      }

      const strokeBuckets = (set: number[][], color: string, scale: number) => {
        for (let s = 0; s < ALPHA_STEPS; s++) {
          const seg = set[s];
          if (!seg.length) continue;
          ctx.strokeStyle = `rgba(${color}, ${((s + 0.5) / ALPHA_STEPS) * scale})`;
          ctx.beginPath();
          for (let k = 0; k < seg.length; k += 4) {
            ctx.moveTo(seg[k], seg[k + 1]);
            ctx.lineTo(seg[k + 2], seg[k + 3]);
          }
          ctx.stroke();
        }
      };
      strokeBuckets(buckets, rgb, lineAlpha);
      if (lightOn) strokeBuckets(lit, glowRgb, 0.55);
    };

    // 缓动按真实经过的时间折算，所以 60Hz 和 120Hz 屏上跟随的手感一样
    let last = 0;
    const frame = (now: number) => {
      if (glowOn) {
        const steps = last ? Math.min(64, now - last) / (1000 / 60) : 1;
        const ease = 1 - Math.pow(1 - followK, steps);
        mouse.x += (mouse.tx - mouse.x) * ease;
        mouse.y += (mouse.ty - mouse.y) * ease;
        mouse.glow += ((mouse.active ? 1 : 0) - mouse.glow) * (1 - Math.pow(0.92, steps));
        spot.style.opacity = mouse.glow.toFixed(3);
        spot.style.transform = `translate3d(${mouse.x - spotRadius}px, ${mouse.y - spotRadius}px, 0)`;
      }
      last = now;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      // 刚进来时直接出现在鼠标处，不要从上一次离开的地方飞过来
      if (!mouse.active && mouse.glow < 0.01) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      mouse.active = true;
    };
    const onPointerLeave = () => {
      mouse.active = false;
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
    else raf = requestAnimationFrame(frame);

    window.addEventListener("resize", onResize);
    if (glowOn) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onPointerLeave);
      window.addEventListener("blur", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    };
  }, [size, density, linkDistance, minCount, maxCount, alpha, speed]);

  return (
    <>
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
      {/* 聚光：直径是点亮光圈的 3 倍（半径 1.5 倍）。和画布同一层、排在它后面，
          所以盖在粒子上、压在内容下。位置和透明度由上面的动画循环写。 */}
      <div
        ref={spotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "calc(var(--glow-radius) * 3px)",
          height: "calc(var(--glow-radius) * 3px)",
          zIndex: -1,
          pointerEvents: "none",
          borderRadius: "50%",
          opacity: 0,
          willChange: "transform, opacity",
          background:
            "radial-gradient(closest-side, rgba(var(--color-glow), calc(var(--glow-intensity) * 0.2)) 0%, rgba(var(--color-glow), calc(var(--glow-intensity) * 0.09)) 42%, rgba(var(--color-glow), 0) 100%)",
        }}
      />
    </>
  );
}
