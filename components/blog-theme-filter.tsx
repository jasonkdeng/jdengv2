"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BLOG_THEMES, type BlogTheme } from "@/lib/blog-data";

type BlogThemeFilterProps = {
  selectedTheme: "All" | BlogTheme;
};

export function BlogThemeFilter({ selectedTheme }: BlogThemeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleThemeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "All") {
      params.delete("theme");
    } else {
      params.set("theme", value);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="blog-theme-filter-form">
      <label htmlFor="theme" className="blog-theme-filter-label">
        Theme
      </label>
      <select
        id="theme"
        name="theme"
        value={selectedTheme}
        className="blog-theme-filter-select"
        onChange={(event) => handleThemeChange(event.target.value)}
      >
        <option value="All">All</option>
        {BLOG_THEMES.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </div>
  );
}
