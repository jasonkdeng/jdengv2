"use client";

import { usePathname } from "next/navigation";
import { InteractiveGridBackground } from "@/components/interactive-grid-background";

export function BackgroundLayer() {
  const pathname = usePathname();
  const isBlogDetailPage = pathname !== "/blog" && pathname.startsWith("/blog/");

  if (isBlogDetailPage) {
    return null;
  }

  return <InteractiveGridBackground />;
}
