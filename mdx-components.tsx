import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import type { MDXComponents } from "mdx/types";
import { BlogImageContainer, BlogTextContainer } from "@/components/blog-content";

function hasBlockImageChild(children: ReactNode): boolean {
  const normalizedChildren = Children.toArray(children).filter((child) => {
    return !(typeof child === "string" && child.trim() === "");
  });

  return normalizedChildren.some((child) => {
    if (!isValidElement(child)) return false;

    const childProps = child.props as {
      src?: unknown;
      children?: ReactNode;
    };

    if (typeof child.type === "string") {
      return child.type === "img" || child.type === "figure";
    }

    if (child.type === BlogImageContainer) {
      return true;
    }

    // MDX may transform image nodes before paragraph rendering. If an element
    // carries an image-like src prop, treat it as block image content.
    if (typeof childProps.src === "string") {
      return true;
    }

    if (childProps.children) {
      return hasBlockImageChild(childProps.children);
    }

    return false;
  });
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
      hasBlockImageChild(children) ? (
        <>{children}</>
      ) : (
        <BlogTextContainer>
          <p {...props}>{children}</p>
        </BlogTextContainer>
      )
    ),
    img: ({ src = "", alt = "", title }: ComponentPropsWithoutRef<"img">) => {
      const normalizedSrc = typeof src === "string" ? src : "";
      const normalizedAlt = typeof alt === "string" ? alt : "";
      const normalizedCaption = typeof title === "string" ? title : undefined;

      return (
        <BlogImageContainer
          src={normalizedSrc}
          alt={normalizedAlt}
          caption={normalizedCaption}
        />
      );
    },
    h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
      <h2 {...props} className="blog-section-heading">
        {children}
      </h2>
    ),
    a: ({
      children,
      className,
      href,
      rel,
      target,
      ...props
    }: ComponentPropsWithoutRef<"a">) => {
      const normalizedTarget = target ?? "_blank";

      const normalizedRel =
        normalizedTarget === "_blank"
          ? [rel, "noopener noreferrer"].filter(Boolean).join(" ")
          : rel;

      return (
        <a
          {...props}
          href={href}
          target={normalizedTarget}
          rel={normalizedRel}
          className={["group inline-link", className].filter(Boolean).join(" ")}
        >
          <span className="inline-link-label">{children}</span>
        </a>
      );
    },
    ...components,
  };
}
