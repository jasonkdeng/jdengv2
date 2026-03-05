import { PrimaryNavTabs } from "@/components/primary-nav-tabs";

export function SiteHeader() {
  return (
    <header className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Jason Deng</h1>
      <p className="max-w-2xl text-sm text-[var(--color-muted)]">
        Building systems for the physical world
      </p>
      <PrimaryNavTabs />
    </header>
  );
}
