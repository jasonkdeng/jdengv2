"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const GRID_SPACING = 24;
const LINE_COLOR = "#5C7F67";
const LINE_OPACITY = 0.10;
const LINE_THICKNESS = 1;

const DISTORTION_STRENGTH = 14;
const DISTORTION_RADIUS = 38000;
const CURSOR_EASING = 0.14;
const FORCE_EASING = 0.08;

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
    };

    const handleMouseLeave = () => {
      pointerForceTarget.current = 0;
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

    const toPath = (points: Point[]) => {
      if (points.length === 0) return "";
      let d = `M ${points[0].x} ${points[0].y}`;

      for (let index = 1; index < points.length; index += 1) {
        d += ` L ${points[index].x} ${points[index].y}`;
      }

      return d;
    };

    const distortPoint = (x: number, y: number): Point => {
      const dx = x - pointer.current.x;
      const dy = y - pointer.current.y;
      const distanceSquared = dx * dx + dy * dy;
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

    const animate = () => {
      pointer.current.x +=
        (targetPointer.current.x - pointer.current.x) * CURSOR_EASING;
      pointer.current.y +=
        (targetPointer.current.y - pointer.current.y) * CURSOR_EASING;
      pointerForce.current +=
        (pointerForceTarget.current - pointerForce.current) * FORCE_EASING;

      for (const yIndex of horizontalLines) {
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
      }

      for (const xIndex of verticalLines) {
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
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [horizontalLines, verticalLines, viewport.height, viewport.width]);

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
          stroke={LINE_COLOR}
          strokeOpacity={LINE_OPACITY}
          strokeWidth={LINE_THICKNESS}
          fill="none"
        />
      ))}
    </svg>
  );
}
