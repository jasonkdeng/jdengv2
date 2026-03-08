export function SiteFooter() {
  return (
    <footer className="pt-4 font-mono text-[10px] font-light text-[var(--color-muted)]">
      <div className="mb-5 h-px w-full bg-white/10" />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a
          href="https://github.com/jasonkdeng"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/jasondeng625"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <span>jason.deng[at]uwaterloo.ca</span>
      </div>
    </footer>
  );
}