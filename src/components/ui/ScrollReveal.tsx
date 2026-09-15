"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 揭示所有带 [data-reveal] 的元素。
 *
 * 首屏内的直接按顺序放出来（用户已经在看了，等滚动没有意义）；
 * 首屏外的交给 IntersectionObserver，滚到了才揭示。
 *
 * 渲染 null，只挂一次在 layout 里。CSS 那边负责起始态和兜底：
 * 减动效时 [data-reveal] 直接可见，JS 缺席时 <noscript> 里的样式接管。
 *
 * 依赖 pathname 是必须的：App Router 的 layout 在客户端导航之间不卸载，
 * 只跑一次的话，从详情页返回后新渲染的卡片没人观察，会永远停在 opacity:0。
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let io: IntersectionObserver | null = null;

    // 等一帧再量：返回导航时浏览器要先恢复滚动位置，
    // 立刻量的话首屏判断会基于错误的滚动位置。
    const raf = requestAnimationFrame(() => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal]")
      );
      if (!nodes.length) return;

      const show = (el: HTMLElement) => el.classList.add("is-revealed");

      // 没有 IntersectionObserver 就全部放出来，总比留在隐藏态强
      if (!("IntersectionObserver" in window)) {
        nodes.forEach(show);
        return;
      }

      const fold = window.innerHeight;
      const pending: HTMLElement[] = [];

      nodes.forEach((el) => {
        if (el.getBoundingClientRect().top < fold) show(el);
        else pending.push(el);
      });

      if (!pending.length) return;

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            show(entry.target as HTMLElement);
            io?.unobserve(entry.target);
          });
        },
        // 稍微等元素进来一点再触发，卡在视口边缘上就开始播会很突兀
        { rootMargin: "0px 0px -10% 0px" }
      );

      pending.forEach((el) => io?.observe(el));
    });

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}
