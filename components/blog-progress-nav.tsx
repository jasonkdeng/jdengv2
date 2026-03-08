"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type HeadingItem = {
  id: string;
  title: string;
  level: 2 | 3 | 4 | 5 | 6;
  parentH2Id: string | null;
};

const ACTIVE_TRIGGER_RATIO = 2 / 3;

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogProgressNav() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [visibleIds, setVisibleIds] = useState<string[]>([]);
  const [breathingId, setBreathingId] = useState<string>("");

  const headingElementsRef = useRef<HTMLElement[]>([]);
  const visibleSetRef = useRef<Set<string>>(new Set());

  const expandedSet = useMemo(() => {
    const expanded = new Set(visibleIds);
    if (activeId) {
      expanded.add(activeId);
    }
    return expanded;
  }, [activeId, visibleIds]);

  const hasAnyH2 = useMemo(() => headings.some((heading) => heading.level === 2), [headings]);

  const activeH2Id = useMemo(() => {
    if (headings.length === 0) return "";

    const activeHeading = headings.find((heading) => heading.id === activeId) ?? headings[0];
    if (!activeHeading) return "";

    if (activeHeading.level === 2) {
      return activeHeading.id;
    }

    if (activeHeading.parentH2Id) {
      return activeHeading.parentH2Id;
    }

    return headings.find((heading) => heading.level === 2)?.id ?? "";
  }, [activeId, headings]);

  useEffect(() => {
    const proseRoot = document.querySelector<HTMLElement>("#blog-article .blog-prose");
    if (!proseRoot) return;

    const queriedHeadings = Array.from(
      proseRoot.querySelectorAll<HTMLElement>("h2, h3, h4, h5, h6"),
    );

    const usedIds = new Set<string>();
    let currentH2Id: string | null = null;

    const normalizedHeadings = queriedHeadings.map((heading, index) => {
      const parsedLevel = Number.parseInt(heading.tagName.slice(1), 10);
      const level = parsedLevel >= 2 && parsedLevel <= 6 ? (parsedLevel as 2 | 3 | 4 | 5 | 6) : 2;
      const rawTitle = heading.textContent?.trim() || `Section ${index + 1}`;
      const baseId = heading.id || slugify(rawTitle) || `section-${index + 1}`;
      let nextId = baseId;
      let collisionCount = 1;

      while (usedIds.has(nextId)) {
        collisionCount += 1;
        nextId = `${baseId}-${collisionCount}`;
      }

      usedIds.add(nextId);
      heading.id = nextId;

      if (level === 2) {
        currentH2Id = nextId;
      }

      return {
        id: nextId,
        title: rawTitle,
        level,
        parentH2Id: level === 2 ? nextId : currentH2Id,
      } as HeadingItem;
    });

    headingElementsRef.current = queriedHeadings;
    visibleSetRef.current = new Set();

    const initFrameId = window.requestAnimationFrame(() => {
      setHeadings(normalizedHeadings);
      setActiveId(normalizedHeadings[0]?.id ?? "");
      setVisibleIds([]);
    });

    return () => {
      window.cancelAnimationFrame(initFrameId);
      headingElementsRef.current = [];
      visibleSetRef.current = new Set();
    };
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const findActiveHeading = () => {
      const nodes = headingElementsRef.current;
      if (nodes.length === 0) return "";

      const anchor = window.innerHeight * ACTIVE_TRIGGER_RATIO;
      let current = nodes[0];

      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= anchor) {
          current = node;
        } else {
          break;
        }
      }

      return current.id;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = new Set(visibleSetRef.current);

        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (!id) continue;

          if (entry.isIntersecting) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
        }

        visibleSetRef.current = visible;
        setVisibleIds(Array.from(visible));

        const nextActive = findActiveHeading();
        if (!nextActive || nextActive === activeId) return;

        setActiveId(nextActive);
        setBreathingId(nextActive);

        window.setTimeout(() => {
          setBreathingId((previous) => (previous === nextActive ? "" : previous));
        }, 210);
      },
      {
        root: null,
        rootMargin: "0px 0px -33% 0px",
        threshold: [0, 0.35, 0.7, 1],
      },
    );

    for (const headingElement of headingElementsRef.current) {
      observer.observe(headingElement);
    }

    const handleScroll = () => {
      const nextActive = findActiveHeading();
      if (!nextActive || nextActive === activeId) return;

      setActiveId(nextActive);
      setBreathingId(nextActive);
      window.setTimeout(() => {
        setBreathingId((previous) => (previous === nextActive ? "" : previous));
      }, 210);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [activeId, headings.length]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="blog-progress-nav" aria-label="Article progress navigation">
      <ol className="blog-progress-list">
        {headings.map((heading) => {
          const shouldShowHeading =
            !hasAnyH2 ||
            heading.level === 2 ||
            heading.id === activeId ||
            (heading.parentH2Id !== null && heading.parentH2Id === activeH2Id);

          const isCollapsible = heading.level !== 2;
          const isCollapsed = isCollapsible && !shouldShowHeading;

          const isActive = heading.id === activeId;
          const isParentOfActiveSubsection =
            heading.level === 2 && heading.id === activeH2Id && activeId !== "" && activeId !== activeH2Id;
          const isExpanded = expandedSet.has(heading.id);
          const isBreathing = heading.id === breathingId;

          return (
            <li
              key={heading.id}
              className={[
                "blog-progress-item",
                isCollapsed ? "is-collapsed" : "is-expanded",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <a
                href={`#${heading.id}`}
                className="blog-progress-link"
                aria-current={isActive ? "true" : undefined}
                aria-hidden={isCollapsed ? "true" : undefined}
                tabIndex={isCollapsed ? -1 : undefined}
              >
                <span
                  className={[
                    "blog-progress-tick",
                    heading.level === 2 ? "is-major" : "is-thin",
                    isActive ? "is-active" : "",
                    isBreathing ? "is-breathing" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                <span
                  className={[
                    "blog-progress-label",
                    isExpanded ? "is-expanded" : "",
                    isActive ? "is-active" : "",
                    isParentOfActiveSubsection ? "is-context-visible" : "",
                    isBreathing ? "is-breathing" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {heading.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
