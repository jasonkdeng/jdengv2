import type { ReactNode } from "react";

type BlogTextContainerProps = {
  children: ReactNode;
};

type BlogImageContainerProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function BlogTextContainer({ children }: BlogTextContainerProps) {
  return <div className="blog-text-container">{children}</div>;
}

export function BlogImageContainer({ src, alt, caption }: BlogImageContainerProps) {
  return (
    <figure className="blog-image-container">
      <img src={src} alt={alt} className="blog-image" />
      {caption ? <figcaption className="blog-image-caption">{caption}</figcaption> : null}
    </figure>
  );
}
