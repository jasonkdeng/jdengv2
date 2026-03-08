declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;

  export const metadata: {
    slug: string;
    title: string;
    postedOn: string;
    theme: "Robots" | "Software" | "Life" | "Nature" | "Other";
    summary?: string;
  };
}
