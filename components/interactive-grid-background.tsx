"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const GRID_SPACING = 24;
const LINE_COLOR = "#5C7F67";
const LINE_OPACITY = 0.10;
const LINE_THICKNESS = 1;

const DISTORTION_STRENGTH = 14;
const DISTORTION_RADIUS = 38000;
const DISTORTION_CUTOFF_RADIUS = 320;
const CURSOR_EASING = 0.14;
const FORCE_EASING = 0.08;
const MOTION_EPSILON = 0.1;
const FORCE_EPSILON = 0.002;

type Point = {
  x: number;
  y: number;
};

export function InteractiveGridBackground() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const horizontalLines = useMemo(() => {
    if (viewport.height === 0) return [];
    return Array.from(
      { length: Math.ceil(viewport.height / GRID_SPACING) + 1 },
      (_, index) => index,
    );
  }, [viewport.height]);

  const verticalLines = useMemo(() => {
    if (viewport.width === 0) return [];
    return Array.from(
      { length: Math.ceil(viewport.width / GRID_SPACING) + 1 },
      (_, index) => index,
    );
  }, [viewport.width]);

  const horizontalPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const verticalPathRefs = useRef<(SVGPathElement | null)[]>([]);

  const targetPointer = useRef<Point>({ x: -9999, y: -9999 });
  const pointer = useRef<Point>({ x: -9999, y: -9999 });
  const pointerForceTarget = useRef(0);
  const pointerForce = useRef(0);
  const startAnimationRef = useRef<() => void>(() => {});

  const toPath = (points: Point[]) => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let index = 1; index < points.length; index += 1) {
      d += ` L ${points[index].x} ${points[index].y}`;
    }

    return d;
  };

  const horizontalStaticPaths = useMemo(() => {
    if (viewport.width === 0) return [];

    return horizontalLines.map((lineIndex) => {
      const y = lineIndex * GRID_SPACING;
      const points: Point[] = [];

      for (let x = 0; x <= viewport.width + GRID_SPACING; x += GRID_SPACING) {
        points.push({ x, y });
      }

      return toPath(points);
    });
  }, [horizontalLines, viewport.width]);

  const verticalStaticPaths = useMemo(() => {
    if (viewport.height === 0) return [];

    return verticalLines.map((lineIndex) => {
      const x = lineIndex * GRID_SPACING;
      const points: Point[] = [];

      for (let y = 0; y <= viewport.height + GRID_SPACING; y += GRID_SPACING) {
        points.push({ x, y });
      }

      return toPath(points);
    });
  }, [verticalLines, viewport.height]);

  useEffect(() => {
    const syncViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetPointer.current.x = event.clientX;
      targetPointer.current.y = event.clientY;
      pointerForceTarget.current = 1;
      startAnimationRef.current();
    };

    const handleMouseLeave = () => {
      pointerForceTarget.current = 0;
      startAnimationRef.current();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (viewport.width === 0 || viewport.height === 0) return;

    let rafId = 0;
    let isAnimating = false;
    const activeHorizontal = new Set<number>();
    const activeVertical = new Set<number>();
    const cutoffSquared = DISTORTION_CUTOFF_RADIUS * DISTORTION_CUTOFF_RADIUS;

    const distortPoint = (x: number, y: number): Point => {
      const dx = x - pointer.current.x;
      const dy = y - pointer.current.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared > cutoffSquared || pointerForce.current < FORCE_EPSILON) {
        return { x, y };
      }

      const distance = Math.sqrt(distanceSquared) || 1;

      const displacement =
        DISTORTION_STRENGTH *
        pointerForce.current *
        Math.exp(-distanceSquared / DISTORTION_RADIUS);

      return {
        x: x + (dx / distance) * displacement,
        y: y + (dy / distance) * displacement,
      };
    };

    const resetInactiveLines = (
      previousActive: Set<number>,
      nextActive: Set<number>,
      refs: (SVGPathElement | null)[],
      staticPaths: string[],
    ) => {
      for (const lineIndex of previousActive) {
        if (nextActive.has(lineIndex)) continue;
        const path = refs[lineIndex];
        if (!path) continue;
        path.setAttribute("d", staticPaths[lineIndex] ?? "");
      }

      previousActive.clear();
      for (const lineIndex of nextActive) {
        previousActive.add(lineIndex);
      }
    };

    const animate = () => {
      pointer.current.x +=
        (targetPointer.current.x - pointer.current.x) * CURSOR_EASING;
      pointer.current.y +=
        (targetPointer.current.y - pointer.current.y) * CURSOR_EASING;
      pointerForce.current +=
        (pointerForceTarget.current - pointerForce.current) * FORCE_EASING;

      const nextHorizontalActive = new Set<number>();
      const nextVerticalActive = new Set<number>();

      if (pointerForce.current >= FORCE_EPSILON) {
        const minHorizontal = Math.max(
          0,
          Math.floor((pointer.current.y - DISTORTION_CUTOFF_RADIUS) / GRID_SPACING),
        );
        const maxHorizontal = Math.min(
          horizontalLines.length - 1,
          Math.ceil((pointer.current.y + DISTORTION_CUTOFF_RADIUS) / GRID_SPACING),
        );

        for (let yIndex = minHorizontal; yIndex <= maxHorizontal; yIndex += 1) {
          const path = horizontalPathRefs.current[yIndex];
          if (!path) continue;

          const y = yIndex * GRID_SPACING;
          const points: Point[] = [];

          for (
            let x = 0;
            x <= viewport.width + GRID_SPACING;
            x += GRID_SPACING
          ) {
            points.push(distortPoint(x, y));
          }

          path.setAttribute("d", toPath(points));
          nextHorizontalActive.add(yIndex);
        }

        const minVertical = Math.max(
          0,
          Math.floor((pointer.current.x - DISTORTION_CUTOFF_RADIUS) / GRID_SPACING),
        );
        const maxVertical = Math.min(
          verticalLines.length - 1,
          Math.ceil((pointer.current.x + DISTORTION_CUTOFF_RADIUS) / GRID_SPACING),
        );

        for (let xIndex = minVertical; xIndex <= maxVertical; xIndex += 1) {
          const path = verticalPathRefs.current[xIndex];
          if (!path) continue;

          const x = xIndex * GRID_SPACING;
          const points: Point[] = [];

          for (
            let y = 0;
            y <= viewport.height + GRID_SPACING;
            y += GRID_SPACING
          ) {
            points.push(distortPoint(x, y));
          }

          path.setAttribute("d", toPath(points));
          nextVerticalActive.add(xIndex);
        }
      }

      resetInactiveLines(
        activeHorizontal,
        nextHorizontalActive,
        horizontalPathRefs.current,
        horizontalStaticPaths,
      );
      resetInactiveLines(
        activeVertical,
        nextVerticalActive,
        verticalPathRefs.current,
        verticalStaticPaths,
      );

      const pointerXDelta = Math.abs(targetPointer.current.x - pointer.current.x);
      const pointerYDelta = Math.abs(targetPointer.current.y - pointer.current.y);
      const forceDelta = Math.abs(pointerForceTarget.current - pointerForce.current);
      const shouldContinue =
        pointerXDelta > MOTION_EPSILON ||
        pointerYDelta > MOTION_EPSILON ||
        forceDelta > FORCE_EPSILON ||
        pointerForce.current > FORCE_EPSILON;

      if (!shouldContinue) {
        isAnimating = false;
        return;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (isAnimating) return;
      isAnimating = true;
      rafId = window.requestAnimationFrame(animate);
    };

    startAnimationRef.current = startAnimation;

    return () => {
      startAnimationRef.current = () => {};
      window.cancelAnimationFrame(rafId);
    };
  }, [
    horizontalLines,
    horizontalStaticPaths,
    verticalLines,
    verticalStaticPaths,
    viewport.height,
    viewport.width,
  ]);

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      width={viewport.width}
      height={viewport.height}
      viewBox={`0 0 ${viewport.width} ${viewport.height}`}
      preserveAspectRatio="none"
    >
      <rect x="0" y="0" width="100%" height="100%" fill="#111315" />

      {horizontalLines.map((lineIndex) => (
        <path
          key={`h-${lineIndex}`}
          ref={(element) => {
            horizontalPathRefs.current[lineIndex] = element;
          }}
          d={horizontalStaticPaths[lineIndex]}
          stroke={LINE_COLOR}
          strokeOpacity={LINE_OPACITY}
          strokeWidth={LINE_THICKNESS}
          fill="none"
        />
      ))}

      {verticalLines.map((lineIndex) => (
        <path
          key={`v-${lineIndex}`}
          ref={(element) => {
            verticalPathRefs.current[lineIndex] = element;
          }}
          d={verticalStaticPaths[lineIndex]}
          stroke={LINE_COLOR}
          strokeOpacity={LINE_OPACITY}
          strokeWidth={LINE_THICKNESS}
          fill="none"
        />
      ))}
    </svg>
  );
}
