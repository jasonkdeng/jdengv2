"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const InteractiveGridBackground = dynamic(
  () =>
    import("@/components/interactive-grid-background").then(
      (module) => module.InteractiveGridBackground,
    ),
  {
    ssr: false,
  },
);

export function BackgroundLayer() {
  const pathname = usePathname();
  const [shouldRenderInteractiveBackground, setShouldRenderInteractiveBackground] =
    useState(false);
  const isBlogDetailPage = pathname !== "/blog" && pathname.startsWith("/blog/");

  useEffect(() => {
    if (isBlogDetailPage) {
      setShouldRenderInteractiveBackground(false);
      return;
    }

    const canAnimate =
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!canAnimate) {
      setShouldRenderInteractiveBackground(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      setShouldRenderInteractiveBackground(true);
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(start, { timeout: 300 });

      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    timeoutId = globalThis.setTimeout(start, 150);

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
      }
    };
  }, [isBlogDetailPage]);

  if (isBlogDetailPage) {
    return null;
  }

  if (!shouldRenderInteractiveBackground) {
    return null;
  }

  return <InteractiveGridBackground />;
}
