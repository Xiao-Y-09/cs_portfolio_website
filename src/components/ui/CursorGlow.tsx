"use client";

import { useEffect, useRef } from "react";

/**
 * 跟着鼠标走的一团柔光，压在内容下面。
 *
 * 只有一个 div：每帧改 transform 和 opacity，都是合成器属性，不触发
 * 重排或重绘。之前那版粒子背景每帧要做 O(点数²) 次配对检查，窗口一大就卡，
 * 这里不存在那个问题 —— 工作量跟窗口大小无关。
 *
 * 半径和亮度读 design-tokens.css 的 --glow-*，跟卡片高光是同一组值；
 * 颜色用 --color-spot（浅灰底上靠提亮）、强度用 --spot-intensity，
 * 都跟卡片那支 --color-glow / --glow-intensity 分开。
 */
export default function CursorGlow() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;

    // 关了动效就不做 —— 光是缓动跟随的。触屏也不做：没有悬停。
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    const css = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: number) => {
      const v = parseFloat(css.getPropertyValue(name));
      return Number.isFinite(v) ? v : fallback;
    };
    const radius = token("--glow-radius", 400) * 1.5;
    // 跟随 1–100 → 60fps 下每帧的缓动系数 0.02–0.5
    const followK = 0.02 + (token("--glow-follow", 5) / 100) * 0.48;

    // tx/ty 是鼠标真实位置，x/y 慢慢追上去
    const m = { tx: 0, ty: 0, x: 0, y: 0, active: false, glow: 0 };
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      // 缓动按真实经过的时间折算，所以 60Hz 和 120Hz 屏上手感一样
      const steps = last ? Math.min(64, now - last) / (1000 / 60) : 1;
      last = now;
      const ease = 1 - Math.pow(1 - followK, steps);
      m.x += (m.tx - m.x) * ease;
      m.y += (m.ty - m.y) * ease;
      m.glow += ((m.active ? 1 : 0) - m.glow) * (1 - Math.pow(0.92, steps));
      spot.style.opacity = m.glow.toFixed(3);
      spot.style.transform = `translate3d(${m.x - radius}px, ${m.y - radius}px, 0)`;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      m.tx = e.clientX;
      m.ty = e.clientY;
      // 刚进来时直接出现在鼠标处，不要从上一次离开的地方飞过来
      if (!m.active && m.glow < 0.01) {
        m.x = m.tx;
        m.y = m.ty;
      }
      m.active = true;
    };
    const onLeave = () => {
      m.active = false;
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "calc(var(--glow-radius) * 3px)",
        height: "calc(var(--glow-radius) * 3px)",
        // 负 z-index 能生效，是因为背景色挂在 body 上、html 上没有，
        // body 的背景会上浮成根画布背景画在最底层。
        // 千万别再给 html 加 background，否则光晕会被盖住。
        zIndex: -1,
        pointerEvents: "none",
        borderRadius: "50%",
        opacity: 0,
        willChange: "transform, opacity",
        background:
          "radial-gradient(closest-side, rgba(var(--color-spot), var(--spot-intensity)) 0%, rgba(var(--color-spot), calc(var(--spot-intensity) * 0.55)) 28%, rgba(var(--color-spot), 0) 100%)",
      }}
    />
  );
}
