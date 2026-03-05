import type { ReactNode } from "react";

type SectionProps = {
  label: string;
  children: ReactNode;
};

export function Section({ label, children }: SectionProps) {
  return (
    <section className="space-y-5">
      <p className="font-mono text-[0.72rem] font-light uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {label}
      </p>
      <div>{children}</div>
    </section>
  );
}
