"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Me", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
] as const;

type TopNavTabProps = {
  href: string;
  label: string;
  active: boolean;
};

function TopNavTab({ href, label, active }: TopNavTabProps) {
  return (
    <li>
      <Link href={href} className={`top-nav-tab${active ? " is-active" : ""}`}>
        {label}
      </Link>
    </li>
  );
}

function isTabActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PrimaryNavTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="top-nav-tabs">
      <ul className="top-nav-tabs-list">
        {tabs.map((tab) => {
          const active = isTabActive(pathname, tab.href);

          return (
            <TopNavTab
              key={tab.href}
              href={tab.href}
              label={tab.label}
              active={active}
            />
          );
        })}
      </ul>
    </nav>
  );
}
