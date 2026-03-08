import Image from "next/image";

type ProjectCard = {
  title: string;
  description: string;
  year: string;
  imageSrc: string;
  imageAlt: string;
};

const SHIMMER_SVG = `
<svg width="32" height="18" viewBox="0 0 32 18" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#1a1d1f" offset="0%" />
      <stop stop-color="#242a2e" offset="50%" />
      <stop stop-color="#1a1d1f" offset="100%" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="32" height="18" fill="url(#g)" />
</svg>
`;

const shimmerDataUrl = `data:image/svg+xml;base64,${Buffer.from(SHIMMER_SVG).toString("base64")}`;

const projects: ProjectCard[] = [
  {
    title: "Waturbine",
    description: "Web Dev lead, Controls and Mechanical Team Member.",
    year: "2025-Present",
    imageSrc: "/WaturbineMockup2.png",
    imageAlt: "Waturbine Website Preview",
  },
  {
    title: "GrassrootsKW",
    description: "Platform for Environmental Event Outreach and Community Building.",
    year: "2025-Present",
    imageSrc: "/GrassrootsMockup.png",
    imageAlt: "Grassroots project preview",
  },
  {
    title: "Agely",
    description: "Web Navigation for the unfamiliar. 1st Place @ Spurhacks",
    year: "2025",
    imageSrc: "/Agely1.png",
    imageAlt: "Agely Preview",
  },
  {
    title: "The Question of Congestion",
    description: "A deep RNN data analysis of Congestion Patterns in Downtown Toronto.",
    year: "2025",
    imageSrc: "/Industry4.png",
    imageAlt: "The Question of Congestion Preview",
  },
];

export default function ProjectsPage() {
  return (
    <section className="project-overview" aria-label="Project overview">
      <p className="mb-3 text-xs text-[var(--color-muted)]">
        See all of my projects on my{" "}
        <a
          href="https://github.com/jasonkdeng"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-link"
        >
          <span className="inline-link-label">GitHub</span>
        </a>
        .
      </p>
      <ul className="project-grid" role="list">
        {projects.map((project, index) => (
          <li key={project.title} className="project-card">
            <div className="project-card-image-wrap">
              <Image
                src={project.imageSrc}
                alt={project.imageAlt}
                fill
                className="project-card-image"
                quality={82}
                sizes="(max-width: 640px) calc(100vw - 3rem), 656px"
                placeholder="blur"
                blurDataURL={shimmerDataUrl}
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
              />
            </div>

            <div className="project-card-content">
              <div className="project-card-meta-row">
                <h2 className="project-card-title">{project.title}</h2>
                <span className="project-card-year">{project.year}</span>
              </div>
              <p className="project-card-description">{project.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
